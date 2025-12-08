import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({

  user_id: { type: String, ref: "User", required: true },
  project_id: { type: String, ref: "Project", default: null },

  type: { 
    type: String, 
    enum: ["file", "project"],
    required: true
  },

  action: { 
    type: String,
    enum: ["received", "closed", "update", "progress"],
    required: true
  },

  timestamp: { type: Date, default: Date.now },

  // HQ-specific fields (for file KPIs)
  file_id: { type: String, default: null },
  tat_days: { type: Number, default: null },

  // Field-specific fields (for project KPIs)
  progress: { type: Number, default: null },   // 0–100 %

  meta: {} // flexible extra info
});

ActivitySchema.index({ user_id: 1, timestamp: -1 });
ActivitySchema.index({ project_id: 1 });
ActivitySchema.index({ type: 1 });

export default mongoose.model("Activity", ActivitySchema);
