export default function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "create-admin", label: "Create New Admin", icon: "👤" },
    { id: "team-data", label: "Show Team Data", icon: "👥" },
    { id: "individual-data", label: "Individual Data", icon: "📋" },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>DBA Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
