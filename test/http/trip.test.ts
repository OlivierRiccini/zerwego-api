'use strict';
process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import mongoose = require('mongoose');
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { TripHelper, UserHelper, GeneralHelper } from '../data-test/helpers-data';
import { TripDAO, ITrip } from '../../src/models/trip-model';
import { IUser, UserDAO } from '../../src/models/user-model';
import { MODELS_DATA } from '../data-test/common-data';

const debug = require('debug')('test');

const tripDAO: TripDAO = new TripDAO();
const userDAO: UserDAO = new UserDAO();
const generalHelper: GeneralHelper = new GeneralHelper();
// const secureDAO: SecureDAO = new SecureDAO();
const tripHelper: TripHelper = new TripHelper(tripDAO);
const userHelper: UserHelper = new UserHelper(userDAO);

const expect = chai.expect;
chai.use(chaiHttp);
chai.should();

describe('HTTP - TESTING TRIP ROUTES ./http/trip.test', function() {
  
  const request = chai.request(app).keepOpen();

  let USER: IUser;
  let USER_TOKEN: string;
  let USER_2: IUser;
  let USER_2_TOKEN: string;

  before('Initialize', async () => {
    const user1 = await userHelper.getUserAndToken(MODELS_DATA.User[0]);
    USER = user1.user;
    USER_TOKEN = user1.token;
    const user2 = await userHelper.getUserAndToken(MODELS_DATA.User[1]);
    USER_2 = user2.user;
    USER_2_TOKEN = user2.token;
  });

  afterEach('Clean up', async () => {
    await tripHelper.deleteAllTrips();
    await userHelper.deleteAllUsers();
  }); 

  after('Clean up', async () => {
    generalHelper.cleanDB()
  }); 

  it('POSITIVE - Should retrieve all trips if user authenticated', async () => {
    await tripHelper.addTrips(USER); // create 3 trips fron mocks
    return request
      .get('/trips')
      .set('Authorization', USER_TOKEN)
      .then(
        response => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.lengthOf(3);
          expect(response.body[0].userIds).to.include(USER.id);
          expect(response.body[1].userIds).to.include(USER.id);
          expect(response.body[2].userIds).to.include(USER.id);
        })
  });

  // Try to catch error in catch block and not in then
  it.skip('NEGATIVE - Should not be able to retrieve any trips if not authenticated', async () => {
    await tripHelper.addTrips(USER); // create 3 trips fron mocks
    return request
      .get('/trips')
      // Not token provided
      .then(
        response => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.lengthOf(3);
        })
        .catch(
          err => console.log(err)
        )
  });

  it('Should get a trip base on the id if user authenticated', async () => {
    const ObjectId = mongoose.Types.ObjectId;
    const trip: ITrip = {
        _id: new ObjectId(),
        tripName: "TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: null,
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: USER.id,
        // userIds: [USER.id, USER_2.id]
        userIds: [],
        waitingUsers: [
            {name: USER.name, email: USER.email},
            {name: USER_2.name, email: USER_2.email}
        ]
    };
    
    const response = await request
      .post('/trips')
      .set('Authorization', USER_TOKEN)
      .send(trip)
    
    const tripId = response.body.id;
    
    request
      .get(`/trips/${tripId}`)
      .set('Authorization', USER_TOKEN)
        .then(
          response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id').to.be.a('string').to.equal(tripId);
            expect(response.body).to.have.property('tripName').to.equal('TEST TRIP');
            expect(response.body).to.have.property('destination').to.equal('Los Angeles, California, United States');
            expect(response.body).to.have.property('imageUrl');
            expect(response.body).to.have.property('startDate');
            expect(response.body).to.have.property('endDate');
            expect(response.body).to.have.property('adminId').to.equal(USER.id);
            expect(response.body).to.have.property('userIds').to.include(USER.id);
            expect(response.body).to.have.property('userIds').to.include(USER_2.id);
          },
          err => {
            debug(err);
          }
        );

    await request 
      .del(`/trips/${tripId}`)
      .set('Authorization', USER_TOKEN);
  });

  it('NEGATIVE - Should not get a trip if user not authenticated', async () => {
    const ObjectId = mongoose.Types.ObjectId;

    const trip: ITrip = {
        _id: new ObjectId(),
        tripName: "ANOTHER TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: null,
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: USER.id,
        // userIds: [USER.id, USER_2.id]
        userIds: [],
        waitingUsers: [
          {name: USER.name, email: USER.email},
          {name: USER_2.name, email: USER_2.email}
        ]
    };
    const response = await request
      .post('/trips')
      .set('Authorization', USER_TOKEN)
      .send(trip)
    
    return request
      .get(`/trips/${response.body.id}`)
      // No token provided
        .then(response => {
          expect(response.status).to.equal(401);
          expect(response.body.message).to.equal('No authorization token provided');
        }
      )
    }
  );

  it.only('POSITIVE - Should create a valid trip if user authenticated', async () => {
    const ObjectId = mongoose.Types.ObjectId;
    const validTrip: ITrip = {
        _id: new ObjectId('111111111111111111111111'),
        tripName: "TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: 'testurlimage',
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: USER.id,
        // userIds: [USER.id, USER_2.id]
        userIds: [],
        waitingUsers: [
          {name: USER.name, email: USER.email},
          {name: USER_2.name, email: USER_2.email},
          {name: 'olivier', email: 'info@olivierriccini.com'},
          {name: 'post malone', email: 'info@postmalone.com'}
        ]
    }

    return request
      .post('/trips')
      .set('Authorization', USER_TOKEN)
      .send(validTrip)
      .then(
        response => {
          console.log(response.body);
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('id').to.be.a('string').to.equal('111111111111111111111111');
          expect(response.body).to.have.property('tripName');
          expect(response.body).to.have.property('destination');
          expect(response.body).to.have.property('imageUrl');
          expect(response.body).to.have.property('startDate');
          expect(response.body).to.have.property('endDate');
          expect(response.body).to.have.property('adminId').to.equal(USER.id);
          expect(response.body).to.have.property('userIds').to.include(USER.id);
          expect(response.body).to.have.property('userIds').to.include(USER_2.id);
        },
        err => {
          debug(err)
        }
      )
  });

  it('NEGATIVE - Should not create a valid trip if user not authenticated', async () => {
    const ObjectId = mongoose.Types.ObjectId;
    const generatedId = new ObjectId();
    const validTrip: ITrip = {
        _id: generatedId,
        tripName: "TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: 'testurlimage',
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: 'testadminid',
        userIds: [],
        waitingUsers: [
          {name: USER.name, email: USER.email},
          {name: USER_2.name, email: USER_2.email}
        ]
    }

    return request
      .post('/trips')
       // No token provided
      .send(validTrip)
      .then(response => {
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('No authorization token provided');
      })
  });

  it('POSITIVE - Should delete a trip if user is Admin only', async () => {
    
    const ObjectId = mongoose.Types.ObjectId;
    const trip : ITrip = {
        _id: new ObjectId(),
        tripName: "TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: null,
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: USER.id,
        // userIds: [USER.id, USER_2.id]
        userIds: [],
        waitingUsers: [
          {name: USER.name, email: USER.email},
          {name: USER_2.name, email: USER_2.email}
        ]
    };
    
    const response = await request
      .post('/trips')
      .set('Authorization', USER_TOKEN)
      .send(trip)
    
    const nbOfTrips = await tripDAO.count({});
    expect(nbOfTrips).to.equal(1);
    return request
      .delete(`/trips/${response.body.id}`)
      .set('Authorization', USER_TOKEN) // USER is admin
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
  });

  // See why catching errors in then block
  it.skip('Should not delete a trip if user is not Admin', async () => {
    const ObjectId = mongoose.Types.ObjectId;
    const trip : ITrip = {
        _id: new ObjectId(),
        tripName: "TEST TRIP",
        destination: "Los Angeles, California, United States",
        imageUrl: null,
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: USER.id,
        // userIds: [USER.id, USER_2.id]
        userIds: [],
        waitingUsers: [
          {name: USER.name, email: USER.email},
          {name: USER_2.name, email: USER_2.email}
        ]
    };
    
    const response = await request
      .post('/trips')
      .set('Authorization', USER_TOKEN)
      .send(trip)
    
    let nbOfTrips = await tripDAO.count({});
    expect(nbOfTrips).to.equal(1);
    return request
      .delete(`/trips/${response.body.id}`)
      .set('Authorization', USER_2_TOKEN) // USER_2 is not admin of this trip
      .then(
        (response) => {
          console.log(response.body);
          // chai.assert.equal(1, 2, 'Should not delete trip');
      })
      .catch(response => {
        console.log(response);
      });
  });

  it('POSITIVE - Should update a valid trip if authenticated and part of the trip', async () => {
    const ObjectId = mongoose.Types.ObjectId;

    const trip: ITrip = {
      _id: new ObjectId(),
      tripName: 'TEST TRIP',
      destination: 'Los Angeles, California, United States',
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: USER.id,
      // userIds: [USER.id, USER_2.id]
      userIds: [],
      waitingUsers: [
        {name: USER.name, email: USER.email},
        {name: USER_2.name, email: USER_2.email}
      ]
    };
    
    await request
      .post('/trips')
      .set('Authorization', USER_TOKEN)
      .send(trip)

    const tripToUpdate: ITrip = {
      tripName: 'TEST TRIP UPDATED',
      destination: 'Los Angeles, California, United States',
      imageUrl: 'new image url',
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: USER_2.id,
      // userIds: [USER.id, USER_2.id]
      userIds: [],
      waitingUsers: [
        {name: USER.name, email: USER.email},
        {name: USER_2.name, email: USER_2.email}
      ]
    }

    const id = trip._id;

    return request
      .put(`/trips/${id}`)
      .set('Authorization', USER_2_TOKEN)
      .send(tripToUpdate)
      .then(response => {
        expect(response.status).to.equal(200);
        expect(response.body.tripName).to.equal('TEST TRIP UPDATED');
        expect(response.body.imageUrl).to.equal('new image url');
        expect(response.body).to.have.property('adminId').to.equal(USER_2.id);
        expect(response.body).to.have.property('userIds').to.include(USER.id);
        expect(response.body).to.have.property('userIds').to.include(USER_2.id);
      });
    
  });

  it.skip('Should not update a trip if not authenticated and/or part of the trip', async () => {
    const ObjectId = mongoose.Types.ObjectId;

    const trip: ITrip = {
      _id: new ObjectId(),
      tripName: 'TEST TRIP',
      destination: 'Los Angeles, California, United States',
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: USER.id,
      // userIds: [USER.id, USER_2.id]
      userIds: [],
      waitingUsers: [
        {name: USER.name, email: USER.email},
        {name: USER_2.name, email: USER_2.email}
      ]
    };
    
    await request
      .post('/trips')
      .set('Authorization', USER_TOKEN)
      .send(trip)

    const tripToUpdate: ITrip = {
      tripName: 'TEST TRIP EVER',
      destination: 'Los Angeles, California, United States',
      imageUrl: 'new image url',
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: 'testadminid',
      userIds: [],
      waitingUsers: [
        {name: USER.name, email: USER.email},
        {name: USER_2.name, email: USER_2.email}
      ]
    }

    const id = trip._id;

    return request
      .put(`/trips/${id}`)
      // No token provided
      .send(tripToUpdate)
      .then(response => {
        // chai.assert.equal(1, 2, 'Should not update a trip')
      }, response => {
        expect(response.status).to.equal(401);
      });
    
  });

});
