import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ManagerDashboard.css';
const a = [];



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
  const [dprEvaluationData, setDprEvaluationData] = useState(null);
  const [kpiResult, setKpiResult] = useState(null);
  const [isAnalyzingDpr, setIsAnalyzingDpr] = useState(false);

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

  const computeVASA = (params) => {
    // params = { p1: [...5 numbers], p2: [...], ..., p5: [...] }
    const paramArrays = Object.values(params);

    // Helper Functions
    const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    const variance = arr => {
        const m = mean(arr);
        return mean(arr.map(x => (x - m) ** 2));
    };

    // absolute z-score mean
    const absZScoreMean = arr => {
        const m = mean(arr);
        const sd = Math.sqrt(variance(arr)) || 1e-9;
        const zs = arr.map(x => Math.abs((x - m) / sd));
        return mean(zs);
    };

    // STEP 1–4: parameter_score = absZMean * sqrt(stability)
    // stability = 1 / variance
    const parameterScores = paramArrays.map(arr => {
        const varr = variance(arr);
        const stability = 1 / (varr + 1e-9);
        const absZ = absZScoreMean(arr);
        return absZ * Math.sqrt(stability);
    });

    // STEP 5: Min-Max normalize parameter scores
    const minScore = Math.min(...parameterScores);
    const maxScore = Math.max(...parameterScores);
    const range = maxScore - minScore || 1e-9;

    const normalized = parameterScores.map(s => (s - minScore) / range);

    // STEP 6: Entropy Weighting
    const sumNorm = normalized.reduce((a, b) => a + b, 0) || 1e-9;

    const p = normalized.map(v => v / sumNorm);

    const k = 1 / Math.log(5);
    const entropy = -k * p.reduce((sum, pi) => {
        return pi > 0 ? sum + pi * Math.log(pi) : sum;
    }, 0);

    // all parameters share the same entropy when symmetric → equal weights
    const weights = Array(5).fill(1 / 5);

    // STEP 7: Final KPI = weighted sum * 100
    let KPI = 0;
    for (let i = 0; i < 5; i++) {
        KPI += weights[i] * normalized[i];
    }

    return KPI * 100; // scale to 0–100
  };

  const handleCalculateKPI = () => {
    if (!dprEvaluationData) {
      alert('No DPR evaluation data available. Please analyze DPR first.');
      return;
    }

    try {
      const result = computeVASA(dprEvaluationData);
      setKpiResult(result);
      console.log('Calculated KPI:', result);
    } catch (error) {
      console.error('Error calculating KPI:', error);
      alert('Error calculating KPI. Please check the data.');
    }
  };

  const handleAnalyzeDpr = async () => {
    setIsAnalyzingDpr(true);
    setDprEvaluationData(null);
    setKpiResult(null);

    try {
      const response = await fetch('https://gemini-flash-api-sqag.onrender.com/evaluate-dpr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: 'https://niftem-t.ac.in/pmfme/dpr-tpowder.pdf'
        })
      });

      if (!response.ok) {                             
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const [weight1] = 12;
      const [weight2] = 30;
      const [weight3] = 15;
      const [weight4] = 20;
      const [weight5] = 23;
      

      const data = await response.json();
      console.log('DPR Evaluation Response:', data);
      setDprEvaluationData(data);
      alert('DPR Analysis completed successfully!');
    } catch (error) {
      console.error('Error evaluating DPR:', error);
      alert('Error analyzing DPR. Please try again.');
    } finally {
      setIsAnalyzingDpr(false);
    }
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

        {/* KPI Calculation Section */}
        <section className="dashboard-section">
          <h2>📊 Key Performance Indicator Analysis</h2>
          <div className="section-content">
            {!kpiResult ? (
              <div className="kpi-submit-container">
                <button 
                  className="analyze-dpr-btn"
                  onClick={handleAnalyzeDpr}
                  disabled={isAnalyzingDpr}
                >
                  {isAnalyzingDpr ? '⏳ Analyzing DPR...' : '🔍 Analyze DPR'}
                </button>
                <button 
                  className="kpi-submit-btn"
                  onClick={handleCalculateKPI}
                  disabled={!dprEvaluationData}
                >
                  {dprEvaluationData ? 'Calculate KPI Score' : 'Calculate KPI Score'}
                </button>
                {isAnalyzingDpr && (
                  <p className="kpi-loading">⏳ Analyzing DPR data, please wait...</p>
                )}
              </div>
            ) : (
              <div className="kpi-result-container">
                <div className="kpi-result-card">
                  <div className="kpi-result-header">
                    <h3>VASA Performance Score</h3>
                    <span className="kpi-badge">Calculated</span>
                  </div>
                  <div className="kpi-result-body">
                    <div className="kpi-score-display">
                      <span className="kpi-score-value">{kpiResult.toFixed(2)}</span>
                      <span className="kpi-score-label">/ 100</span>
                    </div>
                    <div className="kpi-performance-bar">
                      <div 
                        className="kpi-performance-fill" 
                        style={{ width: `${Math.min(kpiResult, 100)}%` }}
                      ></div>
                    </div>
                    <div className="kpi-rating">
                      <span className="kpi-rating-label">Performance Rating:</span>
                      <span className={`kpi-rating-value ${
                        kpiResult >= 80 ? 'excellent' : 
                        kpiResult >= 60 ? 'good' : 
                        kpiResult >= 40 ? 'average' : 'needs-improvement'
                      }`}>
                        {kpiResult >= 80 ? '⭐ Excellent' : 
                         kpiResult >= 60 ? '✓ Good' : 
                         kpiResult >= 40 ? '◐ Average' : '⚠ Needs Improvement'}
                      </span>
                    </div>
                  </div>
                  <div className="kpi-result-footer">
                    <button 
                      className="kpi-recalculate-btn"
                      onClick={handleCalculateKPI}
                    >
                      Recalculate
                    </button>
                  </div>
                </div>
              </div>
            )}
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
