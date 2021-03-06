import mongoose = require('mongoose');
import { ITrip } from '../../src/models/trip-model';

const ObjectId = mongoose.Types.ObjectId;

const TRIPS: ITrip[] =  [
    {
      _id: new ObjectId(),
      tripName: "LA",
      destination: "Los Angeles, California, United States",
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      participants: []
    },
    {
      _id: new ObjectId(),
      tripName: "NUGGETS",
      destination: "Denver, Colorado, United States",
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      participants: []
    },
    {
      _id: new ObjectId('oooooooooooo'),
      tripName: "MONTREAL",
      destination: "Monteal, Quebec, Canada",
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      participants: []
    }
];

export default TRIPS;