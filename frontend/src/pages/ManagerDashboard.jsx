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
  const [evidenceData, setEvidenceData] = useState([]);
  const [kpiInputs, setKpiInputs] = useState({
    dprTimeliness: '',
    dprQuality: '',
    surveyAccuracy: '',
    milestoneHitRate: '',
    physicalProgress: '',
    budgetVariance: '',
    qcPassRate: '',
    fieldEvidenceCompleteness: ''
  });

  useEffect(() => {
    const fetchManagerEvidence = async () => {
      const managerId = '6936b237e32c05c1be088e40';
      
      try {
        const response = await fetch(`https://eight-csdo.onrender.com/api/evidence/manager/${managerId}`);
        const data = await response.json();
        console.log('Manager evidence data:', data);
        setEvidenceData(data);
      } catch (error) {
        console.error('Error fetching manager evidence:', error);
        setEvidenceData([]);
      }
    };

    fetchManagerEvidence();
  }, []);

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
          project_type:'single',
          givenBy: '6936b237e32c05c1be088e40'
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

  const handleKpiInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow numeric values between 0-100
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setKpiInputs(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCalculateKPI = () => {
    // Check if all fields are filled
    const allFilled = Object.values(kpiInputs).every(value => value !== '');
    
    if (!allFilled) {
      alert('Please fill in all KPI fields');
      return;
    }

    // Calculate average or process KPI
    const values = Object.values(kpiInputs).map(v => parseInt(v));
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    console.log('KPI Values:', kpiInputs);
    console.log('Average KPI Score:', average.toFixed(2));
    
    alert(`KPI Calculated!\nAverage Score: ${average.toFixed(2)}`);
    
    // TODO: Send to backend or process further
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
              {evidenceData.evidences && evidenceData.evidences.length > 0 ? (
                evidenceData.evidences.map((evidence) => (
                  <div key={evidence._id} className="dpr-card">
                    <div className="dpr-card-header">
                      <span className="dpr-status dpr-status-pending">Pending Review</span>
                      <span className="dpr-date">
                        {new Date(evidence.uploaded_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h4 className="dpr-title">{evidence.project_id?.name || 'Untitled Project'}</h4>
                    <p className="dpr-description">{evidence.project_id?.description || 'No description'}</p>
                    <p className="dpr-submitter">
                      Submitted by: <strong>{evidence.uploaded_by?.name || 'Unknown'}</strong>
                    </p>
                    <div className="dpr-card-footer">
                      <button 
                        className="dpr-action-btn dpr-view-btn"
                        onClick={() => window.open(evidence.file_url, '_blank')}
                      >
                        View Details
                      </button>
                      <button className="dpr-action-btn dpr-approve-btn">Approve</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No DPR submissions yet</p>
              )}
            </div>
          </div>
        </section>

        {/* KPI Input Section */}
        <section className="dashboard-section">
          <h2>📊 KPI Component Scores</h2>
          <div className="section-content">
            <div className="kpi-inputs-grid">
              <div className="kpi-input-group">
                <label htmlFor="dprTimeliness">DPR Timeliness Score</label>
                <input
                  type="number"
                  id="dprTimeliness"
                  name="dprTimeliness"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.dprTimeliness}
                  onChange={handleKpiInputChange}
                />
              </div>

              <div className="kpi-input-group">
                <label htmlFor="dprQuality">DPR Quality Score</label>
                <input
                  type="number"
                  id="dprQuality"
                  name="dprQuality"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.dprQuality}
                  onChange={handleKpiInputChange}
                />
              </div>

              <div className="kpi-input-group">
                <label htmlFor="surveyAccuracy">Survey Accuracy Score</label>
                <input
                  type="number"
                  id="surveyAccuracy"
                  name="surveyAccuracy"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.surveyAccuracy}
                  onChange={handleKpiInputChange}
                />
              </div>

              <div className="kpi-input-group">
                <label htmlFor="milestoneHitRate">Milestone Hit Rate</label>
                <input
                  type="number"
                  id="milestoneHitRate"
                  name="milestoneHitRate"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.milestoneHitRate}
                  onChange={handleKpiInputChange}
                />
              </div>

              <div className="kpi-input-group">
                <label htmlFor="physicalProgress">Physical Progress Index</label>
                <input
                  type="number"
                  id="physicalProgress"
                  name="physicalProgress"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.physicalProgress}
                  onChange={handleKpiInputChange}
                />
              </div>

              <div className="kpi-input-group">
                <label htmlFor="budgetVariance">Budget Variance Score</label>
                <input
                  type="number"
                  id="budgetVariance"
                  name="budgetVariance"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.budgetVariance}
                  onChange={handleKpiInputChange}
                />
              </div>

              <div className="kpi-input-group">
                <label htmlFor="qcPassRate">QC Pass Rate</label>
                <input
                  type="number"
                  id="qcPassRate"
                  name="qcPassRate"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.qcPassRate}
                  onChange={handleKpiInputChange}
                />
              </div>

              <div className="kpi-input-group">
                <label htmlFor="fieldEvidenceCompleteness">Field Evidence Completeness</label>
                <input
                  type="number"
                  id="fieldEvidenceCompleteness"
                  name="fieldEvidenceCompleteness"
                  className="kpi-input"
                  placeholder="0-100"
                  min="0"
                  max="100"
                  value={kpiInputs.fieldEvidenceCompleteness}
                  onChange={handleKpiInputChange}
                />
              </div>
            </div>

            <div className="kpi-submit-container">
              <button 
                className="kpi-submit-btn"
                onClick={handleCalculateKPI}
              >
                Calculate KPI
              </button>
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
