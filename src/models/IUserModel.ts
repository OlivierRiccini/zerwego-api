import mongoose = require("mongoose");

import IUser = require("../interfaces/user-interface");

export interface IUserModel extends IUser, mongoose.Document { }