"use strict";
// import * as express from "express";
// import * as trip from './controllers/trip-controller';
// import * as bodyParser from 'body-parser';
// import cors = require('cors');
Object.defineProperty(exports, "__esModule", { value: true });
// // Our Express APP config
// const app = express();
// app.set("port", process.env.PORT || 3000);
// app.use(cors({
//   origin: 'http://localhost:4200'
// }));
// // API Endpoints
// // API Endpoints
// app.use(bodyParser.json());
// app.get('/', trip.allTrips)
// app.get('/:id', trip.getTrip)
// app.post('/', trip.addTrip)
// app.put('/:id', trip.updateTrip)
// app.delete('/:id', trip.deleteTrip)
// const server = app.listen(app.get("port"), () => {
//   console.log("App is running on http://localhost:%d", app.get("port"))
// });
require("reflect-metadata"); // this shim is required
const routing_controllers_1 = require("routing-controllers");
const trip_controller_1 = require("./controllers/trip-controller");
const mongoose = require("mongoose");
// creates express app, registers all controller routes and returns you express app instance
const app = routing_controllers_1.createExpressServer({
    cors: true,
    controllers: [trip_controller_1.TripController] // we specify controllers we want to use
});
const uri = 'mongodb://127.0.0.1:27017/zerwego-api';
mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Succesfully Connected!");
    }
});
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
    console.log(`Server running on port ${app.get("port")}`);
});
//# sourceMappingURL=app.js.map