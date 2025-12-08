import mongoose from "mongoose";

const OrgSchema = new mongoose.Schema({

  name: { type: String, required: true },  // e.g., "Brahmaputra Board"
  type: { 
    type: String, 
    enum: ["hq", "division", "unit"],
    required: true 
  },

  parent_org_id: { type: String, ref: "Org", default: null },  // for hierarchical structure

  head_id: { type: String, ref: "User" },  // head of this org unit

  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },

  contact: {
    email: String,
    phone: String
  },

  description: String,

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

OrgSchema.index({ type: 1 });
OrgSchema.index({ parent_org_id: 1 });

export default mongoose.model("Org", OrgSchema);