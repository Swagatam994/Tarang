import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
    },
    password: {
      type: String,

      minlength: 6,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
); //createdAt & UpdatedAt
const User = mongoose.model("User", userSchema);
export default User;
