export default function ProductivityCards() {
  const cards = [
    {
      title: "Today's Score",
      value: "8.5/10",
      color: "card-green",
      change: "+2.1%",
    },
    {
      title: "Weekly Performance",
      value: "92%",
      color: "card-blue",
      change: "+5.3%",
    },
    {
      title: "KPI Achievement",
      value: "87%",
      color: "card-purple",
      change: "-1.2%",
    },
    {
      title: "Team Rank",
      value: "#3/25",
      color: "card-orange",
      change: "+2 positions",
    },
  ]

  return (
    <div className="hq-cards-section">
      <h2 className="hq-section-title">Productivity Snapshot</h2>
      <div className="hq-cards-grid">
        {cards.map((card, idx) => (
          <div key={idx} className={`hq-card ${card.color}`}>
            <h3 className="hq-card-title">{card.title}</h3>
            <p className="hq-card-value">{card.value}</p>
            <p className="hq-card-change">{card.change}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
