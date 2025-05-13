import { model, Schema, Types } from "mongoose";

export type FriendType = {
  _id: Types.ObjectId;
  requesterId: Types.ObjectId;
  recipientId: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
};

const FriendSchema = new Schema<FriendType>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

FriendSchema.index({ requesterId: 1, recipientId: 1, status: 1 });
FriendSchema.index({ recipientId: 1, requesterId: 1, status: 1 });

const Friend = model("Friend", FriendSchema);
export default Friend;
