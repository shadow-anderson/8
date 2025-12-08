import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const HQWorkerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>HQ Worker Dashboard</h1>
        <div className="user-info">
          <p>Welcome, <strong>{user?.username}</strong></p>
          <p>Role: <strong>{user?.role}</strong></p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default HQWorkerDashboard;
