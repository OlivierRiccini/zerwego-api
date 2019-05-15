'use strict';
process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
// import mongoose = require('mongoose');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { IUser } from '../../src/models/user-model';
import { CONSTANTS } from '../../src/persist/constants';
import * as jwt from 'jsonwebtoken';
import { GeneralHelper, AuthHelper } from '../data-test/helpers-data';
import { SecureService } from '../../src/services/secure-service';
import { ISecure, SecureDAO } from '../../src/models/secure-model';
import { ITrip } from '../../src/models/trip-model';

const debug = require('debug')('test');

const generalHelper: GeneralHelper = new GeneralHelper();

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe.only('HTTP - TESTING USER ROUTES ./http/user.test', function() {
  this.timeout(15000);

  const request = chai.request(app).keepOpen();

  let VALID_USER: IUser = {
    username: 'Lebron',
    email: 'lebron.james@lakers.com',
    password: 'Iamtheking',
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

    const decoded =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
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
  });

  it('Should signIn a user and get a token back set in the header', async () => {
    const response = await request
      .post('/auth/login')
      .send({email: VALID_USER.email, password: VALID_USER.password});
    
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

    await request.del('/auth/logout').set('authorization', VALID_USER_TOKEN);
  });

  it('POSITIVE - Jwt Token should expire', done => {
      console.log('Testing tokens...could take a little while... 1 / 4');
      const intervalLogger = setInterval(() => process.stdout.write(`-`), 100);

      request.post('/auth/login').send({email: VALID_USER.email, password: VALID_USER.password}).then(
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
    console.log('Testing tokens...could take a little while... 2 / 4');
    const intervalLogger = setInterval(() => process.stdout.write(`-`), 100);

    // const newUser: IUser = {
    //   username: 'Steph',
    //   email: 'steph.curry@warrriors.com',
    //   password: 'shoot',
    // };

    request.post('/auth/login').send({email: VALID_USER.email, password: VALID_USER.password}).then(
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
        }, Number(CONSTANTS.REFRESH_TOKEN_EXPIRES_IN) + 1000); 
      }
    )
  });

  it('POSITIVE - Should return new tokens { jwt, refreshToken } when refreshing', async  () => {
    console.log('Testing tokens...could take a little while... 3 / 4');
    const intervalLogger = setInterval(() => process.stdout.write(`-`), 100);

    const newUser: IUser = {
      username: 'Token Max',
      email: 'token.test@token.com',
      password: 'inholeboss',
    };

    const registerRespo = await request.post('/auth/login').send({email: VALID_USER.email, password: VALID_USER.password});
    expect(registerRespo.status).to.equal(200);

    const oldJwtToken = registerRespo.header['jwt'];
    const oldRefreshToken = registerRespo.header['refresh-token'];

    const refreshRespo = await request.post('/auth/refresh').set('refresh-token', oldRefreshToken).send(VALID_USER);
    expect(refreshRespo.status).to.equal(200);
    expect(refreshRespo.header).to.have.property('jwt');
    expect(refreshRespo.header).to.have.property('refresh-token');
    
    const newJwtToken = refreshRespo.header['jwt'];
    const newRefreshToken = refreshRespo.header['refresh-token'];

    expect(newJwtToken).to.not.equals(oldJwtToken);
    expect(newRefreshToken).to.not.equals(oldRefreshToken);
    await request.post('/auth/logout').set('refresh-token', newRefreshToken);
    clearInterval(intervalLogger);
  });

  it('POSITIVE - Should ask to login again if refresh token is expired when refreshing', done => {
    console.log('Testing tokens...could take a little while... 4 / 4');
    const intervalLogger = setInterval(() => process.stdout.write(`-`), 100);

    request.post('/auth/login').send({email: VALID_USER.email, password: VALID_USER.password}).then(
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
