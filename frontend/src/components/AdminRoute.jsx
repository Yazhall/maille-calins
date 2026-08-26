import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient from '../api/client.js';

export default function AdminRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        async function checkRole() {
            try {
                const res = await apiClient.get('/me');
                setIsAdmin(res.data.roles?.includes('ROLE_ADMIN') || false);
            } catch (err) {
                setIsAdmin(false);
            }
        }
        checkRole();
    }, []);

    if (isAdmin === null) {
        return (
            <p className="text-center py-20 font-body text-body text-brun-gris">Vérification...</p>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}