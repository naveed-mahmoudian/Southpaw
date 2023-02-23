import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastInitial: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    DOB: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      default: "",
    },
    nickname: String,
    bio: String,
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    strikes: {
      type: Number,
      default: 0,
    },
    isDeactivated: {
      type: Boolean,
      default: false,
    },
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    fights: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    passes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    chat_rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatRoom",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
