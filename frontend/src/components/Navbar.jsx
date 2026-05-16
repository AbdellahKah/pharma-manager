import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Composant de navigation principal.
 */
const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="logo-icon">💊</span>
                    <span className="logo-text">PharmaManager</span>
                </div>
                <ul className="navbar-menu">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/medicaments" className={({ isActive }) => isActive ? 'active' : ''}>
                            Médicaments
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/ventes" className={({ isActive }) => isActive ? 'active' : ''}>
                            Ventes
                        </NavLink>
                    </li>
                    <li>
                        <button className="btn-logout" onClick={handleLogout}>
                            Déconnexion
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
