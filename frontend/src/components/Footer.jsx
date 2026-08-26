import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Button from './Button.jsx';

const BOUTIQUE_LINKS = [
    { label: 'Toutes les créations', to: '/boutique' },
    { label: 'Sur commande', to: '/sur-commande' },
    { label: 'Cartes cadeaux', to: '/cartes-cadeaux' },
    { label: 'Animaux', to: '/boutique?categorie=animaux' },
    { label: 'Créatures', to: '/boutique?categorie=creatures' },
    { label: 'Mini-amis', to: '/boutique?categorie=mini-amis' },
];

const AIDE_LINKS = [
    { label: 'FAQ', to: '/faq' },
    { label: 'Livraison', to: '/livraison' },
    { label: 'Entretien', to: '/entretien' },
    { label: 'Retours', to: '/retours' },
    { label: 'Contact', to: '/contact' },
];

function AccordionSection({ title, links, isOpen, onToggle }) {
    return (
        <div className="border-b border-noir-chaud/10">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 font-body text-body font-medium text-roux-fonce"
            >
                {title}
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <ul className="flex flex-col gap-3 pb-4">
                    {links.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} className="font-body text-body text-noir-chaud">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function SocialIcons() {
    return (
        <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-noir-chaud">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            </a>
            <a href="#" aria-label="Pinterest">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-noir-chaud">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.995-.283 1.194.6 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.222-.174.269-.402.163-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.226 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.624 0 11.99-5.368 11.99-11.988C23.98 5.367 18.617 0 12.017 0" />
                </svg>
            </a>
            <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-noir-chaud">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12" />
                </svg>
            </a>
        </div>
    );
}

function NewsletterForm() {
    return (
        <div className="flex flex-col gap-3">
            <input
                type="email"
                placeholder="Ton email"
                className="w-full px-5 py-3 rounded-lg font-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none"
            />
            <Button variant="primary" className="w-full">
                S&apos;abonner
            </Button>
            <p className="font-body text-caption text-brun-gris">
                En vous abonnant, vous acceptez notre politique de confidentialité.
            </p>
        </div>
    );
}

export default function Footer() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection((current) => (current === section ? null : section));
    };

    return (
        <footer>
            {/* ===== FOOTER MOBILE ===== */}
            <div className="md:hidden bg-roux-clair px-4 py-8 flex flex-col gap-6">
                <div>
                    <p className="font-heading text-h3 text-noir-chaud mb-2">Maille &amp; Câlins</p>
                    <p className="font-body text-body text-brun-gris">
                        Peluches au crochet faites main avec amour à Clermont-Ferrand
                    </p>
                </div>

                <SocialIcons />

                <div>
                    <AccordionSection
                        title="BOUTIQUE"
                        links={BOUTIQUE_LINKS}
                        isOpen={openSection === 'boutique'}
                        onToggle={() => toggleSection('boutique')}
                    />
                    <AccordionSection
                        title="AIDE"
                        links={AIDE_LINKS}
                        isOpen={openSection === 'aide'}
                        onToggle={() => toggleSection('aide')}
                    />
                </div>

                <div>
                    <p className="font-body text-label font-medium text-roux-fonce mb-2">NEWSLETTER</p>
                    <p className="font-body text-body text-noir-chaud mb-3">
                        Reçois nos nouveautés et coups de cœur en avant-première.
                    </p>
                    <NewsletterForm />
                </div>
            </div>

            {/* ===== FOOTER DESKTOP ===== */}
            <div className="hidden md:flex bg-roux-clair px-16 py-14 justify-between gap-10">
                <div className="flex flex-col gap-4 max-w-xs">
                    <p className="font-heading text-h2 text-noir-chaud">Maille &amp; Câlins</p>
                    <p className="font-body text-body text-brun-gris">
                        Peluches au crochet faites main avec amour à Clermont-Ferrand
                    </p>
                    <SocialIcons />
                </div>

                <div className="flex flex-col gap-3">
                    <p className="font-body text-label font-medium text-roux-principal">BOUTIQUE</p>
                    {BOUTIQUE_LINKS.map((link) => (
                        <Link key={link.to} to={link.to} className="font-body text-body text-noir-chaud">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <p className="font-body text-label font-medium text-roux-principal">AIDE</p>
                    {AIDE_LINKS.map((link) => (
                        <Link key={link.to} to={link.to} className="font-body text-body text-noir-chaud">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3 max-w-xs">
                    <p className="font-body text-label font-medium text-roux-principal">NEWSLETTER</p>
                    <p className="font-body text-body text-noir-chaud">
                        Reçois nos nouveautés et coups de cœur en avant-première.
                    </p>
                    <NewsletterForm />
                </div>
            </div>

            {/* ===== BANDEAU LÉGAL ===== */}
            <div className="bg-noir-chaud px-4 md:px-16 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="font-body text-body-sm text-blanc/80">© 2026 Maille &amp; Câlins</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <Link to="/mentions-legales" className="font-body text-body-sm text-blanc font-medium">
                        Mentions légales
                    </Link>
                    <Link to="/cgv" className="font-body text-body-sm text-blanc font-medium">
                        CGV
                    </Link>
                    <Link to="/confidentialite" className="font-body text-body-sm text-blanc font-medium">
                        Confidentialité
                    </Link>
                    <Link to="/cookies" className="font-body text-body-sm text-blanc font-medium">
                        Cookies
                    </Link>
                </div>
            </div>
        </footer>
    );
}