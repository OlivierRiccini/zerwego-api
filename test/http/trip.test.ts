'use strict';
process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import mongoose = require('mongoose');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { TripHelper, UserHelper } from '../data-test/helpers-data';
import { TripDAO, ITrip } from '../../src/models/trip-model';
import { IUser, UserDAO } from '../../src/models/user-model';
import { MODELS_DATA } from '../data-test/common-data';

const debug = require('debug')('test');

const tripDAO: TripDAO = new TripDAO();
const userDAO: UserDAO = new UserDAO();
const tripHelper: TripHelper = new TripHelper(tripDAO);
const userHelper: UserHelper = new UserHelper(userDAO);

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe('HTTP - TESTING TRIP ROUTES ./http/trip.test', function() {
  
  const request = chai.request(app).keepOpen();

  let USER: IUser;
  let USER_TOKEN: string;

  before('Initialize', async (done) => {
    tripHelper.addTrips().then(() => {}).catch(() => {});
    request
      .post('/users/signUp')
      .send(MODELS_DATA.User[0])
      .then(response => {
        USER = response.body;
        USER_TOKEN = response.header['x-auth'];
      })
      .catch(err => console.log(err));
    done();
  });

  after('Clean up', async (done) => {
    tripHelper.deleteAllTrips().then(() => {}).catch(() => {});;
    userHelper.deleteAllUsers().then(() => {}).catch(() => {});;
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

    const trip: ITrip = {
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
    const validTrip: ITrip = {
        _id: new ObjectId('111111111111111111111111'),
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
            expect(response.body).to.have.property('id').to.be.a('string').to.equal('111111111111111111111111');
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

  it('Should delete a trip', async () => {
    const ObjectId = mongoose.Types.ObjectId;

    const trip : ITrip = {
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
    
    const nbOfTrips = await tripDAO.count({});
    expect(nbOfTrips).to.equal(6);
    return request
      .delete(`/trips/${response.body.id}`)
        .then(
          async response => {
            expect(response.status).to.equal(200);
            const newNbOfTrips = await tripDAO.count({});
            expect(newNbOfTrips).to.equal(nbOfTrips -1);
          },
          err => {
            debug(err)
          }
        )
    }  
  );

  it('Should update a valid trip', async () => {
    const ObjectId = mongoose.Types.ObjectId;

    const trip: ITrip = {
        _id: new ObjectId(),
        tripName: 'TEST TRIP',
        destination: 'Los Angeles, California, United States',
        imageUrl: null,
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: null
    };
    
    await request
      .post('/trips')
      .send(trip)

    const tripToUpdate: ITrip = {
      tripName: 'TEST TRIP EVER',
      destination: 'Los Angeles, California, United States',
      imageUrl: 'new image url',
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: 'testadminid'
    }

    const id = trip._id;

    return request
      .put(`/trips/${id}`)
      .send(tripToUpdate)
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.tripName).to.equal('TEST TRIP EVER');
        expect(response.body.imageUrl).to.equal('new image url');
      });
    
  });

});
