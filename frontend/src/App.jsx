import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import FieldWorkerDashboard from './pages/FieldWorkerDashboard';
import HQWorkerDashboard from './pages/HQWorkerDashboard';
import AskPrabhav from './components/AskPrabhav';
import './App.css';

function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/managerDashboard"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/fieldWorkerDashboard"
            element={
              <ProtectedRoute>
                <FieldWorkerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hqWorkerDashboard"
            element={
              <ProtectedRoute>
                <HQWorkerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>

    <AskPrabhav />
    </>
  );
}

export default App;
