import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (check localStorage or make API call)
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Optionally verify token with backend
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (err) {
                console.error('Failed to set auth token:', err);
            }
        }
        setLoading(false);
    }, []);

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('auth_token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            setLoading(false);
            return { user, error: null };
        } catch (err) {
            const error = err.response?.data?.message || 'Login failed';
            setLoading(false);
            return { user: null, error };
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            localStorage.removeItem('auth_token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
            return { error: null };
        } catch (err) {
            setLoading(false);
            return { error: err.message };
        }
    };

    return { user, loading, signIn, signOut };
};

export default useAuth;