import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './style-dashboard/dash.css';
import CreateUser from './DBAcomponents/CreateUser';
import TeamData from './DBAcomponents/TeamData';
import IndividualData from './DBAcomponents/IndividualData';
import Sidebar from './DBAcomponents/Sidebar';

const AdminDashboard = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('https://eight-csdo.onrender.com/api/admin/users');
      const usersData = await usersResponse.json();
      const users = Array.isArray(usersData) ? usersData : usersData.users || usersData.data || [];
      
      // Fetch projects
      const projectsResponse = await fetch('https://eight-csdo.onrender.com/api/projects');
      const projectsData = await projectsResponse.json();
      const projects = Array.isArray(projectsData) ? projectsData : projectsData.projects || projectsData.data || [];
      
      setStats({
        totalUsers: users.length,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.progress > 0 && p.progress < 100).length,
        completedProjects: projects.filter(p => p.progress === 100).length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case "create-admin":
        return <CreateUser />;
      case "team-data":
        return <TeamData />;
      case "individual-data":
        return <IndividualData />;
      default:
        return (
          <div className="admin-dashboard-home">
            {/* Header Section */}
            <div className="admin-header">
              <div className="admin-header-content">
                <div className="admin-header-left">
                  <div className="admin-logo">AD</div>
                  <div className="admin-header-text">
                    <h1>Administration Dashboard</h1>
                    <p>System Management & Analytics</p>
                  </div>
                </div>
                <div className="admin-header-right">
                  <div className="admin-user-info">
                    <div className="admin-avatar">{(userProfile?.name || user?.username)?.charAt(0).toUpperCase()}</div>
                    <div className="admin-user-details">
                      <span className="admin-user-name">{userProfile?.name || user?.username}</span>
                      <span className="admin-user-role">{user?.role || 'Administrator'}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="admin-logout-btn">
                    <span className="logout-icon"></span>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon stat-users"></div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-value">{stats.totalUsers}</p>
                  <span className="stat-label">Registered</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon stat-projects"></div>
                <div className="stat-content">
                  <h3>Total Projects</h3>
                  <p className="stat-value">{stats.totalProjects}</p>
                  <span className="stat-label">All Projects</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon stat-active"></div>
                <div className="stat-content">
                  <h3>Active Projects</h3>
                  <p className="stat-value">{stats.activeProjects}</p>
                  <span className="stat-label">In Progress</span>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="stat-icon stat-completed"></div>
                <div className="stat-content">
                  <h3>Completed</h3>
                  <p className="stat-value">{stats.completedProjects}</p>
                  <span className="stat-label">Finished</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-quick-actions">
              <h2>Quick Actions</h2>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => setActiveSection('create-admin')}>
                  <span className="action-icon icon-user-plus"></span>
                  <span className="action-label">Create New Admin</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveSection('team-data')}>
                  <span className="action-icon icon-team"></span>
                  <span className="action-label">View Team Data</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveSection('individual-data')}>
                  <span className="action-icon icon-individual"></span>
                  <span className="action-label">Individual Data</span>
                </button>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="admin-welcome-card">
              <h2>Welcome, {userProfile?.name || user?.username}!</h2>
              <p>Use the sidebar to navigate through different sections of the admin panel.</p>
              <p className="admin-note">You have full access to system management and user administration.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container admin-dashboard">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="dashboard-main-content">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
