import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({

  user_id: { type: String, ref: "User", required: true },
  period: { type: String, required: true },  // "2025-10"

  kpi_score_total: Number,   // sum of all weighted KPI scores
  behavior_score: Number,    // 0–30
  final_score: Number,       // 0–100

  computed_at: { type: Date, default: Date.now }
});

ScoreSchema.index({ user_id: 1, period: 1 }, { unique: true });
ScoreSchema.index({ final_score: -1 }); // leaderboard

export default mongoose.model("Score", ScoreSchema);
