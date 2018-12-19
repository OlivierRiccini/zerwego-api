import { Model } from "mongoose";
import { IUserModel } from "./user-model";

export interface IModel {
  user: Model<IUserModel>;
}