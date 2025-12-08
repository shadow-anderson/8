import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="manager-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Manager Dashboard</h1>
          <div className="header-actions">
            <span className="user-name">Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* DPR Section */}
        <section className="dashboard-section">
          <h2>DPR</h2>
          <div className="section-content">
            {/* DPR content will go here */}
          </div>
        </section>

        {/* Task Section */}
        <section className="dashboard-section">
          <h2>Task</h2>
          <div className="section-content">
            {/* Task content will go here */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;
