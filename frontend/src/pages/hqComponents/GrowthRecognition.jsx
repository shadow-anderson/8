export default function GrowthRecognition() {
  const badges = [
    { id: 1, name: "Accuracy Champion", icon: "🎯", earned: true, date: "Dec 2024" },
    { id: 2, name: "Fast Mover", icon: "🚀", earned: true, date: "Nov 2024" },
    { id: 3, name: "Quality Star", icon: "⭐", earned: false, date: "Next 30 days" },
    { id: 4, name: "Team Player", icon: "🤝", earned: true, date: "Oct 2024" },
  ]

  const appreciationNotes = [
    {
      id: 1,
      from: "Manager - Rajesh Kumar",
      message: "Outstanding performance on the quarterly review. Keep it up!",
      date: "2 days ago",
    },
    {
      id: 2,
      from: "HR Lead - Priya Sharma",
      message: "Great teamwork on the policy documentation project.",
      date: "1 week ago",
    },
    {
      id: 3,
      from: "Department Head - Amit Patel",
      message: "Your digital transformation initiative is setting an example.",
      date: "2 weeks ago",
    },
  ]

  const targetProgress = 72

  return (
    <div className="hq-growth-section">
      <h2 className="hq-section-title">My Growth & Recognition</h2>

      <div className="hq-growth-container">
        <div className="hq-badges-section">
          <h3 className="hq-subsection-title">Earned Badges</h3>
          <div className="hq-badges-grid">
            {badges.map((badge) => (
              <div key={badge.id} className={`hq-badge-card ${badge.earned ? "hq-badge-earned" : "hq-badge-locked"}`}>
                <span className="hq-badge-icon">{badge.icon}</span>
                <p className="hq-badge-name">{badge.name}</p>
                <p className="hq-badge-date">{badge.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hq-appreciation-section">
          <h3 className="hq-subsection-title">Appreciation Notes from Lead</h3>
          <div className="hq-appreciation-list">
            {appreciationNotes.map((note) => (
              <div key={note.id} className="hq-appreciation-card">
                <div className="hq-appreciation-header">
                  <p className="hq-appreciation-from">{note.from}</p>
                  <span className="hq-appreciation-date">{note.date}</span>
                </div>
                <p className="hq-appreciation-message">"{note.message}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hq-target-section">
          <h3 className="hq-subsection-title">Q1 Target Progress</h3>
          <div className="hq-target-card">
            <div className="hq-target-bar">
              <div className="hq-target-fill" style={{ width: `${targetProgress}%` }}></div>
            </div>
            <p className="hq-target-percentage">{targetProgress}% Complete</p>
            <p className="hq-target-info">28 of 40 milestones achieved</p>
          </div>
        </div>
      </div>
    </div>
  )
}
