import { TripDAO } from '../../src/models/trip-model';
import { UserDAO } from '../../src/models/user-model';
import { ObjectID } from 'bson';

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

export const MODELS_DATA = {
    User: [
        {
            _id: new ObjectID('111111111111111111111111'),
            username: "Lebron James",
            email: "lebron.james@lakers.com",
            password: "123456"
        },
        {
            _id: new ObjectID('222222222222222222222222'),
            username: "Stephen Curry",
            email: "stephen.curry@warriors.com",
            password: "123456"
        }
    ],
    Trip: [
        {
            tripName: "LA",
            destination: "Los Angeles, California, United States",
            imageUrl: null,
            startDate: new Date('2019-03-12'),
            endDate: new Date('2019-03-25'),
            participants: [
                { userId: null, info: { email: 'lebron.james@lakers.com', username: 'Lebron James' }, status: 'admin' },
                { userId: null, info: { email: 'stephen.curry@warriors.com', username: 'Stephen Curry' }, status: 'pending' },
            ]
        },
        {
            tripName: "NYC",
            destination: "New York City, New-York, United States",
            imageUrl: null,
            startDate: new Date('2019-03-12'),
            endDate: new Date('2019-03-25'),
            participants: [
                { userId: null, info: { email: 'lebron.james@lakers.com', username: 'Lebron James' }, status: 'pending' },
                { userId: null, info: { email: 'stephen.curry@warriors.com', username: 'Stephen Curry' }, status: 'admin' },
            ]
        }
    ]
};
