import mongoose = require("mongoose");
//interfaces
import IUser = require('../interfaces/user-interface'); //import IUser

//models
import IModel = require('../models/model'); //import IModel 
import IUserModel from '../models/user-model';//import IUserModel 

//schemas
import userSchema = require('../schemas/user-schema'); //import userSchema

export class mongooseConfig {
    env: string = process.env.NODE_ENV || 'development';
    model = Object(); 

    constructor() {};

    connect() {
        if (this.env === 'development') {
            process.env.PROD_MONGODB = 'mongodb://localhost:27017/zerwego-mongo';
        } else if (this.env === 'test') {
            process.env.PROD_MONGODB = 'mongodb://localhost:27017/zerwego-test';
        }

        mongoose.Promise = global.Promise;
        let connection: mongoose.Connection = mongoose.createConnection(process.env.PROD_MONGODB, { useNewUrlParser: true });
        this.model.user = connection.model<IUserModel>("User", userSchema);
        // .then((succ) => {
        //     console.log(succ);
        //     console.log('MONGODB IS CONNECTED!')
        //     this.model.user = connection.model<IUserModel>("User", userSchema);
        // }, (err) => console.log("MONGODB NOT CONNECTED: ", err ));
        
    }
}

export default new mongooseConfig();