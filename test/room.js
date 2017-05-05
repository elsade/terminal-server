const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

// module under test
const Room = require('../server/room');

const User = require('../server/user');

chai.use(require('sinon-chai'));
require('mocha-sinon');

describe('Room tests', () => {
  beforeEach(() => {
  });

  it('module can be required ...', (done) => {
    expect(Room).to.exist;
    done();
  });

  it('module includes the constructor ...', (done) => {
    expect(Room).to.be.a('function');
    done();
  });

  it('enter() works', (done) => {
    const chatroom = Room();
    const socket = {
      write: sinon.spy(),
    };
    const user = User(socket);
    user.setName('Jon Snow').then(() => {
      expect(user.getName()).to.be.eql('Jon Snow');
      chatroom.enter(user);
      expect(chatroom.isUserInRoom('Jon Snow')).to.be.true;
      done();
    });
  });

  it('leave() works ...', (done) => {
    const chatroom = Room();
    const socket = {
      write: sinon.spy(),
    };
    const user = User(socket);
    user.setName('Jon Snow').then(() => {
      expect(user.getName()).to.be.eql('Jon Snow');
      chatroom.enter(user);
      expect(chatroom.isUserInRoom('Jon Snow')).to.be.true;
      chatroom.leave(user);
      expect(chatroom.isUserInRoom('Jon Snow')).to.be.false;

      // we should be idempotent
      chatroom.leave(user);

      done();
    });
  });

  it('broadcast() works', (done) => {
    const chatroom = Room();
    const socket = {
      write: sinon.spy(),
    };

    const socket2 = {
      write: sinon.spy()
    };

    const jon = User(socket);
    jon.setName('Jon Snow').then(() => {
      chatroom.enter(jon);

      // jon receives 'Jon Snow has joined the room.'
      jon.socket.write.withArgs('Jon Snow has joined the room.').calledOnce;

      const tyrion = User(socket2);

      tyrion.setName('Tyrion Lanister').then(() => {

        chatroom.enter(tyrion);

        // jon receives 'Tyrion Lanister has joined the room.'
        jon.socket.write.withArgs('Tyrion Lanister has joined the room.').calledOnce;
        expect(jon.socket.write).calledTwice;

        // tyrion receives 'Tyrion Lanister has joined the room.'
        tyrion.socket.write.withArgs('Tyrion Lanister has joined the room.').calledOnce;

        chatroom.broadcast(tyrion, 'Hi, Jon.');

        // tyrion did not receive his own message
        expect(tyrion.socket.write).calledOnce;

        // jon receives 'Tyrion > Hi, Jon.'
        jon.socket.write.withArgs('Tyrion > Hi, Jon.').calledOnce;
        expect(jon.socket.write).calledThrice;

        done();
      });
    });
  });
});
