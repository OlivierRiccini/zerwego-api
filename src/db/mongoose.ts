import mongoose = require('mongoose');

export class MongooseConnection {
    public init() {
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
            .then(() => console.log("SUCCES"))
            .catch((err) => console.log(err));
    }
}
