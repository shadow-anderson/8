export default function KPIreport() {
  const kpis = [
    {
      category: "Timeliness",
      name: "File Disposal Time",
      value: 8.5,
      max: 10,
      status: "green",
    },
    {
      category: "Quality",
      name: "No. of Revisions Required",
      value: 7.2,
      max: 10,
      status: "green",
    },
    {
      category: "Responsiveness",
      name: "Response to Queries",
      value: 6.8,
      max: 10,
      status: "yellow",
    },
    {
      category: "Clarity",
      name: "Drafting Clarity Score",
      value: 8.1,
      max: 10,
      status: "green",
    },
    {
      category: "Digital Adoption",
      name: "Paperless Task Handling",
      value: 9.0,
      max: 10,
      status: "green",
    },
    {
      category: "Workload",
      name: "Tasks Completed",
      value: 7.5,
      max: 10,
      status: "yellow",
    },
  ]

  return (
    <div className="hq-kpi-section">
      <h2 className="hq-section-title">Monthly KPI Report</h2>

      <div className="hq-kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`hq-kpi-card hq-kpi-status-${kpi.status}`}>
            <div className="hq-kpi-header">
              <h4 className="hq-kpi-category">{kpi.category}</h4>
              <span className={`hq-kpi-status-icon hq-status-${kpi.status}`}>{kpi.status === "green" ? "✓" : "!"}</span>
            </div>
            <p className="hq-kpi-name">{kpi.name}</p>
            <div className="hq-kpi-progress">
              <div className="hq-kpi-bar">
                <div
                  className={`hq-kpi-fill hq-kpi-fill-${kpi.status}`}
                  style={{ width: `${(kpi.value / kpi.max) * 100}%` }}
                ></div>
              </div>
              <span className="hq-kpi-value">{kpi.value.toFixed(1)}/10</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hq-improvement-suggestions">
        <h3>Improvement Suggestions</h3>
        <ul className="hq-suggestions-list">
          <li>Focus on response time to queries - aim to reduce avg response by 2 hours</li>
          <li>Continue strong digital adoption - maintain paperless workflow</li>
          <li>Increase task completion rate - prioritize high-impact tasks</li>
        </ul>
      </div>
    </div>
  )
}
