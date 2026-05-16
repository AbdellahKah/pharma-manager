import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Medicaments from './pages/Medicaments';
import Ventes from './pages/Ventes';
import './App.css';

/**
 * Composant racine de l'application.
 * Gère le routage et le layout global.
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicaments" element={<Medicaments />} />
            <Route path="/ventes" element={<Ventes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
