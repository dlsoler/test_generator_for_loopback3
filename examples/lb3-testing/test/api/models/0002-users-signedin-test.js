'use strict';
/* eslint max-len: 0 */

/*
 *
 * Users
 * Signed in testing
 *
 */

const supertest = require('supertest');

// Utils used for user Sign-in and sign-out
const userUtils = require('../utils/user_utils');

// User data, they are containing sign-in credentials
const usersData = require('../utils/users_data');

// URL Prefix
const API_URL_PREFIX = '/api';
// Test timeout
const TEST_TIMEOUT = 3000;

// Loopback access token and user id
let accessToken, userId, userId2;

describe('Test suite Users signed in', function() {
  this.timeout(TEST_TIMEOUT);

  before(function(done) {
    // Just in case, remove all users before run the tests
    userUtils.removeAllUsers(function(err, res) {
      if (err) {
        return done(err);
      }
      // Create the testing user and login with its credentials.
      userUtils.createAndLoginUser(
        usersData.users[0],
        usersData.userRole,
        (err, res) => {
          if (err) {
            return done(err);
          }
          userId = res.userId;
          accessToken = res.id;
          userUtils.createUser(usersData.users[1], usersData.userRole, (err, res) => {
            userId2 = res.userId;
            done();
          });
        }
      );
    });
  });

  after(function(done) {
    // Remove all users after running the tests
    userUtils.removeAllUsers(done);
  });

  /*
   * Find a related item by id for accessTokens.
   * operationId: User.prototype.__findById__accessTokens
   */
  it('Cannot find a related item by id for accessTokens. URI: /Users/{id}/accessTokens/{fk}', function(done) {
    const id = userId;
    const fk = '';
    const url = `${API_URL_PREFIX}/Users/${id}/accessTokens/${fk}`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Delete a related item by id for accessTokens.
   * operationId: User.prototype.__destroyById__accessTokens
   */
  it('Cannot delete a related item by id for accessTokens. URI: /Users/{id}/accessTokens/{fk}', function(done) {
    const id = userId;
    const fk = '';
    const url = `${API_URL_PREFIX}/Users/${id}/accessTokens/${fk}`;

    supertest(global.app)
    .delete(url)
    .expect('Content-Type', /json/)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Update a related item by id for accessTokens.
   * operationId: User.prototype.__updateById__accessTokens
   */
  it('Cannot update a related item by id for accessTokens. URI: /Users/{id}/accessTokens/{fk}', function(done) {
    const id = userId;
    const fk = accessToken;
    const data = '';
    const url = `${API_URL_PREFIX}/Users/${id}/accessTokens/${fk}`;

    supertest(global.app)
    .put(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Queries accessTokens of User.
   * operationId: User.prototype.__get__accessTokens
   */
  it('Cannot queries accessTokens of User. URI: /Users/{id}/accessTokens', function(done) {
    const id = userId;
    const filter = '';
    const url = `${API_URL_PREFIX}/Users/${id}/accessTokens`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(filter)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Creates a new instance in accessTokens of this model.
   * operationId: User.prototype.__create__accessTokens
   */
  it('Cannot creates a new instance in accessTokens of this model. URI: /Users/{id}/accessTokens', function(done) {
    const id = userId;
    const data = '';
    const url = `${API_URL_PREFIX}/Users/${id}/accessTokens`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Deletes all accessTokens of this model.
   * operationId: User.prototype.__delete__accessTokens
   */
  it('Cannot deletes all accessTokens of this model. URI: /Users/{id}/accessTokens', function(done) {
    const id = userId;
    const url = `${API_URL_PREFIX}/Users/${id}/accessTokens`;

    supertest(global.app)
    .delete(url)
    .expect('Content-Type', /json/)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Counts accessTokens of User.
   * operationId: User.prototype.__count__accessTokens
   */
  it('Cannot counts accessTokens of User. URI: /Users/{id}/accessTokens/count', function(done) {
    const id = userId;
    const where = '';
    const url = `${API_URL_PREFIX}/Users/${id}/accessTokens/count`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(where)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Create a new instance of the model and persist it into the data source.
   * operationId: User.create
   */
  it('Can create a new instance of the model and persist it into the data source. URI: /Users', function(done) {
    const data = usersData.users[2];
    const url = `${API_URL_PREFIX}/Users`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Patch an existing model instance or insert a new one into the data source.
   * operationId: User.patchOrCreate
   */
  it('Cannot patch an existing model instance or insert a new one into the data source. URI: /Users', function(done) {
    const data = '';
    const url = `${API_URL_PREFIX}/Users`;

    supertest(global.app)
    .patch(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Replace an existing model instance or insert a new one into the data source.
   * operationId: User.replaceOrCreate__put_Users
   */
  it('Cannot replace an existing model instance or insert a new one into the data source. URI: /Users', function(done) {
    const data = '';
    const url = `${API_URL_PREFIX}/Users`;

    supertest(global.app)
    .put(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Find all instances of the model matched by filter from the data source.
   * operationId: User.find
   */
  it('Cannot find all instances of the model matched by filter from the data source. URI: /Users', function(done) {
    const filter = '';
    const url = `${API_URL_PREFIX}/Users`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(filter)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Replace an existing model instance or insert a new one into the data source.
   * operationId: User.replaceOrCreate__post_Users_replaceOrCreate
   */
  it('Cannot replace an existing model instance or insert a new one into the data source. URI: /Users/replaceOrCreate', function(done) {
    const data = '';
    const url = `${API_URL_PREFIX}/Users/replaceOrCreate`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Update an existing model instance or insert a new one into the data source based on the where criteria.
   * operationId: User.upsertWithWhere
   */
  it('Cannot update an existing model instance or insert a new one into the data source based on the where criteria. URI: /Users/upsertWithWhere', function(done) {
    const where = '';
    const data = '';
    const url = `${API_URL_PREFIX}/Users/upsertWithWhere`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query(where)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Check whether a model instance exists in the data source.
   * operationId: User.exists__get_Users_{id}_exists
   */
  it('Cannot check whether a model instance exists in the data source. URI: /Users/{id}/exists', function(done) {
    const id = userId;
    const url = `${API_URL_PREFIX}/Users/${id}/exists`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Check whether a model instance exists in the data source.
   * operationId: User.exists__head_Users_{id}
   */
  it('Cannot check whether a model instance exists in the data source. URI: /Users/{id}', function(done) {
    const id = userId;
    const url = `${API_URL_PREFIX}/Users/${id}`;

    supertest(global.app)
    .head(url)
    .expect('Content-Type', /json/)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Find a model instance by {{id}} from the data source.
   * operationId: User.findById
   */
  it('Can find a model instance by {{id}} from the data source. URI: /Users/{id}', function(done) {
    const id = userId;
    const filter = '';
    const url = `${API_URL_PREFIX}/Users/${id}`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(filter)
    .query({'access_token': accessToken})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Replace attributes for a model instance and persist it into the data source.
   * operationId: User.replaceById__put_Users_{id}
   */
  it('Can replace attributes for a model instance and persist it into the data source. URI: /Users/{id}', function(done) {
    const id = userId;
    const data = {
      email: usersData.users[0].email,
      password: usersData.users[0].password,
      emailVerified: true,
    };
    const url = `${API_URL_PREFIX}/Users/${id}`;

    supertest(global.app)
    .put(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Patch attributes for a model instance and persist it into the data source.
   * operationId: User.prototype.patchAttributes
   */
  it('Can patch attributes for a model instance and persist it into the data source. URI: /Users/{id}', function(done) {
    const id = userId;
    const data = {
      emailVerified: true,
      email: usersData.users[0].email,
      password: usersData.users[0].password,
    };
    const url = `${API_URL_PREFIX}/Users/${id}`;

    supertest(global.app)
    .patch(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Replace attributes for a model instance and persist it into the data source.
   * operationId: User.replaceById__post_Users_{id}_replace
   */
  it('Can replace attributes for a model instance and persist it into the data source. URI: /Users/{id}/replace', function(done) {
    const id = userId;
    const data = {
      username: 'pepe',
      email: usersData.users[0].email,
      password: usersData.users[0].password,
    };
    const url = `${API_URL_PREFIX}/Users/${id}/replace`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query({'access_token': accessToken})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Find first instance of the model matched by filter from the data source.
   * operationId: User.findOne
   */
  it('Cannot find first instance of the model matched by filter from the data source. URI: /Users/findOne', function(done) {
    const filter = '';
    const url = `${API_URL_PREFIX}/Users/findOne`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(filter)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Update instances of the model matched by {{where}} from the data source.
   * operationId: User.updateAll
   */
  it('Cannot update instances of the model matched by {{where}} from the data source. URI: /Users/update', function(done) {
    const where = '';
    const data = '';
    const url = `${API_URL_PREFIX}/Users/update`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(data)
    .query(where)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Count instances of the model matched by where from the data source.
   * operationId: User.count
   */
  it('Cannot count instances of the model matched by where from the data source. URI: /Users/count', function(done) {
    const where = '';
    const url = `${API_URL_PREFIX}/Users/count`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(where)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Create a change stream.
   * operationId: User.createChangeStream__post_Users_change-stream
   */
  it('Cannot create a change stream. URI: /Users/change-stream', function(done) {
    const options = '';
    const url = `${API_URL_PREFIX}/Users/change-stream`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .type('form')
    .send(options)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Create a change stream.
   * operationId: User.createChangeStream__get_Users_change-stream
   */
  it('Cannot create a change stream. URI: /Users/change-stream', function(done) {
    const options = '';
    const url = `${API_URL_PREFIX}/Users/change-stream`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(options)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Login a user with username/email and password.
   * operationId: User.login
   */
  it('Can login a user with username/email and password. URI: /Users/login', function(done) {
    const credentials = {
      username: usersData.users[1].username,
      password: usersData.users[1].password,
    };
    const include = '';
    const url = `${API_URL_PREFIX}/Users/login`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(credentials)
    .query(include)
    .query({'access_token': accessToken})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      userId2 = res.userId;
      done();
    });
  });
  /*
   * Logout a user with access token.
   * operationId: User.logout
   */
  it('Cannot logout a user with access token. URI: /Users/logout', function(done) {
    const url = `${API_URL_PREFIX}/Users/logout`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .query({'access_token': accessToken})
    .expect(204)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Trigger user&#x27;s identity verification with configured verifyOptions
   * operationId: User.prototype.verify
   */
  it.skip('Cannot trigger user&#x27;s identity verification with configured verifyOptions URI: /Users/{id}/verify', function(done) {
    const id = userId;
    const url = `${API_URL_PREFIX}/Users/${id}/verify`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Confirm a user registration with identity verification token.
   * operationId: User.confirm
   */
  it('Cannot confirm a user registration with identity verification token. URI: /Users/confirm', function(done) {
    const uid = userId;
    const token = accessToken; // Wrong token
    const redirect = '';
    const url = `${API_URL_PREFIX}/Users/confirm`;

    supertest(global.app)
    .get(url)
    .expect('Content-Type', /json/)
    .query(uid)
    .query(token)
    .query(redirect)
    .query({'access_token': accessToken})
    .expect(400)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Reset password for a user with email.
   * operationId: User.resetPassword
   */
  it('Cannot reset password for a user with email. URI: /Users/reset', function(done) {
    const options = {
      email: usersData.users[1].email,
    };

    const url = `${API_URL_PREFIX}/Users/reset`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .send(options)
    .query({'access_token': accessToken})
    .expect(204)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Change a user&#x27;s password.
   * operationId: User.changePassword
   */
  it('Cannot change a user&#x27;s password. URI: /Users/change-password', function(done) {
    const oldPassword = '';
    const newPassword = '';
    const url = `${API_URL_PREFIX}/Users/change-password`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .type('form')
    .send(oldPassword)
    .send(newPassword)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Reset user&#x27;s password via a password-reset token.
   * operationId: User.setPassword
   */
  it('Cannot reset user&#x27;s password via a password-reset token. URI: /Users/reset-password', function(done) {
    const newPassword = '';
    const url = `${API_URL_PREFIX}/Users/reset-password`;

    supertest(global.app)
    .post(url)
    .expect('Content-Type', /json/)
    .type('form')
    .send(newPassword)
    .query({'access_token': accessToken})
    .expect(401)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
  /*
   * Delete a model instance by {{id}} from the data source.
   * operationId: User.deleteById
   */
  it('Can delete a model instance by {{id}} from the data source. URI: /Users/{id}', function(done) {
    const id = userId;
    const url = `${API_URL_PREFIX}/Users/${id}`;

    userUtils.login(
      {
        email: usersData.users[0].email,
        password: usersData.users[0].password,
      },
      (err, res) => {
        if (err) {
          return done(err);
        }
        accessToken = res.id;
        supertest(global.app)
        .delete(url)
        .expect('Content-Type', /json/)
        .query({'access_token': accessToken})
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
      }
    );
  });
});
