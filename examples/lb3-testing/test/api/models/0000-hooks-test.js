'use strict';

const async = require('async');
const userUtils = require('../utils/user_utils');

// The time to wait while the app starts or ends
const GLOBAL_HOOKS_TIMEOUT = 30000;

before(function(done) {
  console.log('Setting Mocha global variables and hooks');
  this.timeout(GLOBAL_HOOKS_TIMEOUT);
  // Define Loopback object
  global.app = require('../../../server/server.js');

  console.log('Remove all users before testing begins...');
  // Remove all users before start testing
  userUtils.removeAllUsers((err, res) => {
    if (err) {
      return done(err);
    }
    console.log('All users removed.');
    done();
  });
});

// Global Mocha after hook
after(function(done) {
  // This testing server does not use MongoDB so
  // it does not need disconnect from the database

  // console.log('Trying to disconnect the datasource');
  // this.timeout(GLOBAL_HOOKS_TIMEOUT);
  // Disconnect from MongoDB before end the tests
  // global.app.dataSources.mongodbDS.disconnect(() => {
  //   console.log('Datasource is disconnected');
  //   done();
  // });
  userUtils.removeAllUsers(done);
});
