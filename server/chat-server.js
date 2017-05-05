const assert = require('assert');
const net = require('net');
const util = require('util');
const _ = require('lodash');

const config = require('../config.json');

const Room = require('./room');
const User = require('./user');
const Actions = require('./actions')();

const host = _.get(config, 'host', 'localhost');
const port = _.get(config, 'port', 9999);

const actionProcessor = (action, room, user) => {

  switch (action.type) {

  case 'SET_NAME':

    user.setName(action.payload).then(() => {
      room.enter(user);
    }).catch((err) => {
      user.socket.write('Invalid name: ' + err + '\n');
      user.socket.write('Please enter a valid name:' + '\n');
    });
    break;

  case 'BROADCAST':
    room.broadcast(user, action.payload);
    break;

  case 'QUIT':
    room.leave(user);
    assert(user.socket);
    user.socket.end('Good Bye.');
    break;

  case 'USERS':
    assert(user.socket);
    if(room.isUserInRoom(user.getName())) {
      user.socket.write('Users: ' +  room.getUsers().join(',')  + '\n');
    } else {
      user.socket.write('Please enter a valid name:' + '\n');
    }
    break;

  case 'ME':
    if(room.isUserInRoom(user.getName())) {
      // broadcast the emote and include the source user
      room.broadcast(user, user.getName() + action.payload, true);
    } else {
      user.socket.write('Please enter a valid name:' + '\n');
    }
    break;

  default:
    console.error('Unknown unhandled action: ', util.inspect(action));
    break;
  }
};

const createChatServer = () => {

  const chatroom = Room();

  const server = net.createServer((socket) => {

    socket.user = User(socket);

    // register a username validator to insure a username hasn't already been taken
    socket.user.registerUsernameValidator(chatroom.duplicateValidator);
    socket.identity = socket.remoteAddress + ':' + socket.remotePort;

    socket.write('Welcome, please enter a name: ');

    socket.once('close', () => {
      chatroom.leave(socket.user);
    });

    socket.on('end', () => {
      chatroom.leave(socket.user);
    });

    socket.on('data', (data) => {
      const dataAsString = data.toString();
      //util.log('received data from ' + socket.identity + ', ('+ socket.user.getName() + '): ', dataAsString);

      const action = Actions.dataToAction(dataAsString, socket.user);
      if (action) {
        actionProcessor(action, chatroom, socket.user);
      } else {
        console.error('Unknown command, data: ', dataAsString);
        socket.write('Unknown command: ' + dataAsString + '\n');
      }
    });

    socket.on('error', (err) => {
      console.error('socket error on ' + socket.identity + ', err: ', err);
    });
  });

  server.on('error', (err) => {

    switch(err.code) {
    case 'EADDRINUSE':
      console.error('Address ' + host + ':' + port + ' is in use.');
      break;

    default:
      console.error('Unhandled server error, err: ', err);
      break;
    }
  });

  server.listen({ host, port }, () => {
    util.log('server listening on "' + host + ':' + port + '".');
  });
};

createChatServer();
