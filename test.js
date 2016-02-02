/**
 * Module dependencies.
 */

var assert = require('assert'),
	connect = require('connect'),
	MongoStore = require('./lib')(connect),
	MongoClient = require('mongodb').MongoClient;

var testsCount = 3;

var done = (function () {
	var count = 0;
	return function () {
		++count;
		if (count == testsCount) {
			console.log('done');
			process.exit(0);
		}
	};
})();

var store = new MongoStore;

// simple test
store.on('connect', function() {
	baseTest.apply(this);
});

// test with initialized db object
MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
	var store = new MongoStore({db: db});
	store.on('connect', function() {
		baseTest.apply(this);
	});
});

// test mongodb auth
MongoClient.connect('mongodb://127.0.0.1:27017/testauth', function(err, db) {
	db.addUser('user', 'pass', {roles: ['readWrite']}, function(err, res) {
		assert.ok(!err, '#addUser error');
		var store = new MongoStore({user: 'user', password: 'pass', db: 'testauth'});
		store.on('connect', function() {
			baseTest.apply(this);
		});
	});
});

// Basic functionality test
function baseTest() {
	var self = this;
	// #set()
	self.set('123', {cookie: {maxAge: 2000}, name: 'name'}, function(err, ok) {
		assert.ok(!err, '#set() got an error');
		assert.ok(ok, '#set() is not ok');

		// #get()
		self.get('123', function(err, data) {
			assert.ok(!err, '#get() got an error');
			assert.deepEqual({
				cookie: {maxAge: 2000},
				name: 'name'
			}, data);

			// #set null
			self.set('123', {cookie: {maxAge: 2000}, name: 'name'}, function() {
				self.destroy('123', function() {
					done();
				});
			});
		});
	});
}
