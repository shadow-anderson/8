import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

  emp_code: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },

  role: { 
    type: String, 
    enum: ["employee", "manager"],
    required: true 
  },

  designation: String,

  division: String,       // e.g., "hq", "feild"
  team: String,           // e.g., "File Team A"

  manager_id: { type: String, ref: "User" },

  skills: [String],

  location: {
    lat: Number,
    lng: Number
  },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

UserSchema.index({ emp_code: 1 }, { unique: true });
UserSchema.index({ division: 1 });
UserSchema.index({ team: 1 });

export default mongoose.model("User", UserSchema);
