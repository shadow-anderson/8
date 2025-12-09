import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';
import CreateUser from './DBAcomponents/CreateUser';
import TeamData from './DBAcomponents/TeamData';
import IndividualData from './DBAcomponents/IndividualData';
import Sidebar from './DBAcomponents/Sidebar';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

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
          <div className="dashboard-welcome">
            <div className="dashboard-content">
              <h1>Admin Dashboard</h1>
              <div className="user-info">
                <p>Welcome, <strong>{user?.username}</strong></p>
                <p>Role: <strong>{user?.role}</strong></p>
              </div>
              <p className="welcome-message">Select an option from the left sidebar to get started.</p>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="dashboard-main-content">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
