import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({

  name: { type: String, required: true },
  description: { type: String },

  owner_id: { type: String, ref: "User" },
  members: [{ type: String, ref: "User" }],

  givenBy: {type: String, ref: "User"},

  division: String,
  project_type: {
    type: String,
    enum: ["single", "milestone"],
    required: true
  },

  // SINGLE-TIME PROJECT FIELDS
  planned_end: Date,
  progress: { type: Number, default: 0 }, // 0–100 %

  status: {
        type: String,
        enum: ["not_started", "in_progress", "completed", "delayed"],
        default: "not_started"
  },

  // MILESTONE-BASED PROJECT FIELDS
  milestones: [
    {
      name: String,
      planned_date: Date,
      actual_date: Date,
      progress: { type: Number, default: 0 }, // 0–100 %
      status: {
        type: String,
        enum: ["not_started", "in_progress", "completed", "delayed"],
        default: "not_started"
      }
    }
  ],

  budget_planned: Number,
  budget_used: Number,

  created_at: { type: Date, default: Date.now }
});

ProjectSchema.index({ owner_id: 1 });
ProjectSchema.index({ division: 1 });
ProjectSchema.index({ project_type: 1 });

export default mongoose.model("Project", ProjectSchema);
