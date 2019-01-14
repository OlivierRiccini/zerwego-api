var assert = require('assert');
const request = require('supertest');
const expect = require('expect');

var app = require('../dist/app').app;


describe('Trips', function() {
  it('Should retrieve all trips', async (done) => {
    request(app)
      .get('/trips')
      .expect(200)
      .expect(res => {
        console.log(res);
        expect(res.body.length).toEqual(10);
      })
      .end(done);
  });
});