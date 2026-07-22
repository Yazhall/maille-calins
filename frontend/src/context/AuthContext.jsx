import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token')); // on met direct le token dans localStorage pour garder l'utilisateur connecté meme s'il fait F5

    function loginUser(newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    function logoutUser() {
        localStorage.removeItem('token');
        setToken(null);
    }

    const value = {
        token,
        isAuthenticated: !!token,
        loginUser,
        logoutUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {   // pour ne pas avoir à écrire useContext(AuthContext) à chaque fois dans chaque composant.
    return useContext(AuthContext);
}