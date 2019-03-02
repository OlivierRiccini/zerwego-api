const debug = require('debug')('seed');
import TRIPS from './trip-data';
import { TripDAO, ITrip } from '../../src/models/trip-model';
import { UserDAO, IUser } from '../../src/models/user-model';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MODELS_DATA } from './common-data';
chai.use(chaiHttp);
var app = require('../../dist/app').app;

export class TripHelper {
    trips: ITrip[] = [];

    constructor(private tripDAO: TripDAO) {
        this.trips = TRIPS;
    }

    public async addTrips(user) {
        for (const trip of this.trips) {
            trip.adminId = user.id;
            trip.userIds = [ user.id ];
            await this.tripDAO.create(trip);
        }   
    }

    public async deleteAllTrips() {
        return this.tripDAO.deleteAll();   
    }
};

export class UserHelper {
    constructor(private userDAO: UserDAO) {
    }

    public async getUserAndToken(user?: IUser) {
        const newUser = user ? user : MODELS_DATA.User[0];
        const request = chai.request(app).keepOpen();
        const response = await request
            .post('/users/register')
            .send(newUser)
        
        const userResponse = response.body;
        const token = response.header['authorization'];
        return { user: userResponse, token };
    }

    public async deleteAllUsers() {
        return this.userDAO.deleteAll();  
    }
}