import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setError('Lien de vérification invalide ou incomplet.');
            return;
        }

        if (hasVerified.current) return;
        hasVerified.current = true;

        async function verify() {
            try {
                await apiClient.get(`/verify-email?token=${token}`);
                setStatus('success');
                setTimeout(() => navigate('/login'), 3000);
            } catch (err) {
                setStatus('error');
                setError(err.response?.data?.errors || 'Ce lien de vérification est invalide ou a déjà été utilisé.');
            }
        }

        verify();
    }, [token, navigate]);

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="max-w-md mx-auto px-4 py-16 text-center flex flex-col gap-4">
                <h1 className="font-heading text-h1 text-noir-chaud">Vérification de votre email</h1>

                {status === 'loading' && (
                    <p className="font-body text-body text-brun-gris">Vérification en cours...</p>
                )}

                {status === 'success' && (
                    <p className="font-body text-body text-vert-sauge">
                        Votre compte a été vérifié avec succès. Redirection vers la connexion...
                    </p>
                )}

                {status === 'error' && (
                    <>
                        <p className="font-body text-body text-red-500">{JSON.stringify(error)}</p>
                        <Link to="/login" className="font-body text-body text-roux-principal">
                            Retour à la connexion
                        </Link>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}