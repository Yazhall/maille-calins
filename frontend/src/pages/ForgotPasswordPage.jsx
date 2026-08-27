import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);
        try {
            const res = await apiClient.post('/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.errors || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="max-w-md mx-auto px-4 py-16 flex flex-col gap-6">
                <h1 className="font-heading text-h1 text-noir-chaud text-center">Mot de passe oublié</h1>
                <p className="font-body text-body text-brun-gris text-center">
                    Indiquez votre email, vous recevrez un lien pour réinitialiser votre mot de passe.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        placeholder="Votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
                    </Button>
                </form>

                {message && <p className="font-body text-body-sm text-vert-sauge text-center">{message}</p>}
                {error && <p className="font-body text-body-sm text-red-500 text-center">{JSON.stringify(error)}</p>}

                <Link to="/login" className="font-body text-body-sm text-roux-principal text-center">
                    Retour à la connexion
                </Link>
            </div>

            <Footer />
        </div>
    );
}