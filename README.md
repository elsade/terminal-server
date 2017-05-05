# Terminal Server

A terminal chat server implemented using Node.js net module.

### Prerequisites

Only Node.js is required to run the server.

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
