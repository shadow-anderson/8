import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({

  name: { type: String, required: true },
  division: { type: String, required: true },  // e.g., "Admin", "Design", "Survey"
  
  leader_email: { type: String, ref: "User" },
  members: [{ type: String, ref: "User" }],

  description: String,

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

TeamSchema.index({ division: 1 });
TeamSchema.index({ leader_id: 1 });

export default mongoose.model("Team", TeamSchema);