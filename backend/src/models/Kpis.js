import mongoose from "mongoose";

const KpiItemSchema = new mongoose.Schema({
  kpi_code: { type: String, required: true },  // e.g., "file_disposal_rate"
  computedValues: [ {type: Number} ],                 // actual numeric result before normalization
 
}, { _id: false });

const KpiSchema = new mongoose.Schema({
  user_id: { type: String, ref: "User", required: true },
  period: { type: String, required: true },  // "2025-10"
  projectId: { type: String, required: true },
  
  kpis: [KpiItemSchema],  // Array of KPI objects
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

KpiSchema.index(
  { user_id: 1, period: 1, projectId: 1 },
  { unique: true }
);

KpiSchema.index({ projectId: 1 });
KpiSchema.index({ period: 1 });

export default mongoose.model("Kpi", KpiSchema);
