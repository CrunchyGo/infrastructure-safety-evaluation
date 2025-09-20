// models/HomeForm.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoom extends Document {
  interiorCeiling?: string[];
  interiorFrontWall?: string[];
  interiorRightWall?: string[];
  interiorBackWall?: string[];
  interiorLeftWall?: string[];
  interiorFloor?: string[];
  exteriorFrontWall?: string[];
  exteriorRightWall?: string[];
  exteriorLeftWall?: string[];
  exteriorBackWall?: string[];
  roof?: string[];
}

export interface IHomeForm extends Document {
  udiseCode: string;
  schoolName: string;
  boardFile?: string;
  state: string;
  district: string;
  block: string;
  rooms: IRoom[];
  created_date: Date;
  updated_date: Date;
}

// Room sub-schema
const RoomSchema: Schema<IRoom> = new Schema(
  {
    interiorCeiling: [{ type: String }],
    interiorFrontWall: [{ type: String }],
    interiorRightWall: [{ type: String }],
    interiorBackWall: [{ type: String }],
    interiorLeftWall: [{ type: String }],
    interiorFloor: [{ type: String }],
    exteriorFrontWall: [{ type: String }],
    exteriorRightWall: [{ type: String }],
    exteriorLeftWall: [{ type: String }],
    exteriorBackWall: [{ type: String }],
    roof: [{ type: String }],
  },
  { _id: false }
);

// HomeForm schema
const HomeFormSchema: Schema<IHomeForm> = new Schema(
  {
    udiseCode: { 
      type: String, 
      required: true,
      trim: true
    },
    schoolName: { type: String, required: true },
    boardFile: { type: String },
    state: { type: String, required: true },
    district: { type: String, required: true },
    block: { type: String, required: true },
    rooms: {
      type: [RoomSchema],
      validate: [(val: IRoom[]) => val.length > 0, "At least one room is required"],
    },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "created_date", updatedAt: "updated_date" },
  }
);


const HomeForm: Model<IHomeForm> =
  mongoose.models.HomeForm || mongoose.model<IHomeForm>("HomeForm", HomeFormSchema);

export default HomeForm;