# Connect MongoDB

connect-to-mongodb is a MongoDB session store backed by [node_redis](http://github.com/mranney/node_redis), and is insanely fast :). Requires mongodb >= `2.0.0` for the _SETEX_ command.

 connect-to-mongodb `>= 1.0.0` support only connect `>= 1.0.0`.

## Installation

	  $ npm install connect-to-mongodb

## Options
  
  - `client` An existing mongodb client object you normally get from `mongodb.createClient()`
  - `host` MongoDB server hostname
  - `port` MongoDB server portno
  - `ttl` MongoDB session TTL in seconds
  - `db` Database index to use
  - `pass` Password for MongoDB authentication
  - `prefix` Key prefix defaulting to "sess:"
  - ...    Remaining options passed to the mongodb `createClient()` method.

## Usage

 Due to npm 1.x changes, we now need to pass connect to the function `connect-to-mongodb` exports in order to extend `connect.session.Store`:

    var connect = require('connect')
	 	  , RedisStore = require('connect-to-mongodb')(connect);

    connect()
      .use(connect.session({ store: new RedisStore(options), secret: 'keyboard cat' }))
 

 This means express users may do the following, since `express.session.Store` points to the `connect.session.Store` function:
 
    var RedisStore = require('connect-to-mongodb')(express);

# License

  MIT