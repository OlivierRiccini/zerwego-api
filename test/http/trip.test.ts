process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { TripSeed } from '../seed/trip-seed';

chai.use(chaiHttp);
chai.should();

const tripSeed = new TripSeed();
tripSeed.addTrips();

describe('Trips', function() {
  const request = chai.request(app);

  it('Should retrieve all trips', () => {
    return request
      .get('/trips')
      .then(
        response => {
          response.body.should.be.ok;
          // response.body.should.be.json;
          response.body.should.have.lengthOf(10);
        },
        err => console.log(err)
      )
  });
});
