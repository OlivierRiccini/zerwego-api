import mongoose = require('mongoose');
import { TripDAO } from '../../src/models/trip-model';

export const MODELS = [
    {
        name: 'Trip',
        DAO: new TripDAO(),
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
    ] 
};

// export default MODEL_NAMES;
// export default MODELS_DATA;