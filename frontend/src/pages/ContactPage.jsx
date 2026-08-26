import { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
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

const EMPTY_FORM = { name: '', email: '', message: '' };

function ContactForm() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [status, setStatus] = useState(null); // null | 'sending' | 'sent'

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setStatus('sending');


        setTimeout(() => {
            setStatus('sent');
            setForm(EMPTY_FORM);
        }, 600);
    }

    if (status === 'sent') {
        return (
            <div className="bg-blanc border border-brun-gris/15 rounded-xl p-8 text-center flex flex-col gap-2">
                <p className="font-heading text-h3 text-noir-chaud">Message envoyé !</p>
                <p className="font-body text-body text-brun-gris">
                    Merci de nous avoir écrit, on vous répond au plus vite.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-blanc border border-brun-gris/15 rounded-xl p-6 md:p-8 flex flex-col gap-4">
            <Input
                placeholder="Votre nom"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
            />
            <Input
                type="email"
                placeholder="Votre email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
            />
            <textarea
                placeholder="Votre message"
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="w-full px-5 py-3 rounded-lg font-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none focus:border-roux-principal placeholder:text-brun-gris"
                rows={5}
                required
            />
            <Button variant="primary" type="submit" disabled={status === 'sending'} className="w-full justify-center">
                {status === 'sending' ? 'Envoi...' : 'Envoyer'}
            </Button>
        </form>
    );
}

function ContactInfo() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="font-heading text-h2 text-noir-chaud mb-2">Une question ?</h2>
                <p className="font-body text-body text-brun-gris">
                    Écrivez-nous, on vous répond avec plaisir sous 24 à 48h.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-roux-clair flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-roux-fonce" strokeWidth={1.5} />
                </div>
                <a href="mailto:contact@mailleetcalins.fr" className="font-body text-body text-noir-chaud">
                    contact@mailleetcalins.fr
                </a>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-roux-clair flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-roux-fonce" strokeWidth={1.5} />
                </div>
                <p className="font-body text-body text-noir-chaud">Clermont-Ferrand, France</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-roux-clair flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-roux-fonce">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </a>
                <a href="#" aria-label="Pinterest" className="w-10 h-10 rounded-full bg-roux-clair flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-roux-fonce">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.995-.283 1.194.6 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.222-.174.269-.402.163-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.226 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.624 0 11.99-5.368 11.99-11.988C23.98 5.367 18.617 0 12.017 0" />
                    </svg>
                </a>
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-roux-clair flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-roux-fonce">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <div>
            <AnnounceBar />
            <Header />

            <section className="bg-rose-poudre px-4 md:px-16 py-14 md:py-20 text-center">
                <h1 className="font-heading text-h1 text-noir-chaud mb-3">Contact</h1>
                <p className="font-body text-body-lg text-brun-gris max-w-lg mx-auto">
                    Une question sur une création, une commande, ou une envie sur-mesure ? On est là.
                </p>
            </section>

            <section className="bg-creme px-4 md:px-16 py-14 md:py-20">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </section>

            <Footer />
        </div>
    );
}