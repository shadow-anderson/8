import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../config/cloudinary.service';
import './FieldWorkerDashboard.css';

// ============================================================================
// MAIN COMPONENT: Field Worker Dashboard
// ============================================================================
export default function FieldWorkerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'productivity-strip', label: 'Productivity Strip', icon: '📊' },
    { id: 'dpr-workspace', label: 'DPR Workspace', icon: '📋' },
    { id: 'evidence-portal', label: 'Evidence Portal', icon: '📸' },
    { id: 'task-board', label: 'Task Board', icon: '📊' },
    { id: 'kpi-meter', label: 'KPI Meter', icon: '📈' },
    { id: 'project-timeline', label: 'Project Timeline', icon: '🗓️' },
    { id: 'comm-hub', label: 'Communication Hub', icon: '💬' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'ask-prabhav', label: 'AI Assistant', icon: '🤖' },
    { id: 'compliance-validator', label: 'Compliance', icon: '✅' },
    { id: 'worker-analytics', label: 'Analytics', icon: '📊' },
    { id: 'accountability-log', label: 'Accountability', icon: '📜' },
  ];

  // Offline data sync function
  async function syncOfflineData() {
    const drafts = JSON.parse(localStorage.getItem('offlineDrafts') || '[]');
    console.log('Syncing offline data:', drafts);
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'productivity-strip':
        return <ProductivityStrip />;
      case 'dpr-workspace':
        return <DPRWorkspace isOnline={isOnline} />;
      case 'evidence-portal':
        return <EvidencePortal isOnline={isOnline} />;
      case 'task-board':
        return <TaskBoard />;
      case 'kpi-meter':
        return <KPIMeter />;
      case 'project-timeline':
        return <ProjectTimeline />;
      case 'comm-hub':
        return <CommHub />;
      case 'notifications':
        return <Notifications />;
      case 'ask-prabhav':
        return <AskPrabhav />;
      case 'compliance-validator':
        return <ComplianceValidator />;
      case 'worker-analytics':
        return <WorkerAnalytics />;
      case 'accountability-log':
        return <AccountabilityLog />;
      default:
        return (
          <div className="dashboard-welcome">
            <h1>Welcome, {user?.username}!</h1>
            <p>Select a section from the left sidebar to get started.</p>
            {!isOnline && (
              <div className="offline-banner">
                ⚠️ You are offline — data will sync automatically when connection returns
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar with Logout */}
      <div className="dashboard-topbar">
        <span className="topbar-user">Welcome, {user?.username}</span>
        <button onClick={handleLogout} className="topbar-logout-btn">
          Logout
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar 
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      {/* Main Content */}
      <main className="dashboard-content">
        {renderContent()}
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================
function Sidebar({ navItems, activeSection, setActiveSection, sidebarOpen, setSidebarOpen, user }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Field Worker</h2>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
      </div>

      <div className="user-info">
        <p className="user-name">Welcome {user?.username}</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => {
              setActiveSection(item.id);
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ============================================================================
// 1. AT-A-GLANCE PRODUCTIVITY STRIP
// ============================================================================
function ProductivityStrip() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    const mockData = {
      dueToday: 5,
      overdue: 2,
      weekProgress: 78,
      alerts: [
        'DPR rejected for Task #123',
        'Missing evidence for milestone M5',
        'Deadline approaching: Survey Zone A (2 days)',
      ],
    };
    setSummary(mockData);
  }

  if (!summary) return <div className="content-section">Loading summary...</div>;

  return (
    <section className="content-section productivity-strip cream-bg">
      <h2>📊 Productivity Strip</h2>
      <div className="strip-container cream-strip">
        <div className="strip-item">
          <span className="strip-label">Due Today</span>
          <span className="strip-value">{summary.dueToday}</span>
        </div>
        <div className="strip-item">
          <span className="strip-label">Overdue</span>
          <span className="strip-value alert">{summary.overdue}</span>
        </div>
        <div className="strip-item">
          <span className="strip-label">Week Progress</span>
          <span className="strip-value">{summary.weekProgress}%</span>
        </div>
        <div className="strip-item alerts">
          <span className="strip-label">Alerts</span>
          <ul className="alert-list">
            {summary.alerts.map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 2. DPR UPLOAD WORKSPACE
// ============================================================================
function DPRWorkspace({ isOnline }) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [versions, setVersions] = useState([]);
  const [status, setStatus] = useState('Draft');
  const [comments, setComments] = useState([]);
  const [autoScore, setAutoScore] = useState(null);

  useEffect(() => {
    fetchDPRStatus();
    fetchDPRComments();
  }, []);

  async function uploadDPR(fileList) {
    console.log('Uploading DPR files to Cloudinary:', fileList);
    
    if (!isOnline) {
      // Store in localStorage for offline mode
      const drafts = JSON.parse(localStorage.getItem('offlineDrafts') || '[]');
      drafts.push({ type: 'DPR', files: Array.from(fileList).map(f => f.name), timestamp: new Date() });
      localStorage.setItem('offlineDrafts', JSON.stringify(drafts));
      alert('Stored offline. Will sync when online.');
      return;
    }

    try {
      // Upload files to Cloudinary
      setStatus('Uploading...');
      const uploadResults = await uploadMultipleToCloudinary(
        fileList,
        'dpr',
        {
          tags: ['dpr', 'field-worker', user?.username],
          context: {
            alt: 'DPR Document',
            uploadedBy: user?.username,
            uploadDate: new Date().toISOString(),
          },
        }
      );

      // Check if all uploads were successful
      const successfulUploads = uploadResults.filter(result => result.success);
      const failedUploads = uploadResults.filter(result => !result.success);

      if (failedUploads.length > 0) {
        console.error('Some uploads failed:', failedUploads);
        alert(`${failedUploads.length} file(s) failed to upload. Please try again.`);
      }

      if (successfulUploads.length > 0) {
        // Create new version with Cloudinary URLs
        const newVersion = {
          id: versions.length + 1,
          name: `V${versions.length + 1}`,
          date: new Date().toLocaleString(),
          files: successfulUploads.map(result => ({
            name: result.originalFilename,
            url: result.url,
            publicId: result.publicId,
            size: result.size,
          })),
        };
        setVersions([...versions, newVersion]);
        setStatus('Submitted');
        setAutoScore({ timeliness: 85, quality: 90 });
        
        // Log URLs for easy access
        console.log('Upload successful! Public URLs:');
        successfulUploads.forEach((result, idx) => {
          console.log(`${idx + 1}. ${result.originalFilename}`);
          console.log(`   URL: ${result.url}`);
          console.log(`   Public ID: ${result.publicId}`);
        });
        
        alert(`Successfully uploaded ${successfulUploads.length} file(s) to Cloudinary!\nCheck console for public URLs.`);
      }
    } catch (error) {
      console.error('DPR upload error:', error);
      alert('Upload failed. Please try again.');
      setStatus('Draft');
    }
  }

  async function fetchDPRStatus() {
    // TODO: API call
    const mockStatus = 'Under Review';
    setStatus(mockStatus);
  }

  async function fetchDPRComments() {
    // TODO: API call
    const mockComments = [
      { id: 1, author: 'Manager A', text: 'Please add more details on section 3', timestamp: '2 hours ago' },
      { id: 2, author: 'HQ Reviewer', text: 'Approved with minor notes', timestamp: '1 day ago' },
    ];
    setComments(mockComments);
  }

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  }

  function handleUpload() {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }
    uploadDPR(files);
  }

  return (
    <section className="content-section dpr-workspace">
      <h2>📋 DPR Upload Workspace</h2>
      <div className="dpr-upload-area dpr-upload-area-enhanced">
        <div className="dpr-upload-header">
          <p><strong>Upload your Daily Progress Reports (DPR) here. Supported formats: PDF, Excel, PPT, Images, Videos.</strong></p>
        </div>
        <input
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mov"
          onChange={handleFileChange}
          className="file-input"
        />
        {files.length > 0 && (
          <div className="selected-files">
            <strong>Selected files:</strong>
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={handleUpload} className="upload-btn dpr-upload-btn">
          Upload DPR
        </button>
      </div>
      <div className="dpr-status">
        <h3>Status: <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>{status}</span></h3>
      </div>
      {autoScore && (
        <div className="auto-score">
          <h3>Auto-Score Preview</h3>
          <div className="auto-score-grid">
            <div>
              <span className="auto-score-label">Timeliness</span>
              <span className="auto-score-value">{autoScore.timeliness}/100</span>
            </div>
            <div>
              <span className="auto-score-label">Quality</span>
              <span className="auto-score-value">{autoScore.quality}/100</span>
            </div>
          </div>
        </div>
      )}
      <div className="dpr-versions">
        <h3>Version History</h3>
        {versions.length === 0 ? (
          <p>No versions yet</p>
        ) : (
          <div className="dpr-versions-list">
            {versions.map((v) => (
              <div key={v.id} className="version-item version-item-spacious">
                <h4>{v.name} <span className="version-date">{v.date}</span></h4>
                {v.files && v.files.length > 0 && (
                  <div className="version-files">
                    <p><strong>Files ({v.files.length}):</strong></p>
                    <ul>
                      {v.files.map((file, idx) => (
                        <li key={idx} className="file-item">
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                          </div>
                          <div className="file-actions">
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="file-link"
                            >
                              View
                            </a>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(file.url);
                                alert('URL copied to clipboard!');
                              }}
                              className="copy-url-btn"
                            >
                              Copy URL
                            </button>
                          </div>
                          <div className="file-url">
                            <small>{file.url}</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="dpr-comments">
        <h3>Reviewer Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          <ul className="comment-thread">
            {comments.map((c) => (
              <li key={c.id} className="comment">
                <strong>{c.author}</strong> ({c.timestamp})
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// 3. EVIDENCE CAPTURE PORTAL
// ============================================================================
function EvidencePortal({ isOnline }) {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState([]);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'timeline'

  useEffect(() => {
    fetchEvidence();
  }, []);

  async function uploadEvidence(file, metadata) {
    console.log('Uploading evidence to Cloudinary:', file, metadata);

    if (!isOnline) {
      const drafts = JSON.parse(localStorage.getItem('offlineDrafts') || '[]');
      drafts.push({ type: 'Evidence', file: file.name, metadata, timestamp: new Date() });
      localStorage.setItem('offlineDrafts', JSON.stringify(drafts));
      alert('Evidence stored offline. Will sync when online.');
      return;
    }

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(
        file,
        'evidence',
        {
          tags: ['evidence', 'field-worker', metadata.taskId],
          context: {
            alt: 'Field Evidence',
            uploadedBy: user?.username,
            gps: metadata.gps,
            device: metadata.device,
            taskId: metadata.taskId,
          },
        }
      );

      if (uploadResult.success) {
        // Add evidence with Cloudinary URL
        const newEvidence = {
          id: evidence.length + 1,
          name: file.name,
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          ...metadata,
          aiFlag: Math.random() > 0.8, // Random AI flag (implement actual AI check)
        };
        setEvidence([...evidence, newEvidence]);
        
        // Log URL for easy access
        console.log('Evidence uploaded successfully!');
        console.log(`File: ${file.name}`);
        console.log(`Public URL: ${uploadResult.url}`);
        console.log(`Public ID: ${uploadResult.publicId}`);
        
        alert('Evidence uploaded successfully to Cloudinary!\nCheck console for public URL.');
      } else {
        throw new Error(uploadResult.error);
      }
    } catch (error) {
      console.error('Evidence upload error:', error);
      alert(`Upload failed: ${error.message}`);
    }
  }

  async function fetchEvidence() {
    // TODO: API call
  }

  function handleEvidenceUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Collect metadata
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const metadata = {
          date: new Date().toLocaleString(),
          gps: `${position.coords.latitude}, ${position.coords.longitude}`,
          device: navigator.userAgent,
          taskId: 'T-LINKED', // Would come from dropdown
        };
        uploadEvidence(file, metadata);
      },
      (error) => {
        console.error('GPS error:', error);
        const metadata = {
          date: new Date().toLocaleString(),
          gps: 'unavailable',
          device: navigator.userAgent,
          taskId: 'T-LINKED',
        };
        uploadEvidence(file, metadata);
      }
    );
  }

  return (
    <section className="content-section evidence-portal">
      <h2>📸 Evidence Capture Portal</h2>

      <div className="evidence-upload">
        <input
          type="file"
          accept="image/*,video/*,.pdf"
          onChange={handleEvidenceUpload}
          className="file-input"
        />
        <p className="upload-hint">Upload photos, videos, or documents. GPS & metadata auto-collected.</p>
      </div>

      <div className="view-toggle">
        <button
          className={viewMode === 'gallery' ? 'active' : ''}
          onClick={() => setViewMode('gallery')}
        >
          Gallery
        </button>
        <button
          className={viewMode === 'timeline' ? 'active' : ''}
          onClick={() => setViewMode('timeline')}
        >
          Timeline
        </button>
      </div>

      <div className={`evidence-list ${viewMode}`}>
        {evidence.length === 0 ? (
          <p>No evidence uploaded yet</p>
        ) : (
          evidence.map((item) => (
            <div key={item.id} className="evidence-item">
              <strong>{item.name}</strong>
              {item.aiFlag && <span className="ai-flag">AI Flagged</span>}
              <p>Date: {item.date}</p>
              <p>GPS: {item.gps}</p>
              <p>Device: {item.device}</p>
              <p>Linked to: {item.taskId}</p>
              {item.url && (
                <div className="evidence-url-section">
                  <div className="evidence-actions">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="evidence-link"
                    >
                      View File
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        alert('URL copied to clipboard!');
                      }}
                      className="copy-url-btn"
                    >
                      Copy URL
                    </button>
                  </div>
                  <div className="evidence-url">
                    <small>{item.url}</small>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ============================================================================
// 4. TASK BOARD (Kanban + KPI Brain)
// ============================================================================
function TaskBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    // TODO: API call
    const mockTasks = [
      {
        id: 'T-101',
        title: 'Survey Zone A',
        duration: '3 days',
        deadline: '2025-12-10',
        progress: 0,
        status: 'pending',
        priority: 'high',
        dependencies: [],
      },
      {
        id: 'T-102',
        title: 'Soil Testing Site B',
        duration: '5 days',
        deadline: '2025-12-12',
        progress: 60,
        status: 'in-progress',
        priority: 'medium',
        dependencies: ['T-101'],
      },
      {
        id: 'T-103',
        title: 'DPR Submission Phase 1',
        duration: '2 days',
        deadline: '2025-12-09',
        progress: 100,
        status: 'completed',
        priority: 'low',
        dependencies: [],
      },
      {
        id: 'T-100',
        title: 'Initial Assessment',
        duration: '2 days',
        deadline: '2025-12-05',
        progress: 100,
        status: 'completed',
        priority: 'low',
        dependencies: [],
      },
    ];
    setTasks(mockTasks);
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'pending':
        return <span className="hq-status-badge hq-badge-pending">Pending</span>;
      case 'in-progress':
        return <span className="hq-status-badge hq-badge-progress">In Progress</span>;
      case 'completed':
        return <span className="hq-status-badge hq-badge-completed">Completed</span>;
      case 'under-review':
        return <span className="hq-status-badge hq-badge-review">Under Review</span>;
      case 'overdue':
        return <span className="hq-status-badge hq-badge-overdue">Overdue</span>;
      default:
        return <span className="hq-status-badge">{status}</span>;
    }
  }

  function getPriorityBadge(priority) {
    switch (priority) {
      case 'high':
        return <span className="hq-priority-badge hq-priority-high">High</span>;
      case 'medium':
        return <span className="hq-priority-badge hq-priority-medium">Medium</span>;
      case 'low':
        return <span className="hq-priority-badge hq-priority-low">Low</span>;
      case 'critical':
        return <span className="hq-priority-badge hq-priority-critical">Critical</span>;
      default:
        return <span className="hq-priority-badge">{priority}</span>;
    }
  }

  function handleProgress(id, progress) {
    // TODO: API call
    setTasks(tasks =>
      tasks.map(task =>
        task.id === id
          ? { ...task, progress: Math.min(progress, 100), status: progress === 100 ? 'completed' : task.status }
          : task
      )
    );
  }

  function handleBlocker(id, reason) {
    // TODO: API call
    alert(`Task ${id} marked as blocked: ${reason}`);
  }

  return (
    <section className="content-section task-board">
      <h2>📊 Task Board</h2>
      <div className="hq-table-wrapper">
        <table className="hq-task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>ID</th>
              <th>Duration</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Dependencies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="hq-task-title">{task.title}</td>
                <td>{task.id}</td>
                <td>{task.duration}</td>
                <td>{task.deadline}</td>
                <td>{getPriorityBadge(task.priority)}</td>
                <td>
                  <div className="hq-progress-bar">
                    <div
                      className="hq-progress-fill"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                    <span className="hq-progress-text">{task.progress}%</span>
                  </div>
                </td>
                <td>{getStatusBadge(task.status)}</td>
                <td>
                  {task.dependencies.length > 0 ? task.dependencies.join(', ') : '—'}
                </td>
                <td>
                  <button
                    className="hq-filter-btn"
                    onClick={() => handleProgress(task.id, task.progress + 10)}
                  >
                    Update Progress
                  </button>
                  <button
                    className="hq-filter-btn"
                    onClick={() => handleBlocker(task.id, 'Weather delay')}
                  >
                    Mark Blocker
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================================
// 5. PERSONAL KPI METER
// ============================================================================
function KPIMeter() {
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    fetchKPI();
  }, []);

  async function fetchKPI() {
    // TODO: API call
    
  }

  if (!kpi) return <div className="kpi-meter">Loading KPI...</div>;

  return (
    <section className="content-section kpi-meter">
      <h2>📈 Personal KPI Meter</h2>
      <div className="kpi-score">
        <div className="score-circle">
          <span className="score">KPI Score: {kpi.score}</span>
          <span className="score-label">/100</span>
        </div>
      </div>

      <div className="kpi-breakdown">
        <div className="kpi-item">
          <span>Timeliness:</span>
          <span>{kpi.timeliness}</span>
        </div>
        <div className="kpi-item">
          <span>Quality:</span>
          <span>{kpi.quality}</span>
        </div>
        <div className="kpi-item">
          <span>Accuracy:</span>
          <span>{kpi.accuracy}</span>
        </div>
        <div className="kpi-item">
          <span>Compliance:</span>
          <span>{kpi.compliance}</span>
        </div>
      </div>

      <div className="kpi-chart">
        <h3>Monthly Progress</h3>
        <h1 style={{margin:'auto', textAlign:'center'}}>
          <span className="score">KPI Score: {kpi.score}/100</span>
        </h1>
        <svg width="100%" height="150" viewBox="0 0 500 150">
          {kpi.monthlyScores.map((score, idx) => (
            <circle
              key={idx}
              cx={50 + idx * 100}
              cy={150 - score}
              r="5"
              fill="#4CAF50"
            />
          ))}
          <polyline
            points={kpi.monthlyScores.map((score, idx) => `${50 + idx * 100},${150 - score}`).join(' ')}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="kpi-comparison">
        <p>Your Score: <strong>{kpi.score}</strong></p>
        <p>Team Average: <strong>{kpi.teamAverage}</strong></p>
      </div>

      <div className="kpi-insights">
        <h3>Insights</h3>
        <p>{kpi.insights}</p>
      </div>
    </section>
  );
}

// ============================================================================
// 6. PROJECT TIMELINE + GANTT INTEGRATION
// ============================================================================
function ProjectTimeline() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    // TODO: API call
    const mockProjects = [
      {
        id: 'P-001',
        name: 'Highway Expansion Project',
        milestones: [
          { name: 'Survey Complete', date: '2025-12-05', status: 'completed' },
          { name: 'Soil Analysis', date: '2025-12-12', status: 'in-progress' },
          { name: 'Foundation Work', date: '2025-12-20', status: 'pending' },
        ],
        assignedTasks: ['T-101', 'T-102'],
        delayFlag: false,
      },
      {
        id: 'P-002',
        name: 'Bridge Construction',
        milestones: [
          { name: 'Site Preparation', date: '2025-11-30', status: 'completed' },
          { name: 'Pillar Installation', date: '2025-12-15', status: 'delayed' },
        ],
        assignedTasks: ['T-103'],
        delayFlag: true,
      },
    ];
    setProjects(mockProjects);
  }

  return (
    <section className="content-section project-timeline">
      <h2>🗓️ Project Timeline</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-item project-item-spacious">
            <h3>
              {project.name} {project.delayFlag && <span className="delay-flag">🚨 Delayed</span>}
            </h3>
            <div className="project-details">
              <p><strong>Project ID:</strong> {project.id}</p>
              <p><strong>Your Tasks:</strong> {project.assignedTasks.join(', ')}</p>
            </div>
            <div className="milestones">
              <h4>Milestones</h4>
              <ul className="milestone-list">
                {project.milestones.map((milestone, idx) => (
                  <li key={idx} className={`milestone milestone-spacious ${milestone.status}`}>
                    <span className="milestone-name">{milestone.name}</span>
                    <span className="milestone-date">{milestone.date}</span>
                    <span className={`milestone-status status-${milestone.status}`}>
                      {milestone.status.replace('-', ' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 7. COMMUNICATION & CLARIFICATION HUB
// ============================================================================
function CommHub() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    // TODO: API call
    const mockMessages = [
      { id: 1, sender: 'Manager A', text: 'Please clarify the survey coordinates for Zone B', timestamp: '10:30 AM' },
      { id: 2, sender: 'You', text: 'Coordinates are 28.6139, 77.2090', timestamp: '10:45 AM' },
      { id: 3, sender: 'HQ Support', text: 'AI suggestion: Attach geo-tagged photo', timestamp: '11:00 AM', isAI: true },
    ];
    setMessages(mockMessages);
  }

  async function sendMessage() {
    // TODO: API call
    if (!newMessage.trim()) return;
    
  }

  return (
    <section className="content-section comm-hub">
      <h2>💬 Communication & Clarification Hub</h2>
      <div className="message-thread">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === 'You' ? 'own' : 'other'} ${msg.isAI ? 'ai' : ''}`}>
            <strong>{msg.sender}</strong> <span className="timestamp">{msg.timestamp}</span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
// ============================================================================
// 8. NOTIFICATIONS CENTER
// ============================================================================
function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    // TODO: API call
    
  }

  return (
    <section className="content-section notifications-center">
      <h2>🔔 Notifications</h2>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`notification ${notif.type}`}>
              <span className="notif-text">{notif.text}</span>
              <span className="notif-time">{notif.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// ============================================================================
// 9. AI ASSISTANT ("Ask Prabhav")
// ============================================================================
function AskPrabhav() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function queryPrabhav(userPrompt) {
    // TODO: API call
    setIsLoading(true);
    console.log('Querying Prabhav AI:', userPrompt);
    
    // Mock response
    setTimeout(() => {
      let mockResponse = '';
      if (userPrompt.toLowerCase().includes('draft dpr')) {
        mockResponse = 'Generated DPR Draft:\n\n1. Introduction\n2. Survey Details\n3. Findings\n4. Recommendations';
      } else if (userPrompt.toLowerCase().includes('summarize tasks')) {
        mockResponse = 'You have 5 tasks due today, 2 overdue. Focus on T-102 (60% complete, deadline in 2 days).';
      } else if (userPrompt.toLowerCase().includes('weak kpi')) {
        mockResponse = 'Your compliance score (84) is below target. Consider reviewing submission guidelines.';
      } else {
        mockResponse = 'I can help with:\n- Generate draft DPR\n- Summarize tasks\n- Identify weak KPIs\n- Provide compliance tips';
      }
      setResponse(mockResponse);
      setIsLoading(false);
    }, 1500);
  }

  function handleAsk() {
    if (!prompt.trim()) return;
    queryPrabhav(prompt);
  }

  return (
    <section className="content-section ask-prabhav">
      <h2>🤖 Ask Prabhav (AI Assistant)</h2>
      <div className="ai-interface">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything: 'Generate draft DPR', 'Summarize my tasks'..."
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button onClick={handleAsk} disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
      {response && (
        <div className="ai-response">
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// 10. COMPLIANCE VALIDATOR
// ============================================================================
function ComplianceValidator() {
  const [validationResults, setValidationResults] = useState(null);

  function validateDPR() {
    // Mock validation logic
    const issues = [];
    
    // Simulated checks
    if (Math.random() > 0.7) issues.push('Missing page 3 - Survey details');
    if (Math.random() > 0.8) issues.push('Incorrect file naming convention');
    if (Math.random() > 0.6) issues.push('Date mismatch: Document date vs submission date');
    if (Math.random() > 0.9) issues.push('Survey coordinates inconsistent with GPS metadata');

    setValidationResults({
      passed: issues.length === 0,
      issues: issues,
      suggestions: issues.length > 0 ? ['Review document completeness', 'Check naming: DPR_YYYY-MM-DD_ProjectID.pdf', 'Verify all dates match'] : [],
    });
  }

  return (
    <section className="content-section compliance-validator">
      <h2>✅ Compliance Validator</h2>
      <button onClick={validateDPR} className="validate-btn">
        Run Compliance Check
      </button>

      {validationResults && (
        <div className={`validation-results ${validationResults.passed ? 'pass' : 'fail'}`}>
          <h3>{validationResults.passed ? '✓ All checks passed!' : '⚠️ Issues found:'}</h3>
          {!validationResults.passed && (
            <>
              <ul className="issue-list">
                {validationResults.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
              <h4>Suggestions:</h4>
              <ul className="suggestion-list">
                {validationResults.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}

// ============================================================================
// 11. WORKER ANALYTICS DASHBOARD
// ============================================================================
function WorkerAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    // TODO: API call
    const mockAnalytics = {
      weeklyProgress: [65, 70, 75, 80, 85, 87, 90],
      dprRejectionRate: 12,
      avgSubmissionDelay: 1.5,
      delayCauses: {
        weather: 40,
        mismatch: 25,
        dependencies: 20,
        other: 15,
      },
    };
    setAnalytics(mockAnalytics);
  }

  if (!analytics) return <div className="worker-analytics">Loading analytics...</div>;

  return (
    <section className="content-section worker-analytics">
      <h2>📊 Worker Analytics Dashboard</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Weekly Progress</h3>
          <svg width="100%" height="150" viewBox="0 0 350 150">
            {analytics.weeklyProgress.map((value, idx) => (
              <rect
                key={idx}
                x={10 + idx * 50}
                y={150 - value}
                width="40"
                height={value}
                fill="#4CAF50"
              />
            ))}
          </svg>
        </div>

        <div className="analytics-card">
          <h3>DPR Rejection Rate</h3>
          <div className="stat-value">{analytics.dprRejectionRate}%</div>
        </div>

        <div className="analytics-card">
          <h3>Avg Submission Delay</h3>
          <div className="stat-value">{analytics.avgSubmissionDelay} days</div>
        </div>

        <div className="analytics-card">
          <h3>Delay Causes Breakdown</h3>
          <ul className="cause-list">
            <li>Weather: {analytics.delayCauses.weather}%</li>
            <li>Mismatch: {analytics.delayCauses.mismatch}%</li>
            <li>Dependencies: {analytics.delayCauses.dependencies}%</li>
            <li>Other: {analytics.delayCauses.other}%</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 12. ACCOUNTABILITY LOG
// ============================================================================
function AccountabilityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLog();
  }, []);

  async function fetchLog() {
    // TODO: API call
    
  }

  return (
    <section className="content-section accountability-log">
      <h2>📜 Accountability Log</h2>
      <table className="log-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>When</th>
            <th>By Whom</th>
            <th>From Where (IP/GPS)</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.action}</td>
              <td>{log.timestamp}</td>
              <td>{log.user}</td>
              <td>{log.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
