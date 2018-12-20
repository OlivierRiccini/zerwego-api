import { Schema } from "mongoose";

export let UserSchema: Schema = new Schema({
  createdAt: Date,
  email: String,
  firstName: String,
  lastName: String
});
// User.pre("save", (next) => {
//   if (!this.createdAt) {
//     this.createdAt = new Date();
//   }
//   next();
// });