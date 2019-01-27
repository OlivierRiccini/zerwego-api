import mongoose = require('mongoose');
import { TripDAO } from '../../src/models/trip-model';
import { UserDAO } from '../../src/models/user-model';

export const MODELS = [
    {
        name: 'Trip',
        DAO: new TripDAO(),
    },
    {
        name: 'User',
        DAO: new UserDAO(),
    }
];

const ObjectId = mongoose.Types.ObjectId;
export const MODELS_DATA = {
    Trip: [
        {
            tripName: "LA",
            destination: "Los Angeles, California, United States",
            imageUrl: null,
            startDate: new Date('2019-03-12'),
            endDate: new Date('2019-03-25'),
            adminId: null
        },
        {
            tripName: "NYC",
            destination: "New York City, New-York, United States",
            imageUrl: null,
            startDate: new Date('2019-03-12'),
            endDate: new Date('2019-03-25'),
            adminId: null
        }
    ],
    User: [
        {
            name: "Lebron James",
            email: "lebron.james@lakers.com",
            password: "123456"
        },
        {
            name: "Stephen Curry",
            email: "stephen.curry@warriors.com",
            password: "123456"
        }
    ]

};
