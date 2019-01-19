process.env.NODE_ENV = 'test';

var app = require('../../dist/app').app;

import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { TripService } from '../../src/services/trip-Service'
import { TripSeed } from '../seed/trip-seed';

const tripService: TripService = new TripService();
const tripSeed: TripSeed = new TripSeed(tripService);

chai.use(chaiHttp);
chai.should();

describe('Trips', function() {
  const request = chai.request(app).keepOpen();

  before('Initialize', (done) => {
    tripSeed.addTrips()
      .then(() => console.log('Done, DB for test ready!'))
      .catch(err => console.log('Error during seeding DB test= ' + err))
    done();
  });

  after('Clean up', (done) => {
    tripSeed.deleteAllTrips()
      .then(() => console.log('Done, DB for test ready!'))
      .catch(err => console.log('Error during cleaning DB test= ' + err))
    done();  
  }); 

  it('Should retrieve all trips', async () => {
    return request
      .get('/trips')
        .then(
          response => {
            response.body.should.be.ok;
            response.body.should.have.lengthOf(3);
          },
          err => {
            console.log(err)
          }
        )
    });
});
