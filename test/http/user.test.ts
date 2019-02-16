'use strict';
process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import mongoose = require('mongoose');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { UserDAO, IUser } from '../../src/models/user-model';
const debug = require('debug')('test');

const userDAO: UserDAO = new UserDAO();

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

  after('Cleaning DB', async () => {
    await userDAO.delete(validUser.id);
  });

  let validUserToken: string;

  it('Should signUp a user and get token back set in the header', async () => {
    const response = await request
      .post('/users/signUp')
      .send(validUser);
    
    const user = response.body;

    expect(response.status).to.equal(200);
    expect(user).to.have.property('id');
    expect(user).to.have.property('name');
    expect(user).to.have.property('email');
    expect(response.header).to.have.property('x-auth');
    // Assign id to validUser to reuse in other tests
    validUser.id = user.id;
    validUser.tokens = user.tokens;
    // Save token to reuse in other tests
    validUserToken = response.header['x-auth'];
  });

  it('Should signOut a user by removing token', async () => {
    const response = await request
      .del('/users/signOut')
      .set('x-auth', validUserToken);

    expect(response.status).to.equal(200);
    expect(response.body).to.equal('Disconnected!');
    
  });

  it('Should signIn a user and get a token back set in the header', async () => {
    const response = await request
      .post('/users/signIn')
      .send({email: validUser.email, password: validUser.password});

    const user = response.body;
    expect(response.status).to.equal(200);
    expect(user).to.have.property('id');
    expect(user).to.have.property('name');
    expect(user).to.have.property('email');
    expect(response.header).to.have.property('x-auth');
    
  });

});
