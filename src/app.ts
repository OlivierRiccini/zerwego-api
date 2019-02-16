require('./config/config.js')

const debug = require('debug')('server');

import "reflect-metadata"; // this shim is required
import {createExpressServer} from "routing-controllers";
import { MongooseConnection } from './db/mongoose-connection';
 
// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  cors: true,
  // defaultErrorHandler: false,
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