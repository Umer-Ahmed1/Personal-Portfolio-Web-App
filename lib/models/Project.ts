// lib/models/Project.ts
import { Schema, Document, model, models } from "mongoose";

export type ModuleStatus = "Not Started" | "In Progress" | "In Review" | "Completed";
export type ModuleName   = "Design" | "Development" | "SEO" | "Deployment";
export type OverallStatus =
  | "Not Started" | "In Progress" | "In Review" | "Completed" | "On Hold";

export interface IModule {
  name:   ModuleName;
  status: ModuleStatus;
  order:  number;
}

export interface IProject extends Document {
  clientId:      string;   // e.g. "UA-2024-A3F9" — login username
  passwordPlain: string;   // stored plain so we can show/email it once
  projectName:   string;
  clientName:    string;
  clientEmail:   string;
  startDate:     string;
  expectedDate:  string;
  overallStatus: OverallStatus;
  modules:       IModule[];
  createdAt:     Date;
  updatedAt:     Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    name:  { type: String, enum: ["Design","Development","SEO","Deployment"], required: true },
    status:{ type: String, enum: ["Not Started","In Progress","In Review","Completed"], default: "Not Started" },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    clientId:      { type: String, required: true, unique: true },
    passwordPlain: { type: String, required: true },
    projectName:   { type: String, required: true },
    clientName:    { type: String, required: true },
    clientEmail:   { type: String, required: true },
    startDate:     { type: String, required: true },
    expectedDate:  { type: String, required: true },
    overallStatus: {
      type: String,
      enum: ["Not Started","In Progress","In Review","Completed","On Hold"],
      default: "Not Started",
    },
    modules: [ModuleSchema],
  },
  { timestamps: true }
);

export const Project =
  models.Project || model<IProject>("Project", ProjectSchema);