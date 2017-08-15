/*!
 * Connect - Mongo
 * Copyright(c) 2013 Pavel Vlasov <freakycue@gmail.com>
 * MIT Licensed
 */

/**
 * One day in milliseconds.
 */

var oneDay = 86400 * 1000;

/**
 * Module dependencies
 */

var inherits = require('util').inherits,
	events = require('events'),
	MongoClient = require('mongodb').MongoClient;

var createIndexes = function(collection, callback) {
	var times = 2;
	function done(err) {
		if (err) return callback(err);
		if (--times < 1) {
			callback();
		}
	}
	collection.createIndex({ttl: 1}, {expireAfterSeconds: 0}, done);
	collection.createIndex({sid: 1}, {unique: true}, done);
};

var makeConnectionString = function(options) {
	return  'mongodb://' + (options.host || '127.0.0.1') + ':' +
		(options.port || '27017') + '/' +
		(options.db || 'test') +
		'?ssl=' + (options.ssl || false);
};

/**
 * Return the `MongoStore` extending `connect`'s session Store.
 *
 * @param {object} connect
 * @return {Function}
 * @api public
 */
module.exports = function(connect) {

	/**
	* Connect's Store.
	*/

	var Store = connect.Store || connect.session.Store;

	/**
	* Initialize MongoStore with the given `options`.
	*
	* @param {Object} options
	* @api public
	*/

	function MongoStore(options) {
		var self = this;

		options = options || {};
		Store.call(this, options);
		this.ttl = options.ttl;

		var emitConnect = function(err) {
			if (err) throw err;
			self.emit('connect');
		};

		if (options.db && (typeof options.db !== 'string')) {
			this.col = options.db.collection(options.collection || 'sessions');
			createIndexes(this.col, emitConnect);
		} else {
			var dbUrl = options.url || makeConnectionString(options);
			MongoClient.connect(dbUrl, function(err, db) {
				if (err) throw err;
				self.col = db.collection(options.collection || 'sessions');
				if (options.user && options.password) {
					db.authenticate(options.user, options.password, function(err, res) {
						if (err) throw err;
						if (!res) throw new Error('mongodb authentication failed');
						createIndexes(self.col, emitConnect);
					});
				} else {
					createIndexes(self.col, emitConnect);
				}
			});
		}
	};

	/**
	* Inherit from `Store`.
	*/

	inherits(MongoStore, Store);

	/**
	* Attempt to fetch session by the given `sid`.
	*
	* @param {String} sid
	* @param {Function} fn
	* @api public
	*/

	MongoStore.prototype.get = function(sid, fn){
		this.col.findOne({sid: sid}, {_id: 0, ttl: 0, sid: 0}, function(err, data) {
			if (err) return fn(err);
			if (!data) return fn();
			return fn(null, data);
		});
	};

	/**
	* Commit the given `sess` object associated with the given `sid`.
	*
	* @param {String} sid
	* @param {Session} sess
	* @param {Function} fn
	* @api public
	*/

	MongoStore.prototype.set = function(sid, sess, fn) {
		try {
			var maxAge = sess.cookie.maxAge;

			sess.sid = sid;
			sess.ttl = new Date((this.ttl || ('number' === typeof maxAge
				? maxAge : oneDay)) + Date.now());

			this.col.replaceOne({sid: sid}, sess, {upsert: true}, function() {
				fn && fn.apply(this, arguments);
			});
		} catch (err) {
			fn && fn(err);
		}
	};

	/**
	* Destroy the session associated with the given `sid`.
	*
	* @param {String} sid
	* @param {Function} fn
	* @api public
	*/

	MongoStore.prototype.destroy = function(sid, fn) {
		this.col.deleteOne({sid: sid}, fn);
	};

	return MongoStore;
};
