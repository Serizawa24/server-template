import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
      max: 12,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 15,
    },
    image: {
      type: String,
      default: "smileblush.png",
    },
    role:{
      type: String,
      default:"user"
    },
    tick:{
      type: Boolean,
      default: false
    },
    isBan:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
