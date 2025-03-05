import { model, Schema } from "mongoose";

type User = {
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  isEmailVerified: boolean;
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
    provider: {
      type: String,
      default: "local",
      enum: ["local", "github"],
    },
    providerId: {
      type: String,
      index: true,
    },
    avatar: String,
    githubUsername: String,
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
export default User;
