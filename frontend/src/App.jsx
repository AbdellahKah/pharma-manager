import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Medicaments from './pages/Medicaments';
import Ventes from './pages/Ventes';
import Login from './pages/Login';
import './App.css';

/**
 * Garde de route pour protéger les pages privées.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loader">Initialisation...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/medicaments" element={
            <ProtectedRoute>
              <Medicaments />
            </ProtectedRoute>
          } />
          
          <Route path="/ventes" element={
            <ProtectedRoute>
              <Ventes />
            </ProtectedRoute>
          } />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
