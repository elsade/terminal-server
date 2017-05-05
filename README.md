# Terminal Server

A terminal chat server implemented using Node.js net module.

### Features/Requirements

* Users can connect from a terminal application.
* Implements a single global chat room.
* Multiple users can connect (up to 5).     
* Upon connecting, the user can enter their name.
  * The name is validated and if the validation fails, the user is re-prompted to enter their username:
    * The username contains too few characters.
    * An existing user is already using a given name.
    * The username starts with a '/', which is used for commands.
* When the user enters the room, the last ten messages are displayed.
* When the user types '/users' the list of connected users is displayed.
* When the user types '/me kick the can', all users receive the message 'USERNAME kicks the can'
* When the user types /quit' the user is disconnected.
* When the user types a message, it is broadcast to the channel.
* When the user enters the channel, a 'USERNAME joined' notification is broadcast.
* When a user leaves, a 'USERNAME left' notification is broadcast'.
* When a user leaves, they are no longer in the user list.     

#### Stretch

* Implement max connections.

### Prerequisites

Since the application uses ES6, the Node.js LTS (v6.10.3) is recommended to run the server.

Running the tests requires, the Mocha, Chai, Sinon unit testing suite.

### Installing

Install the dependencies:

```
npm install
```

The run the server:

```
npm start
```

## Running the tests

Once Mocha has been installed, you can run the tests with:

```
npm test
```

In order to live test, connect to the configured host and port using a TCP client.  The server was tested using Netcat on Windows 10 and telnet on Linux.

### Static analysis and Style

The project uses ESLint for static analysis and jscs (with the airbnb style guide).

To run ESLint, type:

```
eslint .
```

To run jscs, type:

```
jscs .
```


## Deployment

Edit config.json to specify a real hostname and port.


## Authors

* **Akrura** - *Initial work* - [LinkedIn](https://www.linkedin.com/in/akrura-gordillo-4933824/)

## Acknowledgments

* The Node.js docs for the net module.
* Lodash as always
