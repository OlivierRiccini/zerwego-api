process.env.NODE_ENV = 'test';
var app = require('../../dist/app').app;

import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
// import createTrip from '../seed/trip-seed';
// import { TripService}  from '../../src/services/trip-service';

chai.use(chaiHttp);
chai.should();

// const tripSeed = new TripSeed();
// createTrip();

const trips =  [
  {
      tripName: "Test",
      destination: "Los Angeles, California, United States",
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: null
  }
];



describe('Trips', function() {
  const request = chai.request(app);

  it('Should retrieve all trips', async () => {
    const response = await request
      .post('/trips')
      .send(trips[0]);

    console.log(response.body);

    const de = await request
      .delete(response.body.id)

    // return request
    //   .get('/trips')
    //   .then(
    //     response => {
    //       response.body.should.be.ok;
    //       // response.body.should.be.json;
    //       response.body.should.have.lengthOf(10);
    //     },
    //     err => console.log(err)
    //   )
  });
});
