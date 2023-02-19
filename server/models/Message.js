import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    fromId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
