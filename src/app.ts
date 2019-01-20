require('./config/config.js')

const debug = require('debug')('server');

import "reflect-metadata"; // this shim is required
import {createExpressServer} from "routing-controllers";
import {TripController} from "./controllers/trip-controller";
import { MongooseConnection } from './db/mongoose-connection';
 
// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  cors: true,
  controllers: [TripController] // we specify controllers we want to use
});

const mongooseConnection = new MongooseConnection();
mongooseConnection.init();

app.set("port", process.env.PORT);

app.listen(app.get("port"), () => {
  debug(`Server running on port ${app.get("port")}`);
});

module.exports.app = app;