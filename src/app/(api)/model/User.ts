// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { connectDB } from "@/utils/db_connection";

export interface IUser extends Document {
  udiseCode: string;
  password: string;
  created_date: Date;
  updated_date: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    udiseCode: {
      type: String,
      required: true,
      match: [/^\d{6,}$/, "UDISE Code must be at least 6 digits"],
      minlength: [6, "UDISE Code must be at least 6 digits"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    updated_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_date", updatedAt: "updated_date" },
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
