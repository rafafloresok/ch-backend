import { Schema, model } from "mongoose";

const usersCollection = "users";

const usersSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  age: Number,
  role: String,
});

export const usersModel = model(usersCollection, usersSchema);
