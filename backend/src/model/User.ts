import { model, Schema, Types } from "mongoose";

type User = {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  verificationToken: string | null;
  lastSentEmail: Date | null;
  resetToken: string | null;
  resetTokenExpiredDate: Date | null;
  provider: "local" | "github";
  providerId?: string;
  avatar?: string;
  githubUsername?: string;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [15, "First name cannot exceed 15 characters"],
    },
    lastName: {
      type: String,
      default: "",
      maxlength: [20, "Last name cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    lastSentEmail: {
      type: Date,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiredDate: {
      type: Date,
      default: null,
    },
    provider: {
      type: String,
      default: "local",
      enum: ["local", "github"],
    },
    providerId: {
      type: String,
      index: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    githubUsername: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
export default User;
