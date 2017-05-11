# Terminal Server

A terminal chat server implemented using Node.js net module.

#### Stretch/Future Enhancements

* Implement max connections.
* Implement /help to give a list of supported client-side commands.
* Implement server side commands to moderate the channel, boot users, and monitor usage.
* Implement multiple rooms.
* Scale to multiple servers using a message queue like RabbitMQ instead a single in-memory instance.
* Saves messages to a persistent store.

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
