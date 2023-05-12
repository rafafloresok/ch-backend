import mongoose, { Schema, model } from "mongoose";

const usersCollection = "users";

const usersSchema = new Schema(
  {
    name: String,
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    age: Number,
    role: String,
    /* role: {
      type: Schema.Types.ObjectId,
      ref: "roles",
    }, */
    github: Boolean,
    githubProfile: Object,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
    lastOrder: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

/* usersSchema.pre("find", function () {
  this.populate("role");
});

usersSchema.pre("findOne", function () {
  this.populate("role");
});

usersSchema.pre("findById", function () {
  this.populate("role");
}); */

export const usersModel = model(usersCollection, usersSchema);
