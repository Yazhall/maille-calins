import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

function decodeRoles(token) {
    if (!token) return [];
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.roles || [];
    } catch (error) {
        return [];
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [roles, setRoles] = useState(decodeRoles(localStorage.getItem('token')));

    function loginUser(newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setRoles(decodeRoles(newToken));
    }

    function logoutUser() {
        localStorage.removeItem('token');
        setToken(null);
        setRoles([]);
    }

    const value = {
        token,
        isAuthenticated: !!token,
        isAdmin: roles.includes('ROLE_ADMIN'),
        loginUser,
        logoutUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}