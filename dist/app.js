"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./config/config.js');
const debug = require('debug')('server');
require("reflect-metadata"); // this shim is required
const routing_controllers_1 = require("routing-controllers");
const trip_controller_1 = require("./controllers/trip-controller");
const mongoose_connection_1 = require("./db/mongoose-connection");
const user_controller_1 = require("./controllers/user-controller");
// creates express app, registers all controller routes and returns you express app instance
const app = routing_controllers_1.createExpressServer({
    cors: true,
    controllers: [trip_controller_1.TripController, user_controller_1.UserController] // we specify controllers we want to use
});
const mongooseConnection = new mongoose_connection_1.MongooseConnection();
mongooseConnection.init();
app.set("port", process.env.PORT);
app.listen(app.get("port"), () => {
    debug(`Server running on port ${app.get("port")}`);
});
module.exports.app = app;
//# sourceMappingURL=app.js.map