import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
  },

  // 💰 ADD THIS
  income: {
    type: Number,
    default: 0,
  },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
