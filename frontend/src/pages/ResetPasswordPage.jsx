import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.post('/reset-password', { token, newPassword });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.errors || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!token) {
        return (
            <div>
                <AnnounceBar />
                <Header />
                <div className="max-w-md mx-auto px-4 py-16 text-center">
                    <p className="font-body text-body text-red-500 mb-4">
                        Lien de réinitialisation invalide ou incomplet.
                    </p>
                    <Link to="/forgot-password" className="font-body text-body text-roux-principal">
                        Demander un nouveau lien
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="max-w-md mx-auto px-4 py-16 flex flex-col gap-6">
                <h1 className="font-heading text-h1 text-noir-chaud text-center">Nouveau mot de passe</h1>

                {success ? (
                    <p className="font-body text-body text-vert-sauge text-center">
                        Votre mot de passe a été réinitialisé avec succès. Redirection vers la connexion...
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                        </Button>
                        {error && <p className="font-body text-body-sm text-red-500">{JSON.stringify(error)}</p>}
                    </form>
                )}
            </div>

            <Footer />
        </div>
    );
}