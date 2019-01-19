import mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const TRIPS =  [
    {
        _id: new ObjectId(),
        tripName: "LA",
        destination: "Los Angeles, California, United States",
        imageUrl: null,
        startDate: new Date('2019-03-12'),
        endDate: new Date('2019-03-25'),
        adminId: null
    },
    {
      _id: new ObjectId(),
      tripName: "NUGGETS",
      destination: "Denver, Colorado, United States",
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: null
    },
    {
      _id: new ObjectId(),
      tripName: "MONTREAL",
      destination: "Monteal, Quebec, Canada",
      imageUrl: null,
      startDate: new Date('2019-03-12'),
      endDate: new Date('2019-03-25'),
      adminId: null
    }
];

export default TRIPS;