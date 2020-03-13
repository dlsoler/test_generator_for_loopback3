'use strict';
const assert = require('chai').assert;

const UserUtils = require('./user_utils');
const usersData = require('./users_data');

describe('User utils testing', function() {
  const userData = usersData.users[0];
  const userRole = usersData.userRole;

  let accessToken, userId;

  it('can create a user', function(done) {
    UserUtils.createUser(
      userData,
      userRole,
      function(err, res) {
        if (err) return done(err);
        assert.equal(res.email, userData.email);
        // assing the user id to use it in next tests
        userData.id = res.id;
        done();
      }
    );
  });

  it('can remove the user', function(done) {
    UserUtils.removeUser(
      userData.id,
      function(err, res) {
        if (err) return done(err);
        done();
      }
    );
  });

  it('can create an admin user', function(done) {
    UserUtils.createAdmin(done);
  });
  it('can remove the admin user', function(done) {
    UserUtils.removeAdmin(done);
  });

  it('can remove all users', function(done) {
    UserUtils.removeAllUsers(done);
  });

  it('can create a user and sign-in with such user', function(done) {
    // Remove all user before create a new one
    UserUtils.removeAllUsers(function(err, res) {
      if (err) {
        return done(err);
      }
      if (userData.id) {
        delete userData.id;
      }

      UserUtils.createAndLoginUser(
        userData,
        'user',
        function(error, result) {
          if (error) {
            return done(error);
          }
          assert.exists(result.id);
          assert.exists(result.userId);
          accessToken = result.id;
          userId = result.userId;
          done();
        }
      );
    });
  });

  it('can logout and remove a user', function(done) {
    assert.exists(accessToken, 'Access token does no exist');
    assert.exists(userId, 'User id does not exists');
    UserUtils.logoutAndRemoveUser(
      accessToken,
      userId,
      function(err, res) {
        if (err) {
          return done(err);
        }
        accessToken = null;
        userId = null;
        done();
      }
    );
  });
});
