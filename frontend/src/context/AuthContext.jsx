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
        const response = await axios.post(`${import.meta.env.VITE_API_URL.replace('/v1', '')}/token/`, {
            username,
            password
        });
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setUser({ authenticated: true });
        return response.data;
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
