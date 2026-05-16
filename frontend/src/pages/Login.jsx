import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Identifiants invalides. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card card animate-pop">
                <div className="login-header">
                    <span className="logo-icon">💊</span>
                    <h1>PharmaManager</h1>
                    <p>Connectez-vous pour accéder à l'interface</p>
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom d'utilisateur</label>
                        <input 
                            type="text" 
                            required 
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input 
                            type="password" 
                            required 
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-login" disabled={submitting}>
                        {submitting ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
