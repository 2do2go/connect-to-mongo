# Connect MongoDB

connect-to-mongo is a MongoDB session store backed by [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) >= 2.0. Requires mongodb >= `2.2.0` for ttl collections.

## Installation

```sh
  npm install connect-to-mongo
```

## Options

  - `db` mongodb-native database object or database name (`test` by default)
  - `collection` collection name (`sessions` by default)
  - `host` db hostname (`127.0.0.1` by default)
  - `port` db port (`27017` by default)
  - `ttl` ttl in milliseconds (if set it overrides cookie `maxAge`)
  - `user` user for MongoDB
  - `password` password for MongoDB authentication
  - `ssl` use SSL to connect to MongoDB (`false` by default)
  - `url` mongo connection string in form `mongodb://...`. You can use this field as replacement for all previous.

## Usage

```js
var connect = require('connect'),
  MongoStore = require('connect-to-mongo')(connect),
  app = connect();

app.use(connect.session({
  store: new MongoStore(options), secret: 'keyboard cat'
}));
```

For using it with express just replace `connect` with `express` in the example above.

## License

  MIT
