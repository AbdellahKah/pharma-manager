import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Dans un vrai projet, on pourrait appeler /api/me ici
            setUser({ authenticated: true });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Construction robuste de l'URL du token (on remplace /api/v1 par /api/token)
            const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
            const baseUrl = rawUrl.replace(/\/v1\/?$/, '');
            const response = await axios.post(`${baseUrl}/token/`, {
                username,
                password
            });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            setUser({ authenticated: true });
            return response.data;
        } catch (error) {
            console.error("Erreur de connexion détaillée:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
