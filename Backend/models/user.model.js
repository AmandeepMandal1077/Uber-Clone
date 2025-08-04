import mongoose from "mongoose";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [2, "First Name must be atleast 2 characters"],
    },
    lastname: {
      type: String,
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be atleast 5 characters"],
  },

  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be atleast 6 characters"],
    select: false,
  },

  socketIO: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const USER = mongoose.model("user", userSchema);
export default USER;
