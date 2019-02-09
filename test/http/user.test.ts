'use strict';
process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import mongoose = require('mongoose');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
// import { TripSeed } from '../data-test/trip-seed';
import { UserDAO, IUser } from '../../src/models/user-model';
const debug = require('debug')('test');

const userDAO: UserDAO = new UserDAO();
// const tripSeed: TripSeed = new TripSeed(tripDAO);

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe('HTTP - TESTING USER ROUTES ./http/user.test', function() {
  
  const request = chai.request(app).keepOpen();

  it('Should create a user and get token', async () => {
    // const ObjectId = mongoose.Types.ObjectId;

    const validUser: IUser = {
        name: 'Lebron',
        email: 'lebron.james@lakers.com',
        password: 'Iamtheking'
    };

    return request
      .post('/users')
        .send(validUser)
        .then(
          response => {
            console.log('');
          },
          err => {
            debug(err)
          }
        )
    }
  );

});
