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
import { GeneralHelper } from '../data-test/helpers-data';

const debug = require('debug')('test');

const generalHelper: GeneralHelper = new GeneralHelper();

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe('HTTP - TESTING USER ROUTES ./http/user.test', function() {
  
  const request = chai.request(app).keepOpen();

  let validUser: IUser = {
    name: 'Lebron',
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
      name: 'Steph',
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
    expect(user).to.have.property('name');
    expect(user).to.have.property('email');
  });

  it('POSITIVE - Should create a refresh token when login or signup', async () => {
    
  })

  it.skip('Should signOut a user by removing token', async () => {
    const response = await request
      .del('/auth/logout')
      .set('authorization', validUserToken);

    expect(response.status).to.equal(200);
    expect(response.body).to.equal('Disconnected!');
    
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
    expect(user).to.have.property('name');
    expect(user).to.have.property('email');
  });

});
