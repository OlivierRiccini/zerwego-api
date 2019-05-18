'use strict';
process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { IUser, IUserCredentials } from '../../src/models/user-model';
import { CONSTANTS } from '../../src/persist/constants';
import * as jwt from 'jsonwebtoken';
import { GeneralHelper } from '../data-test/helpers-data';

const debug = require('debug')('test');

const generalHelper: GeneralHelper = new GeneralHelper();

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe('HTTP - TESTING USER ROUTES ./http/user.test', function() {
  this.timeout(15000);

  const request = chai.request(app).keepOpen();

  let VALID_USER: IUser = {
    username: 'Lebron',
    email: 'lebron.james@lakers.com',
    password: 'Iamtheking',
    phone: '+14383991332'
  };

  const VALID_USER_CREDENTIALS_EMAIL: IUserCredentials = {
    type: 'password',
    email: 'lebron.james@lakers.com',
    password: 'Iamtheking'  
  };

  const VALID_USER_CREDENTIALS_PHONE: IUserCredentials = {
    type: 'password',
    email: 'lebron.james@lakers.com',
    password: 'Iamtheking'
  };

  let VALID_USER_TOKEN: string;

  let VALID_USER_HASHED_PASSWORD: string;

  before('Create user', async () => {
    const response = await request
      .post('/auth/register')
      .send(VALID_USER);
    let token = response.header['jwt'];
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
    const user = decoded['payload'];
    // Assign id to VALID_USER to reuse in other tests
    VALID_USER.id = user.id;
    // Save token to reuse in other tests
    VALID_USER_TOKEN = token; 
  });

  after('Cleaning DB', async () => {
    generalHelper.cleanDB();
  });

  it('Should signUp a user and get token back set in the header', async () => {
    const newUser: IUser = {
      username: 'Steph',
      email: 'steph.curry@warrriors.com',
      password: 'shoot',
    };

    const response = await request
      .post('/auth/register')
      .send(newUser);
       
    expect(response.header).to.have.property('jwt');
    expect(response.header).to.have.property('refresh-token');

    let token = response.header['jwt'];
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    const decodedJwt =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
    const user = decodedJwt['payload'];

    expect(response.status).to.equal(200);
    expect(user).to.have.property('id');
    expect(user).to.have.property('username');
    expect(user).to.have.property('email');

    await request.post('/auth/logout').set('authorization', token);
  });

  it('Should login a user using password and email, and get a token back set in the header', async () => {
    const response = await request
      .post('/auth/login')
      .send(VALID_USER_CREDENTIALS_EMAIL);
    
    expect(response.header).to.have.property('jwt');
    
    let token = response.header['jwt'];
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    const decoded =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
    const user = decoded['payload'];
    expect(response.status).to.equal(200);
    expect(user).to.have.property('id');
    expect(user).to.have.property('username');
    expect(user).to.have.property('email');

    await request.post('/auth/logout').set('authorization', VALID_USER_TOKEN);
  });

  it('Should login a user using password and phone, and get a token back set in the header', async () => {
      const response = await request
        .post('/auth/login')
        .send(VALID_USER_CREDENTIALS_PHONE);
      
      expect(response.status).to.equal(200);
      expect(response.header).to.have.property('jwt');
      
      let token = response.header['jwt'];
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
      const decoded =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
      const user = decoded['payload'];
  
      expect(user).to.have.property('id');
      expect(user).to.have.property('username');
      expect(user).to.have.property('phone');

    await request.del('/auth/logout').set('authorization', VALID_USER_TOKEN);
  });

  it('NEGATIVE - Should not login a user if no type was precised in credentials', async () => {
    const response = await request
      .post('/auth/login')
      .send({phone: null, password: VALID_USER.password});
    
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equals('Credentials should have a property type equal either \'password\' or \'facebook\'');
  });

  it('NEGATIVE - Should not login a user if no email nor phone provided', async () => {
    const response = await request
      .post('/auth/login')
      .send({type: 'password', phone: null, password: VALID_USER.password});
    
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equals('User credentials should at least contain an email or a phone property');
  });

  it('NEGATIVE - Should not login a user if email provided is not valid', async () => {
    const response = await request
      .post('/auth/login')
      .send({type: 'password', email: 'notvalidemail', password: VALID_USER.password});

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equals('Provided email is not valid');
  });

  it('NEGATIVE - Should not login a user if phone provided is not valid', async () => {
    const response = await request
      .post('/auth/login')
      .send({type: 'password', phone: 'notvalidphone', password: VALID_USER.password});

      expect(response.status).to.equal(400);
    expect(response.body.message).to.equals('Provided phone number is not valid');
  });

  it('NEGATIVE - Should not login if user was not found in DB', async () => {
    const response = await request
      .post('/auth/login')
      .send({type: 'password', phone: '+1777666550', password: VALID_USER.password});
    
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equals('User was not found while login');
  });

  it('NEGATIVE - Should not login if possword provided is wrong', async () => {
    const response = await request
      .post('/auth/login')
      .send({type: 'password', email: VALID_USER.email, password: 'wrongpassword'});
    
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equals('Wrong password');    
  });

  it('POSITIVE - Jwt Token should expire', done => {
    const testDuration: number = Number(CONSTANTS.ACCESS_TOKEN_EXPIRES_IN) + 1000;
    console.log('*********************************************************************************');
    console.log(`Testing Jwt Token should expire...should take max ${(testDuration / 1000)} seconds... 1 / 4`);
    console.log('*********************************************************************************');
    let i = testDuration / 1000 + 1;
    const intervalLogger = setInterval(() => process.stdout.write(` - ${i -= 1} - `), 1000);

      request.post('/auth/login').send(VALID_USER_CREDENTIALS_EMAIL).then(
        response  => {
          const refreshToken = response.header['refresh-token'];
          let token = response.header['jwt'];
          if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
          }
          setTimeout(() => {
            clearInterval(intervalLogger);
            process.stdout.write(`\n`);
            try {
              const payload = jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
              expect(payload).to.not.have.property('payload');
            } catch (err) {
              expect(err).to.have.property('name').to.equal('TokenExpiredError');
            }
            request.post('/auth/logout').set('refresh-token', refreshToken).then(() => {
              done(); 
            });
          }, Number(CONSTANTS.ACCESS_TOKEN_EXPIRES_IN) + 1000); 
        }
      )
  });

  it.skip('POSITIVE - Refresh should expire', done => {
    const testDuration: number = Number(CONSTANTS.REFRESH_TOKEN_EXPIRES_IN) + 1000;
    console.log('*********************************************************************************');
    console.log(`Testing Refresh should expire...should take max ${(testDuration / 1000)} seconds... 2 / 4`);
    console.log('*********************************************************************************');
    let i = testDuration / 1000 + 1;
    const intervalLogger = setInterval(() => process.stdout.write(` - ${i -= 1} - `), 1000);

    // const newUser: IUser = {
    //   username: 'Steph',
    //   email: 'steph.curry@warrriors.com',
    //   password: 'shoot',
    // };

    request.post('/auth/login').send(VALID_USER_CREDENTIALS_EMAIL).then(
      response => {
        let refreshToken = response.header['refresh-token'];
        setTimeout(() => {
          clearInterval(intervalLogger);
          process.stdout.write(`\n`);
          try {
            const payload = jwt.verify(refreshToken, CONSTANTS.REFRESH_TOKEN_SECRET + VALID_USER.password, null);
            expect(payload).to.not.have.property('payload');
          } catch (err) {
            expect(err).to.have.property('name').to.equal('TokenExpiredError');
          }
          request.post('/auth/logout').set('refresh-token', refreshToken).then(() => {
            done(); 
          }); 
        }, testDuration); 
      }
    )
  });

  it('POSITIVE - Should return new tokens { jwt, refreshToken } when refreshing', done => {
    const testDuration: number = Number(CONSTANTS.ACCESS_TOKEN_EXPIRES_IN) + 1000;
    console.log('*********************************************************************************');
    console.log(`Testing refreshing tokens...should take max ${(testDuration / 1000)} seconds... 3 / 4`);
    console.log('*********************************************************************************');
    let i = testDuration / 1000 + 1;
    const intervalLogger = setInterval(() => process.stdout.write(` - ${i -= 1} - `), 1000);

    request.post('/auth/login').send(VALID_USER_CREDENTIALS_EMAIL).then(
      registerRespo => {
        const oldJwtToken = registerRespo.header['jwt'];
        const oldRefreshToken = registerRespo.header['refresh-token'];

        setTimeout(() => {
          clearInterval(intervalLogger);
          process.stdout.write(`\n`);
          request.post('/auth/refresh').set('refresh-token', oldRefreshToken).send(VALID_USER).then(
            refreshRespo => {
              try {
                const newJwtToken = refreshRespo.header['jwt'];
                const newRefreshToken = refreshRespo.header['refresh-token'];
                expect(refreshRespo.status).to.equal(200);
                expect(refreshRespo.header).to.have.property('jwt');
                expect(refreshRespo.header).to.have.property('refresh-token');
                expect(newJwtToken).to.not.equals(oldJwtToken);
                expect(newRefreshToken).to.not.equals(oldRefreshToken);
                request.post('/auth/logout').set('refresh-token', newRefreshToken).then(() => {
                  done();
                })
              } catch (err) {
                done(err);
              }
            }); 
        }, testDuration); 
      }
    )
  });

  it('POSITIVE - Should ask to login again if refresh token is expired when refreshing', done => {
    const testDuration: number = Number(CONSTANTS.REFRESH_TOKEN_EXPIRES_IN) + 1000;
    console.log('*********************************************************************************');
    console.log(`Testing refresh token is expired when refreshing...should take max ${(testDuration / 1000)} seconds... 4 / 4`);
    console.log('*********************************************************************************');
    let i = testDuration / 1000 + 1;
    const intervalLogger = setInterval(() => process.stdout.write(` - ${i -= 1} - `), 1000);

    request.post('/auth/login').send(VALID_USER_CREDENTIALS_EMAIL).then(
      response => {
        const refreshToken = response.header['refresh-token'];
          setTimeout(() => {
            process.stdout.write(`\n`);
            clearInterval(intervalLogger);
            
            request
            .post('/auth/refresh')
            .set('refresh-token', refreshToken)
            .send(VALID_USER)
            .then(
              resp => {
                expect(resp.status).to.equal(401);
                expect(resp.body.message).to.equal('Refresh token is no longer valid, user has to login');
                request.post('/auth/logout').set('refresh-token', refreshToken).then(() => {
                  done(); 
                }); 
              }
            )
            .catch(err => done(err));

          }, Number(CONSTANTS.REFRESH_TOKEN_EXPIRES_IN) + 1000);
      }
    )
  });

  it.skip('Should signOut a user by removing secure', async () => {
    const response = await request
      .del('/auth/logout')
      .set('authorization', VALID_USER_TOKEN);
    
    expect(response.status).to.equal(200);
    expect(response.body).to.equal('Successfully logged out!');
  });

});
