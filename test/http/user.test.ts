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

// const secureDAO: SecureDAO = new SecureDAO();
// const authHelper: AuthHelper = new AuthHelper();

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe('HTTP - TESTING USER ROUTES ./http/user.test', function() {
  this.timeout(15000);

  const request = chai.request(app).keepOpen();

  let validUser: IUser = {
    username: 'Lebron',
    email: 'lebron.james@lakers.com',
    password: 'Iamtheking',
  };

  let validUserToken: string;

  before('Create user', async () => {
    const response = await request
      .post('/auth/register')
      .send(validUser);
    let token = response.header['authorization'];
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    const decoded =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
    const user = decoded['payload'];
    // Assign id to validUser to reuse in other tests
    validUser.id = user.id;
    // Save token to reuse in other tests
    validUserToken = token;
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
       
    expect(response.header).to.have.property('authorization');

    let token = response.header['authorization'];
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
  });

  it('POSITIVE - Token should expire', done => {
      console.log('Testing tokens...could take a little while... 1 / 3');
      const intervalLogger = setInterval(() => process.stdout.write(`-`), 100);

      const newUser: IUser = {
        username: 'Steph',
        email: 'steph.curry@warrriors.com',
        password: 'shoot',
      };

      request.post('/auth/register').send(newUser).then(
        response => {
          let token = response.header['authorization'];
          if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
          }
          setTimeout(() => {
            clearInterval(intervalLogger);
            process.stdout.write(`\n`);
            try {
              const payload =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
              expect(payload).to.not.have.property('payload');
            } catch (err) {
              expect(err).to.have.property('name').to.equal('TokenExpiredError');
            }
            done(); 
          }, Number(CONSTANTS.ACCESS_TOKEN_EXPIRES_IN) + 1000); 
        }
      )
  });

  it('POSITIVE - If access_token is expired and refresh token not, should return a new access_token', done => {
    console.log('Testing tokens...could take a little while... 2 / 3');
    const intervalLogger = setInterval(() => process.stdout.write(`-`), 100);

    const newUser: IUser = {
      username: 'Olivier',
      email: 'olivier.riccini@leboss.com',
      password: 'inholeboss',
    };

    request.post('/auth/register').send(newUser).then(
      response => {
        let token = response.header['authorization'];
        const decoded =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
        const user: IUser = decoded['payload'];

          setTimeout(() => {
            clearInterval(intervalLogger);
            process.stdout.write(`\n`);
            const trip: ITrip = {
              tripName: "TEST TRIP",
              destination: "Los Angeles, California, United States",
              imageUrl: null,
              startDate: new Date('2019-03-12'),
              endDate: new Date('2019-03-25'),
              participants: [
                { userId: user.id, info: { email: user.email, username: user.username }, isAdmin: true }
              ]
            };
    
            request
              .post('/trips')
              .set('Authorization', token)
              .send(trip)
              .then(
                tripRes => {
                  const newToken: string = tripRes.header['authorization'];
                  expect(newToken).to.not.equal(token);
                  const decodedOriginalToken = jwt.decode(token);
                  const decodedNewToken = jwt.decode(newToken);
                  expect(decodedNewToken['exp'] - decodedOriginalToken['exp']).to.equal((Number(CONSTANTS.ACCESS_TOKEN_EXPIRES_IN) + 1000)/1000);
                  expect(tripRes.status).to.equal(200);
                  done(); 
                }
              )
              .catch(err =>  done(err));

          }, Number(CONSTANTS.ACCESS_TOKEN_EXPIRES_IN) + 1000);
      }
    )
  });

  it('NEGATIVE - Should allow request and ask to login again if refresh token is expired', done => {
    console.log('Testing tokens...could take a little while... 3 / 3');
    const intervalLogger = setInterval(() => process.stdout.write(`-`), 100);
    const newUser: IUser = {
      username: 'Token Max',
      email: 'token.test@token.com',
      password: 'inholeboss',
    };

    request.post('/auth/register').send(newUser).then(
      response => {
        let token = response.header['authorization'];
        const decoded =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
        const user: IUser = decoded['payload'];

          setTimeout(() => {
            clearInterval(intervalLogger);
            process.stdout.write(`\n`);
            const trip: ITrip = {
              tripName: "TEST TRIP",
              destination: "Los Angeles, California, United States",
              imageUrl: null,
              startDate: new Date('2019-03-12'),
              endDate: new Date('2019-03-25'),
              participants: [
                { userId: user.id, info: { email: user.email, username: user.username }, isAdmin: true }
              ]
            };
    
            request
              .post('/trips')
              .set('Authorization', token)
              .send(trip)
              .then(
                tripRes => {
                  expect(tripRes.status).to.equal(403);
                  expect(tripRes.header).to.not.have.property('authorization');
                  expect(tripRes.body.message).to.equal('Refresh token is expired, user has to login');
                  done(); 
                }
              )
              .catch(err => done(err));

          }, Number(CONSTANTS.REFRESH_TOKEN_EXPIRES_IN) + 1000);
      }
    )
  });

  it('Should signOut a user by removing secure', async () => {
    const response = await request
      .del('/auth/logout')
      .set('authorization', validUserToken);
    
    expect(response.status).to.equal(200);
    expect(response.body).to.equal('Successfully logged out!');
  });

  it('Should signIn a user and get a token back set in the header', async () => {
    const response = await request
      .post('/auth/login')
      .send({email: validUser.email, password: validUser.password});
    
    expect(response.header).to.have.property('authorization');
    
    let token = response.header['authorization'];
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
  });

});
