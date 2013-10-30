/**
 * Module dependencies.
 */

var assert = require('assert'),
	connect = require('connect'),
	MongoStore = require('./')(connect),
	MongoClient = require('mongodb').MongoClient;

var store = new MongoStore;
var store_alt = new MongoStore({db: });

store.on('connect', function() {
	// #set()
	var self = this;
	self.set('123', {cookie: {maxAge: 2000}, name: 'tj'}, function(err, ok) {
		assert.ok(!err, '#set() got an error');
		assert.ok(ok, '#set() is not ok');

		// #get()
		self.get('123', function(err, data) {
			assert.ok(!err, '#get() got an error');
			assert.deepEqual({
				cookie: {maxAge: 2000},
				name: 'tj'
			}, data);

			// #set null
			self.set('123', {cookie: {maxAge: 2000}, name: 'tj'}, function() {
				self.destroy('123', function() {
					console.log('done');
					process.exit(0);
				});
			});
		});
	});
});
