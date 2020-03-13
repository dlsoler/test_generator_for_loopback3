'use strict';

const path = require('path');
const async = require('async');
const supertest = require('supertest');
const isEmpty = require('lodash/isEmpty');

const usersData = require('../utils/users_data');

function UserUtils() {
  this.adminData = usersData.adminData;
  this.adminRole = usersData.adminRole;
  this.user = usersData.users[0];
  this.userRole = usersData.userRole;
}

/**
 * Signs in in the loopback server
 * @param {object} credentials user user's credentials
 * @param {function} callback Calback function
 */
UserUtils.prototype.login = function(credentials, callback) {
  supertest(global.app)
  .post('/api/Users/login')
  .expect('Content-Type', /json/)
  .send(credentials)
  .expect(200)
  .end(function(err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res.body);
  });
};

/**
 * Signs out the current user from Loopback server
 * @param {string} accessToken Access token for the current user
 * @param {function} callback Call back function
 */
UserUtils.prototype.logout = function(accessToken, callback) {
  if (isEmpty(accessToken)) {
    return callback(new Error('cannot logout with an user not signed in'));
  }
  supertest(global.app)
  .post(`/api/Users/logout?access_token=${accessToken}`)
  .expect('Content-Type', /json/)
  .send({})
  .expect(204)
  .end(function(err, res) {
    if (err) return callback(err);
    callback();
  });
};

/**
 * Creates a user
 * @param {object} userData An object with the data to create the user
 * @param {string} userRole The user role
 * @param {function} cb The callback
 */
UserUtils.prototype.createUser = function(userData, userRole, cb) { // eslint-disable-line max-len
  const User = global.app.models.User;
  const Role = global.app.models.Role;
  const RoleMapping = global.app.models.RoleMapping;

  async.waterfall(
    [
      findUser,
      createAUser,
      findRole,
      createRoleIfNotExists,
      assignRole,
    ],
    function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    }
  );

  // Check if the user already exists
  function findUser(callback) {
    User.findOne(
      {
        where: {
          username: userData.username,
        },
      },
    callback
    );
  }

  /**
   * Create a new user
   * @param {function} callback The callback function
   */
  function createAUser(user, callback) {
    // If the user exists, do nothing
    if (user) {
      return callback(null, user);
    }
    User.create(
      [userData],
      function(err, newUsers) {
        if (err) {
          return callback(err);
        };
        callback(null, newUsers[0]);
      }
    );
  }

  /**
   * Find the applicant role
   * @param {Object} user the new user
   * @param {function} callback the callback function
   */
  function findRole(user, callback) {
    Role.findOne(
      {
        where: {
          name: userRole,
        },
      },
      function(err, role) {
        if (err) {
          return callback(err);
        }
        callback(null, user, role);
      }
    );
  }

  /**
   * Creates the applicant role if it doesn't exist.
   * @param {object} user  the new user
   * @param {object} role the role if it exists, if not null
   * @param {function} callback the callback function
   */
  function createRoleIfNotExists(user, role, callback) {
    if (role) {
      return callback(null, user, role);
    }
    // Create the applicant Role
    Role.create(
      {name: userRole},
      function(err, role) {
        if (err) {
          return callback(err);
        }
        callback(null, user, role);
      }
    );
  }

  /**
   * Assing the applicant role to the new user
   * @param {object} user the new user
   * @param {object} role the applicant role
   * @param {function} callback the callback function
   */
  function assignRole(user, role, callback) {
    // Assing the role to the user
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: user.id,
    }, function(err, roleMapping) {
      if (err) {
        return callback(err);
      }
      // Return the user if all was ok
      callback(null, user);
    });
  }
};

/**
 * Remove a user
 * @param {string} userId the id of the user to be removed
 * @param {function} cb the callback function
 */
UserUtils.prototype.removeUser = function(userId, cb) {
  async.waterfall(
    [
      removeRoleMapping,
      removeUser,
    ],
    function(err, res) {
      if (err) return cb(err);
      cb(null, res);
    }
  );

  /**
   * Removes all Role mappings for the user
   * @param {function} callback
   */
  function removeRoleMapping(callback) {
    // Get the RoleMapping model from de app
    const RoleMapping = global.app.models.RoleMapping;
    // Remove all role mappings for the user
    RoleMapping.destroyAll(
      {principalId: userId},
      function(err, res) {
        if (err) return callback(err);
        callback(null, res);
      }
    );
  }

  /**
   * Remove the user form the database
   * @param {function} callback
   */
  function removeUser(result, callback) {
    // Get the User model from the app
    const User = global.app.models.User;
    // Remove de user
    User.destroyById(
      userId,
      function(err, res) {
        if (err) return callback(err);
        callback(null, res);
      }
    );
  }
};

/**
 * Returns a fitered set the users in the database
 * @param {object} filter A Loopback filter
 * @param {function} cb The callback
 */
UserUtils.prototype.getUsers = function(filter, cb) {
  global.app.models.User.find(filter, cb);
};

/**
 * Creates a user with role 'admin'
 * @param {*} callback Callback function
 */
UserUtils.prototype.createAdmin = function(callback) {
  if (this.adminData.id) {
    delete this.adminData.id; // remove the previous id
  }
  this.createUser(
    this.adminData,
    this.adminRole,
    (err, adminUser) => {
      if (err) return callback(err);
      const adminId = adminUser.id;
      this.adminData.id = adminId;
      callback(null, adminUser);
    }
  );
};

/**
 * Remove the user created with the previos function
 * @param {*} callback callback function
 */
UserUtils.prototype.removeAdmin = function(callback) {
  if (!this.adminData.id) {
    return callback(new Error('admin user does not exist!'));
  }
  this.removeUser(this.adminData.id, callback);
};

UserUtils.prototype.createTestingUser = function(callback) {
  if (this.userData.id) {
    delete this.userData.id;
  }
  this.createUser(
    this.userData,
    this.userRole,
    (err, user) => {
      if (err) return callback(err);
      const userId = user.id;
      this.userData.id = userId;
      callback(null, user);
    }
  );
};

/**
 * Remove all users in the database
 */
UserUtils.prototype.removeAllUsers = function(cb) {
  const User = global.app.models.User;

  async.waterfall(
    [
      getAllUsers.bind(this),
      removeUsers.bind(this),
    ],
    cb
  );

  // Get a collection with all users
  function getAllUsers(callback) {
    User.find(callback);
  }

  // Remove all users in the database
  function removeUsers(users, callback) {
    if (!users || users.length == 0) {
      return callback(null);
    }
    // Remove each user and its role mapping
    async.eachLimit(
      users,
      5,
      function(user, eachCb) {
        this.removeUser(user.id, eachCb);
      }.bind(this),
      callback
    );
  }
};

/**
 * Creates a user and then log in with his credentials
 * @param {object} userData
 * @param {string} userRole
 * @param {function} cb the callback function
 */
UserUtils.prototype.createAndLoginUser = function(userData, userRole, cb) {
  async.waterfall(
    [
      createTheUser.bind(this),
      loginTheUser.bind(this),
    ],
    cb
  );

  function createTheUser(callback) {
    this.createUser(userData, userRole, callback);
  }

  function loginTheUser(newUserData, callback) {
    this.login(
      {
        username: userData.username,
        password: userData.password,
      },
      callback
    );
  }
};

/**
 * Logouts a user and the remove it from the database
 * @param {string} accessToken
 * @param {string} userId
 * @param {function} cb The callback function
 */
UserUtils.prototype.logoutAndRemoveUser = function(accessToken, userId, cb) {
  async.waterfall(
    [
      signedOut.bind(this),
      removeCurrentUser.bind(this),
    ],
    cb
  );
  function signedOut(callback) {
    if (!accessToken) {
      return callback();
    }
    this.logout(accessToken, callback);
  }
  function removeCurrentUser(callback) {
    this.removeUser(userId, callback);
  }
};

module.exports = new UserUtils;
