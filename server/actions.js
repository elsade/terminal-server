const assert = require('assert');
const _ = require('lodash');

module.exports = () => {

  const  validCommands = [
    'USERS',
    'ME',
    'QUIT',
  ];

  const isValidCommand = command => _.indexOf(validCommands, command) !== -1;

  const cleanInput = (input) => {
    // assert preconditions
    assert(input);

    return _.trim(input.toString(), ' \n\r\t');
  };

  const isCommand = (input) => {
    // assert preconditions
    assert(typeof input === 'string');

    return input.charAt(0) === '/';
  };

  const parseCommand = (input, user) => {
    let command;
    let matchResult = input.match(/\/(\S*)(.*)/);

    if (matchResult.length > 0) {
      const commandType = _.toUpper(matchResult[1]);

      if (isValidCommand(commandType)) {
        command = {
          type: commandType,
          src: user,
          payload: matchResult[2],
        };
      }
    }

    return command;
  };

  const needName = user => _.isEmpty(user.getName());

  return {
    cleanInput: cleanInput,
    isCommand: isCommand,
    parseCommand: parseCommand,
    dataToAction: (rawInput, user) => {

      let clean = cleanInput(rawInput);

      if (isCommand(clean)) {
        return parseCommand(clean, user);
      } else if (needName(user)) {
        return {
          type: 'SET_NAME',
          payload: clean,
        };
      } else {
        return {
          type: 'BROADCAST',
          payload: clean,
        };
      }
    },
  };
};
