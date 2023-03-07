import mongoose, { Schema } from "mongoose";

const fightSchema = new mongoose.Schema(
  {
    winner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Fight = mongoose.model("Fight", fightSchema);

export default Fight;
