import mongoose from "mongoose";

const KpiNormSchema = new mongoose.Schema({
  _id: { type: String }, // uuid

  kpi_code: { type: String, required: true },
  weight:{ type: String, required: true},
  formula: {type: String}
});


export default mongoose.model("KpiNorm", KpiNormSchema);
