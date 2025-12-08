export default function TimelineMap() {
  const timelineData = [
    {
      id: 1,
      task: "Salary Processing",
      blocker: "Waiting for Finance Approval",
      status: "blocked",
      priority: "High",
    },
    {
      id: 2,
      task: "Leave Approval",
      blocker: "None",
      status: "active",
      priority: "Medium",
    },
    {
      id: 3,
      task: "Promotion Letter",
      blocker: "Waiting for HR Head Sign-off",
      status: "blocked",
      priority: "High",
    },
    {
      id: 4,
      task: "Performance Review",
      blocker: "Waiting on peer feedback",
      status: "blocked",
      priority: "Medium",
    },
    {
      id: 5,
      task: "Training Completion",
      blocker: "None",
      status: "completed",
      priority: "Low",
    },
  ]

  return (
    <div className="hq-timeline-section">
      <h2 className="hq-section-title">Timeline & Dependency Map</h2>
      <p className="hq-timeline-subtitle">See what's blocking you and who's waiting for you</p>

      <div className="hq-timeline-container">
        {timelineData.map((item) => (
          <div key={item.id} className={`hq-timeline-item hq-timeline-${item.status}`}>
            <div className="hq-timeline-status-indicator"></div>
            <div className="hq-timeline-content">
              <h3 className="hq-timeline-task">{item.task}</h3>
              <p className="hq-timeline-blocker">{item.blocker}</p>
              <span className={`hq-timeline-badge hq-priority-${item.priority.toLowerCase()}`}>{item.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
