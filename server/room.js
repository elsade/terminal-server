const assert = require('assert');
const _ = require('lodash');

module.exports = () => {

  let userList = [];
  let messageList = [];

  const messageSourceName = (message) => {
    return  message.src ? message.src.getName() : message.sourceName;
  };

  // TODO: this could be moved to a messages module if the message becomes more complex
  const messageToChatMessage = message => {
    const sourceName = messageSourceName(message);
    return {
      sourceName: sourceName,
      payload: sourceName + ' > ' + message.payload + '\n'
    };
  };

  const findUserByName = name => {
    return _.find(userList, user => {
      return _.isEqual(name, user.getName());
    });
  };

  const broadcast = (message, includeSelf) => {
    assert(message);
    // write the payload to each socket but don't include the source
    const recipients = includeSelf ? userList : _.filter(userList, user => {
      const sourceName = messageSourceName(message);
      return !_.isEqual(sourceName, user.getName());
    });

    _.forEach(recipients, (user) => {
      assert(user.socket);
      user.socket.write(message.payload);
    });
  };

  const broadcastMessage = message => broadcast(messageToChatMessage(message), true);
  const broadcastNotification = notification => broadcast({src: null, payload: notification});

  const duplicateValidator = (username) => {
    if (findUserByName(username)) {
      return {
        valid: false,
        err: 'Username already taken.'
      };
    }

    return {
      valid: true, err: null
    };
  };

  return {
    duplicateValidator: duplicateValidator,
    enter: (user) => {
      const username = user.getName();
      if (!findUserByName(username)) {
        userList.push(user);

        broadcastNotification(username + ' has joined the chat.\n');

        // send the last 10 messages to the newly joined user
        _(messageList).takeRight(10).forEach( message => {
          const messageContent = messageToChatMessage(message);
          user.socket.write(messageContent.payload);
        });
      }
    },
    getUsers: () => {
      return userList.map((user) => {
        return user.getName();
      });
    },
    isUserInRoom: (name) => {
      if(name) {
        return findUserByName(name) ? true : false;
      }

      return false;
    },
    leave: (user) => {
      const index = _.indexOf(userList, user);
      if (index >= 0) {
        userList.splice(index, 1);

        broadcastNotification(user.getName() + ' has left the chat.\n');
      }

      return user;
    },
    broadcast: (src, messageBody, notification) => {
      const sourceName = src ? src.getName() : null;
      const message = {
        src: src,
        sourceName: sourceName,
        payload: messageBody,
      };

      const srcName = src.getName();
      // only allow broadcasting to a room the src is in
      if (findUserByName(srcName)) {

        if (notification) {
          broadcastNotification(message.payload + '\n');
        } else {
          messageList.push(message);
          broadcastMessage(message);
        }
      } else {
        console.error('User can not broadcast prior to join\'ing room.');
      }
    },
  };
};
