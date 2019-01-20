import mongoose = require('mongoose');
const debug = require('debug')('data-base');

export class MongooseConnection {
    public init() {
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
            .then(() => debug(`Successfully connected DB: ${process.env.MONGODB_URI}`))
            .catch((err) => debug(err));
    }
}
