import { Document } from "mongoose";
import { IUser } from "../interfaces/user-interface";

export interface IUserModel extends IUser, Document {
  //custom methods for your model would be defined here
}