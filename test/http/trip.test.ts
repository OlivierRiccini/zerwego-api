'use strict';
process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import mongoose = require('mongoose');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { TripService } from '../../src/services/trip-Service'
import { TripSeed } from '../seed/trip-seed';
import { TripDAO } from '../../src/models/trip-model';
const debug = require('debug')('test');

const tripService: TripService = new TripService(new TripDAO());
const tripSeed: TripSeed = new TripSeed(tripService);

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();


describe('Trips', function() {
  const request = chai.request(app).keepOpen();

  before('Initialize', (done) => {
    tripSeed.addTrips()
      .then(() => debug('Done, DB for tests ready!'))
      .catch(err => debug('Error during seeding DB test= ' + err))
    done();
  });

  after('Clean up', (done) => {
    tripSeed.deleteAllTrips()
      .then(() => debug('Done, DB cleaned up after tests!'))
      .catch(err => debug('Error during cleaning DB test= ' + err))
    done();  
  }); 

  it('Should retrieve all trips', async () => {
    return request
      .get('/trips')
        .then(
          response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.lengthOf(3);
          },
          err => {
            debug(err)
          }
        )
    }
  );

  it('Should get a trip base on the id', async () => {
    const ObjectId = mongoose.Types.ObjectId;

    const trip = {
        _id: new ObjectId(),
        tripName: "TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: null,
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: null
    };
    
    const response = await request
      .post('/trips')
      .send(trip)
    
      return request
      .get(`/trips/${response.body.id}`)
        .then(
          response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id').to.be.a('string').to.equal(response.body.id);
            expect(response.body).to.have.property('tripName').to.equal('TEST TRIP');
            expect(response.body).to.have.property('destination').to.equal('Los Angeles, California, United States');
            expect(response.body).to.have.property('imageUrl');
            expect(response.body).to.have.property('startDate');
            expect(response.body).to.have.property('endDate');
            expect(response.body).to.have.property('adminId');
          },
          err => {
            debug(err)
          }
        )
    }
  );

  it('Should create a valid trip', async () => {
    const ObjectId = mongoose.Types.ObjectId;

    const validTrip = {
        _id: new ObjectId('000000000000000000000000'),
        tripName: "TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: 'testurlimage',
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: 'testadminid'
    }

    return request
      .post('/trips')
        .send(validTrip)
        .then(
          response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id').to.be.a('string').to.equal('000000000000000000000000');
            expect(response.body).to.have.property('tripName');
            expect(response.body).to.have.property('destination');
            expect(response.body).to.have.property('imageUrl');
            expect(response.body).to.have.property('startDate');
            expect(response.body).to.have.property('endDate');
            expect(response.body).to.have.property('adminId');
          },
          err => {
            debug(err)
          }
        )
    }
  );

  // it('Should delete a trip', async (done) => {
  //   const ObjectId = mongoose.Types.ObjectId;

  //   const trip = {
  //       _id: new ObjectId(),
  //       tripName: "TEST TRIP",
  //       destination: "Los Angeles, California, United States",
  //       imageUrl: null,
  //       startDate: new Date('2019-03-12'),
  //       endDate: new Date('2019-03-25'),
  //       adminId: null
  //   };
    
  //   const response = await request
  //     .post('/trips')
  //     .send(trip)
    
  //     return request
  //     .delete(`/trips/${response.body.id}`)
  //       .then(
  //         response => {
  //           expect(response.status).to.equal(200);
  //           expect(response.body).to.have.lengthOf(3);
  //           done();
  //         },
  //         err => {
  //           debug(err)
  //         }
  //       )
  //   }
  // );


});
