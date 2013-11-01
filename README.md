# Connect MongoDB

connect-to-mongo is a MongoDB session store backed by [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) >= 1.3. Requires mongodb >= `2.2.0` for ttl collections.

## Installation

```sh
  npm install connect-to-mongodb
```

## Options

  - `db` mongodb-native database object or database name defaulting to "test"
  - `collection` MongoDB collection name defaulting to "sessions"
  - `host` MongoDB server hostname defaulting to "127.0.0.1"
  - `port` MongoDB server port defaulting to 27017
  - `ttl` MongoDB session TTL in seconds
  - `user` User for MongoDB
  - `password` Password for MongoDB authentication
  - `ssl` Use SSL to connect to MongoDB defaulting to false

## Usage

```js
var connect = require('connect'),
  MongoStore = require('connect-to-mongodb')(connect);

connect().use(connect.session({
  store: new MongoStore(options), secret: 'keyboard cat'
}));
```

This means express users may do the following, since `express.session.Store` points to the `connect.session.Store` function:
    var MongoStore = require('connect-to-mongodb')(express);

## License

  MIT