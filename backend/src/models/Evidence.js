import mongoose from "mongoose";

const EvidenceSchema = new mongoose.Schema({

  uploaded_by: { type: String, ref: "User" },
  project_id: { type: String, ref: "Project" },
  activity_id: { type: String, ref: "Activity" },

  managerId: { type: String, ref: "User" },

  file_url: [{ type: String, required: true }],
  mime: String,
  size: Number,

  gps: {
    lat: Number,
    lng: Number,
    accuracy: Number
  },

  uploaded_at: { type: Date, default: Date.now }
});

EvidenceSchema.index({ project_id: 1 });
EvidenceSchema.index({ uploaded_by: 1 });

export default mongoose.model("Evidence", EvidenceSchema);
