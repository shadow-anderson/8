"use client"

export default function HQSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "tasks", label: "Assigned Tasks", icon: "✓" },
    { id: "evidence", label: "Evidence & Files", icon: "📁" },
    { id: "timeline", label: "Timeline Map", icon: "🔗" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "kpi", label: "KPI Report", icon: "📈" },
    { id: "growth", label: "My Growth", icon: "⭐" },
  ]

  return (
    <aside className="hq-sidebar">
      <div className="hq-sidebar-header">
        <h2>HQ Portal</h2>
      </div>
      <nav className="hq-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`hq-nav-item ${activeSection === item.id ? "hq-nav-active" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="hq-nav-icon">{item.icon}</span>
            <span className="hq-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
