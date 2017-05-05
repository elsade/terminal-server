const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = (socket) => {

  // encapsulated to prevent name validation from being bypassed
  let name = '';

  const checkUsernameType = username => {
    if (!_.isString(username)) {
      return { valid: false, err: 'Username is not a string.' };
    }

    return { valid: true, err: null };
  };

  const checkUsernameLength = username => {
    if (username.length < 1) {
      return { valid: false, err: 'Username is too short.' };
    }

    return { valid: true, err: null };
  };

  const checkNotCommand = username => {
    if (username.charAt(0) === '/') {
      return { valid: false, err: 'Username may not contain the / character.' };
    }

    return { valid: true, err: null };
  };

  let usernameValidators = [
    checkUsernameType,
    checkUsernameLength,
    checkNotCommand,
  ];

  const validateUsername = username => new Promise((resolve, reject) => {
    // apply all validators to the name to insure it is valid
    const result = _.reduce(usernameValidators, (prev, currentValidator) => {
      let currenResult = prev;
      if (prev.valid) {
        currenResult = currentValidator(username);
      }

      return currenResult;
    }, { valid: true, err: null });

    if (result.valid) {
      return resolve(result.valid);
    }

    return reject(result.err);
  });

  return {
    validateUsername: validateUsername,
    registerUsernameValidator: (validator) => {
      // assert preconditions
      assert(validator);
      assert(typeof validator === 'function');

      usernameValidators.push(validator);
    },

    // String => Promise
    setName: (username => {
      return validateUsername(username).then(() => {
        name = username;
      });
    }),
    getName: () => name,
    socket: socket,
  };
};
