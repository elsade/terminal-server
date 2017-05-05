const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');

// module under test
const Actions = require('../server/actions')();

chai.use(sinonChai);
require('mocha-sinon');

describe('Action tests', () => {
  beforeEach(() => {
  });

  it('module can be required ...', (done) => {
    expect(Actions).to.exist;
    done();
  });

  it('module includes the constructor ...', (done) => {
    expect(Actions).to.be.a('object');
    done();
  });

  it('cleanInput() works ...', (done) => {
    expect(Actions.cleanInput(' abc ')).to.equal('abc');
    expect(Actions.cleanInput('abc\n')).to.equal('abc');
    expect(Actions.cleanInput(' \tabc\n\r')).to.equal('abc');
    done();
  });

  it('isCommand() works ...', (done) => {
    expect(Actions.isCommand('/quit')).to.be.true;
    expect(Actions.isCommand('/me')).to.be.true;
    expect(Actions.isCommand('/users')).to.be.true;
    expect(Actions.isCommand('/foo')).to.be.true;

    expect(Actions.isCommand('foo')).to.be.false;
    expect(Actions.isCommand('f/oo')).to.be.false;

    done();
  });

  it('parseCommand() works ...', (done) => {
    let command;
    command = Actions.parseCommand('/quit');
    expect(command).to.be.eql({
      type: 'QUIT',
      src: undefined,
      payload: '',
    });

    command = Actions.parseCommand('/me kicks the can');
    expect(command).to.be.eql({
      type: 'ME',
      src: undefined,
      payload: ' kicks the can',
    });

    command = Actions.parseCommand('/users');
    expect(command).to.be.eql({
      type: 'USERS',
      src: undefined,
      payload: '',
    });

    done();
  });

  it('dataToAction() works ...', (done) => {
    let action;
    let username = '';
    const user = {
      getName: () => {
        return username;
      },
    };

    // fields to be used for comparison
    const fields = ['type', 'payload'];
    // John Smith -> { SET_NAME, 'John Smith' }
    action = Actions.dataToAction('John Smith', user);
    expect(_.pick(action, fields)).to.be.eql({
      type: 'SET_NAME',
      payload: 'John Smith',
    });

    // /quit -> QUIT
    action = Actions.dataToAction('/quit', user);
    expect(_.pick(action, fields)).to.be.eql({
      type: 'QUIT',
      payload: '',
    });

    // /users -> USERS
    action = Actions.dataToAction('/users', user);
    expect(_.pick(action, fields)).to.be.eql({
      type: 'USERS',
      payload: '',
    });

    // /me kicks the can -> ME
    action = Actions.dataToAction('/me kicks the can', user);
    expect(_.pick(action, fields)).to.be.eql({
      type: 'ME',
      payload: ' kicks the can',
    });

    // invalid command
    action = Actions.dataToAction('/proccess.exit(0) pwned!', user);
    expect(action).to.be.empty;

    // Hi everyone! -> BROADCAST
    username = 'John Smith';
    action = Actions.dataToAction('Hi, everyone!', user);
    expect(_.pick(action, fields)).to.be.eql({
      type: 'BROADCAST',
      payload: 'Hi, everyone!',
    });

    done();
  });
});
