const debug = require('debug')('seed');
import TRIPS from './trip-data';
import { TripDAO, ITrip } from '../../src/models/trip-model';
import { UserDAO, IUser } from '../../src/models/user-model';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { MODELS_DATA } from './common-data';
import * as jwt from 'jsonwebtoken';
import { CONSTANTS } from '../../src/persist/constants';
var mongoose = require('mongoose');

chai.use(chaiHttp);
var app = require('../../dist/app').app;

export class GeneralHelper {
    constructor() {}

    cleanDB() {
        const db = mongoose.connection;
        db.dropDatabase();
    }

}

export class TripHelper {
    trips: ITrip[] = [];

    constructor(private tripDAO: TripDAO) {
        this.trips = TRIPS;
    }

    public async addTrips(user) {
        for (const trip of this.trips) {
            trip.participants.push({ 
                    userId: user.id,
                    info: {email: user.email, username: user.username},
                    status: 'request_accepted', isAdmin: true });
            await this.tripDAO.create(trip);
        }   
    }

    public async deleteAllTrips() {
        return this.tripDAO.deleteAll();   
    }
};

export class UserHelper {
    private request = chai.request(app).keepOpen();

    constructor(private userDAO: UserDAO) {
    }

    public async getUserAndToken(user?: IUser) {
        const newUser = user ? user : MODELS_DATA.User[0];
        const response = await this.request
            .post('/auth/register')
            .send(newUser)
        
        let token = response.header['authorization'];

        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        const decoded =  jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET, null);
        const userResponse = decoded['payload'];
        return { user: userResponse, token };
    }

    public async deleteAllUsers() {
        return this.userDAO.deleteAll();  
    }
}