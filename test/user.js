const _ = require('lodash');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');

// module under test
const User = require('../server/user');

chai.use(sinonChai);
require('mocha-sinon');

describe('User tests', () => {
  beforeEach(() => {
  });

  it('module can be required ...', (done) => {
    expect(User).to.not.be.null;
    done();
  });

  it('module includes the constructor ...', (done) => {
    expect(User).to.be.a('function');
    done();
  });

  it('the constructor works', (done) => {
    const socket = 99;
    expect(User).to.exist;

    const batman = User(socket);
    expect(batman).to.exist;

    //expect(batman.name).to.be.eql('Batman');
    expect(batman.socket).to.be.eql(99);
    done();
  });

  it('validateUsername() catches non string usernames ...', (done) => {
    User().validateUsername(4).catch((err) => {
      expect(err).to.eql('Username is not a string.');
      done();
    });
  });

  it('validateUsername() catches usernames that are too short ...', (done) => {
    User().validateUsername('').catch((err) => {
      expect(err).to.eql('Username is too short.');
      done();
    });
  });

  it('validateUsername() catches usernames that include a / ...', (done) => {
    User().validateUsername('/john').catch((err) => {
      expect(err).to.eql('Username may not contain the / character.');
      done();
    });
  });

  it('registerUsernameValidator() works when using a custom validator ...', (done) => {

    const user = User();

    // custom validator can be added
    user.registerUsernameValidator(username =>
      _.isEqual(username, 'Troll') ?
        { valid: false,  err: 'trolls are not allowed' } :
        { valid: true, err: null });

    user.validateUsername('Troll').catch((err) => {
      expect(err).to.eql('trolls are not allowed');
      done();
    });
  });

  it('validateUsername() works ...', (done) => {
    User().validateUsername('John Snow').then(() => {
      done();
    }).catch((err) => {
      assert(0, err);
    });
  });

  it('setName() works ...', (done) => {
    const user = User();
    user.setName('John Snow').then(() => {
      expect(user.getName()).to.equal('John Snow');
      done();
    }).catch((err) => {
      assert(0, err);
    });
  });
});
