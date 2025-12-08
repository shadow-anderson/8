import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showTaskMenu, setShowTaskMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(null); // 'individual' or 'team'
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskData, setTaskData] = useState({
    title: '',
    description: ''
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://eight-csdo.onrender.com/api/admin/users');
        const data = await response.json();
        console.log('Users from database:', data);
        
        let allUsers = [];
        // Check if data is an array or if users are nested in a property
        if (Array.isArray(data)) {
          allUsers = data;
        } else if (data.users && Array.isArray(data.users)) {
          allUsers = data.users;
        } else if (data.data && Array.isArray(data.data)) {
          allUsers = data.data;
        } else {
          console.error('Unexpected data format:', data);
          setUsers([]);
          return;
        }
        
        // Filter users with role 'employee'
        const employees = allUsers.filter(user => user.role === 'employee');
        console.log('Filtered employees:', employees);
        setUsers(employees);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTaskTypeSelect = (type) => {
    setShowSubMenu(type);
  };

  const handleAssigneeSelect = (assignee) => {
    console.log('Creating task for:', assignee);
    setTaskAssignee(assignee);
    
    // Find the selected user's _id
    const selectedUserObj = users.find(u => (u.username || u.name) === assignee);
    if (selectedUserObj) {
      setSelectedUserId(selectedUserObj._id || selectedUserObj.id);
      setSelectedUser(assignee);
    }
    
    setShowTaskMenu(false);
    setShowSubMenu(null);
    setShowTaskForm(true);
    // Reset form data
    setTaskData({
      title: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTask = async () => {
    if (!taskData.title.trim() || !taskData.description.trim()) {
      alert('Please fill in both title and description');
      return;
    }
    
    if (!selectedUserId) {
      alert('No user selected');
      return;
    }
    
    try {
      const response = await fetch('https://eight-csdo.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: selectedUserId,
          name: taskData.title,
          description: taskData.description,
          planned_end: '2',
          project_type:'single'
        })
      });
      
      const data = await response.json();
      console.log('Task creation response:', data);
      
      if (response.ok) {
        alert('Task assigned successfully!');
        
        // Reset form
        setShowTaskForm(false);
        setTaskAssignee('');
        setSelectedUser(null);
        setSelectedUserId(null);
        setTaskData({
          title: '',
          description: ''
        });
      } else {
        alert('Failed to create task: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };

  const handleCancelTask = () => {
    setShowTaskForm(false);
    setTaskAssignee('');
    setTaskData({
      title: '',
      description: ''
    });
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
        {/* Stats Overview Cards */}
        <div className="stats-container">
          <div className="stat-card stat-card-blue">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <h3 className="stat-value">24</h3>
              <p className="stat-label">Active Tasks</p>
            </div>
          </div>
          <div className="stat-card stat-card-green">
            <div className="stat-icon">✓</div>
            <div className="stat-details">
              <h3 className="stat-value">18</h3>
              <p className="stat-label">Completed</p>
            </div>
          </div>
          <div className="stat-card stat-card-orange">
            <div className="stat-icon">⏱️</div>
            <div className="stat-details">
              <h3 className="stat-value">6</h3>
              <p className="stat-label">Pending Review</p>
            </div>
          </div>
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">👥</div>
            <div className="stat-details">
              <h3 className="stat-value">12</h3>
              <p className="stat-label">Team Members</p>
            </div>
          </div>
        </div>

        {/* DPR Section */}
        <section className="dashboard-section">
          <h2>📋 Detailed Project Report</h2>
          <div className="section-content">
            <div className="dpr-grid">
              <div className="dpr-card">
                <div className="dpr-card-header">
                  <span className="dpr-status dpr-status-pending">Pending Review</span>
                  <span className="dpr-date">Dec 8, 2025</span>
                </div>
                <h4 className="dpr-title">Site Survey - Block A</h4>
                <p className="dpr-submitter">Submitted by: <strong>field1</strong></p>
                <div className="dpr-card-footer">
                  <button className="dpr-action-btn dpr-view-btn">View Details</button>
                  <button className="dpr-action-btn dpr-approve-btn">Approve</button>
                </div>
              </div>

              <div className="dpr-card">
                <div className="dpr-card-header">
                  <span className="dpr-status dpr-status-approved">Approved</span>
                  <span className="dpr-date">Dec 7, 2025</span>
                </div>
                <h4 className="dpr-title">Foundation Work - Block B</h4>
                <p className="dpr-submitter">Submitted by: <strong>field2</strong></p>
                <div className="dpr-card-footer">
                  <button className="dpr-action-btn dpr-view-btn">View Details</button>
                </div>
              </div>

              <div className="dpr-card">
                <div className="dpr-card-header">
                  <span className="dpr-status dpr-status-pending">Pending Review</span>
                  <span className="dpr-date">Dec 8, 2025</span>
                </div>
                <h4 className="dpr-title">Quality Inspection Report</h4>
                <p className="dpr-submitter">Submitted by: <strong>field1</strong></p>
                <div className="dpr-card-footer">
                  <button className="dpr-action-btn dpr-view-btn">View Details</button>
                  <button className="dpr-action-btn dpr-approve-btn">Approve</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Task Section */}
        <section className="dashboard-section">
          <div className="section-header-with-button">
            <h2>✏️ Task Assignment</h2>
            <div className="new-task-container">
              <button 
                className="new-task-btn"
                onClick={() => {
                  setShowTaskMenu(!showTaskMenu);
                  setShowSubMenu(null);
                }}
              >
                New Task
              </button>
              
              {/* Task Type Dropdown Menu */}
              {showTaskMenu && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => handleTaskTypeSelect('individual')}
                  >
                    Individual
                    <span className="arrow">›</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleTaskTypeSelect('team')}
                  >
                    Team
                    <span className="arrow">›</span>
                  </button>
                </div>
              )}

              {/* Sub Menu - Individual */}
              {showTaskMenu && showSubMenu === 'individual' && (
                <div className="dropdown-submenu">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <button 
                        key={user._id || user.id}
                        className="dropdown-item"
                        onClick={() => handleAssigneeSelect(user.username || user.name)}
                      >
                        {user.username || user.name}
                      </button>
                    ))
                  ) : (
                    <button className="dropdown-item" disabled>
                      Loading users...
                    </button>
                  )}
                </div>
              )}

              {/* Sub Menu - Team */}
              {showTaskMenu && showSubMenu === 'team' && (
                <div className="dropdown-submenu">
                  <button 
                    className="dropdown-item"
                    onClick={() => handleAssigneeSelect('team1')}
                  >
                    team1
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleAssigneeSelect('team2')}
                  >
                    team2
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Task Form */}
          {showTaskForm && (
            <div className="task-form-container">
              <div className="form-header">
                <h3>Create Task for: <span className="assignee-name">{taskAssignee}</span></h3>
              </div>
              
              <div className="form-group">
                <label htmlFor="taskTitle">Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  name="title"
                  className="form-input"
                  placeholder="Enter task title..."
                  value={taskData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskDescription">Description</label>
                <textarea
                  id="taskDescription"
                  name="description"
                  className="form-textarea"
                  placeholder="Enter task description..."
                  rows="6"
                  value={taskData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button 
                  className="cancel-btn"
                  onClick={handleCancelTask}
                >
                  Cancel
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleSubmitTask}
                >
                  Submit Task
                </button>
              </div>
            </div>
          )}

          <div className="section-content">
            {/* Task content will go here */}
          </div>
        </section>
      </main>

      {/* Overlay to close menus when clicking outside */}
      {showTaskMenu && (
        <div 
          className="dropdown-overlay"
          onClick={() => {
            setShowTaskMenu(false);
            setShowSubMenu(null);
          }}
        ></div>
      )}
    </div>
  );
};

export default ManagerDashboard;
