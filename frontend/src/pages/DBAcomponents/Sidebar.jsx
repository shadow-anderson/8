export default function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard Home", icon: "dashboard" },
    { id: "create-admin", label: "Create New Admin", icon: "user-plus" },
    { id: "team-data", label: "Show Team Data", icon: "team" },
    { id: "individual-data", label: "Individual Data", icon: "clipboard" },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">DB</div>
        <div className="sidebar-title">
          <h2>Admin Panel</h2>
          <p>Database Administration</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className={`nav-icon icon-${item.icon}`}></span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-arrow">›</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-version">Version 2.0</div>
      </div>
    </aside>
  )
}
