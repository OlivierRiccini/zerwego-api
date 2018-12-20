import mongoose = require("mongoose");
import { IUserModel } from './IUserModel';
import { Schema } from "mongoose";
// import { UserSchema}  from '../schemas/user-schema';
let UserSchema: Schema = new Schema({
	email: String,
	firstName: String,
	lastName: String
  });

export const User = mongoose.model<IUserModel>("User", UserSchema);

export default  User;