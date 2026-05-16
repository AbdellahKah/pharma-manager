import { NavLink } from 'react-router-dom';
import './Navbar.css';

/**
 * Composant de navigation principal.
 */
const Navbar = () => {
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
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
