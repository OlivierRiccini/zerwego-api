require('./config/config.js')

const debug = require('debug')('server');

import "reflect-metadata"; // this shim is required
import {createExpressServer} from "routing-controllers";
import {TripController} from "./controllers/trip-controller";
import { MongooseConnection } from './db/mongoose-connection';
import { UserController } from "./controllers/user-controller";
 
// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  cors: true,
  // controllers: [TripController, UserController] // we specify controllers we want to use
  controllers: [__dirname + "/controllers/**/*.js"],
  middlewares: [__dirname + "/middlewares/**/*.js"]
});

const mongooseConnection = new MongooseConnection();
mongooseConnection.init();

app.set("port", process.env.PORT);

app.listen(app.get("port"), () => {
  debug(`Server running on port ${app.get("port")}`);
});

module.exports.app = app;