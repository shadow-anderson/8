"use client"

import { useState } from "react"

export default function CompareKPI() {
  const [selectedMonth, setSelectedMonth] = useState("current")

  const comparisonData = {
    yourKPI: [
      { category: "Timeliness", current: 8.5, previous: 7.8, average: 7.2 },
      { category: "Quality", current: 7.2, previous: 7.5, average: 6.8 },
      { category: "Responsiveness", current: 6.8, previous: 6.5, average: 7.0 },
      { category: "Clarity", current: 8.1, previous: 7.9, average: 7.5 },
      { category: "Digital Adoption", current: 9.0, previous: 8.8, average: 6.5 },
      { category: "Workload", current: 7.5, previous: 7.3, average: 7.8 },
    ],
    teamAverage: 7.3,
    yourAverage: 7.9,
    rank: 3,
    totalMembers: 25,
  }

  const topPerformers = [
    { name: "Rahul Sharma", score: 9.2, department: "HR" },
    { name: "Priya Patel", score: 8.8, department: "Finance" },
    { name: "You", score: 7.9, department: "Administration" },
    { name: "Amit Kumar", score: 7.7, department: "Operations" },
    { name: "Sneha Reddy", score: 7.5, department: "Legal" },
  ]

  return (
    <div className="hq-compare-section">
      <h2 className="hq-section-title">Compare KPI Performance</h2>

      <div className="hq-compare-header">
        <div className="hq-compare-filters">
          <button
            className={`hq-filter-btn ${selectedMonth === "current" ? "hq-filter-active" : ""}`}
            onClick={() => setSelectedMonth("current")}
          >
            Current Month
          </button>
          <button
            className={`hq-filter-btn ${selectedMonth === "previous" ? "hq-filter-active" : ""}`}
            onClick={() => setSelectedMonth("previous")}
          >
            Previous Month
          </button>
        </div>
      </div>

      <div className="hq-compare-summary">
        <div className="hq-summary-card hq-summary-you">
          <h3>Your Average Score</h3>
          <p className="hq-summary-value">{comparisonData.yourAverage}</p>
          <span className="hq-summary-badge">🏆 Rank #{comparisonData.rank}/{comparisonData.totalMembers}</span>
        </div>
        <div className="hq-summary-card hq-summary-team">
          <h3>Team Average Score</h3>
          <p className="hq-summary-value">{comparisonData.teamAverage}</p>
          <span className="hq-summary-badge">
            📊 {comparisonData.yourAverage > comparisonData.teamAverage ? "Above Average" : "Below Average"}
          </span>
        </div>
      </div>

      <div className="hq-comparison-grid">
        <div className="hq-comparison-card">
          <h3 className="hq-subsection-title">Category-wise Comparison</h3>
          <div className="hq-comparison-table">
            <div className="hq-comparison-header">
              <span>Category</span>
              <span>You</span>
              <span>Team Avg</span>
              <span>Difference</span>
            </div>
            {comparisonData.yourKPI.map((kpi, idx) => {
              const diff = (kpi.current - kpi.average).toFixed(1)
              const isPositive = diff > 0
              return (
                <div key={idx} className="hq-comparison-row">
                  <span className="hq-comparison-category">{kpi.category}</span>
                  <span className="hq-comparison-your-score">{kpi.current.toFixed(1)}</span>
                  <span className="hq-comparison-avg-score">{kpi.average.toFixed(1)}</span>
                  <span className={`hq-comparison-diff ${isPositive ? "hq-diff-positive" : "hq-diff-negative"}`}>
                    {isPositive ? "+" : ""}
                    {diff}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="hq-comparison-card">
          <h3 className="hq-subsection-title">Top Performers (Department-wise)</h3>
          <div className="hq-leaderboard">
            {topPerformers.map((performer, idx) => (
              <div
                key={idx}
                className={`hq-leaderboard-item ${performer.name === "You" ? "hq-leaderboard-you" : ""}`}
              >
                <span className="hq-leaderboard-rank">#{idx + 1}</span>
                <div className="hq-leaderboard-info">
                  <span className="hq-leaderboard-name">{performer.name}</span>
                  <span className="hq-leaderboard-dept">{performer.department}</span>
                </div>
                <span className="hq-leaderboard-score">{performer.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hq-insights-section">
        <h3 className="hq-subsection-title">Key Insights</h3>
        <div className="hq-insights-grid">
          <div className="hq-insight-card hq-insight-strength">
            <span className="hq-insight-icon">💪</span>
            <div>
              <h4>Your Strengths</h4>
              <p>Digital Adoption (+2.5 above avg), Timeliness (+1.3 above avg)</p>
            </div>
          </div>
          <div className="hq-insight-card hq-insight-improve">
            <span className="hq-insight-icon">🎯</span>
            <div>
              <h4>Areas to Improve</h4>
              <p>Responsiveness (-0.2 below avg), Quality (-0.6 below avg)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
