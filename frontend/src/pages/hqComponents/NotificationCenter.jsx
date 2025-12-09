export default function NotificationCenter() {
  const notifications = [
    {
      id: 1,
      type: "new-task",
      title: "New Task Assigned",
      message: "Annual Leave Approval submitted by HR Manager",
      time: "2 hours ago",
      icon: "✓",
    },
    {
      id: 2,
      type: "review",
      title: "Review Remarks Received",
      message: "Your performance report has comments from your manager",
      time: "5 hours ago",
      icon: "💬",
    },
    {
      id: 3,
      type: "deadline",
      title: "Deadline Reminder",
      message: "File Disposal Form due in 24 hours",
      time: "1 day ago",
      icon: "⏰",
    },
    {
      id: 4,
      type: "alert",
      title: "KPI Alert",
      message: "Your KPI score dropped by 3% this week",
      time: "2 days ago",
      icon: "⚠️",
    },
    {
      id: 5,
      type: "new-task",
      title: "Task Updated",
      message: "Monthly Report deadline extended to Jan 20",
      time: "3 days ago",
      icon: "📝",
    },
  ]

  return (
    <div className="hq-notification-section">
      <h2 className="hq-section-title">Notifications Center</h2>

      <div className="hq-notification-list">
        {notifications.map((notif) => (
          <div key={notif.id} className={`hq-notification-item hq-notif-${notif.type}`}>
            <span className="hq-notif-icon">{notif.icon}</span>
            <div className="hq-notif-content">
              <h4 className="hq-notif-title">{notif.title}</h4>
              <p className="hq-notif-message">{notif.message}</p>
              <span className="hq-notif-time">{notif.time}</span>
            </div>
            <button className="hq-notif-close">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
