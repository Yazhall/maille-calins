import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
    { label: 'Boutique', to: '/boutique' },
    { label: 'Sur Commande', to: '/sur-commande' },
    { label: 'À propos', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { itemCount } = useCart();
    const { isAuthenticated, isAdmin } = useAuth();

    const accountLink = isAdmin ? '/admin' : isAuthenticated ? '/account' : '/login';

    return (
        <>
            {/* ===== HEADER MOBILE ===== */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-creme border-b border-[#E8DDD0]">
                <button onClick={() => setIsMenuOpen(true)} aria-label="Ouvrir le menu">
                    <Menu className="w-6 h-6 text-noir-chaud" />
                </button>

                <Link to="/" className="font-heading text-h3 text-noir-chaud">
                    Maille &amp; Câlins
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/search" aria-label="Rechercher">
                        <Search className="w-5 h-5 text-noir-chaud" />
                    </Link>
                    <Link to="/cart" className="relative" aria-label="Panier">
                        <ShoppingBag className="w-5 h-5 text-noir-chaud" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-roux-principal text-blanc text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
                        )}
                    </Link>
                </div>
            </header>

            {/* ===== DRAWER MOBILE ===== */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-noir-chaud/40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <nav className="absolute left-0 top-0 h-full w-64 bg-creme p-6 flex flex-col gap-6">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Fermer le menu"
                            className="self-end"
                        >
                            <X className="w-6 h-6 text-noir-chaud" />
                        </button>

                        <ul className="flex flex-col gap-4">
                            {NAV_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="font-body text-body-lg text-noir-chaud"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto flex flex-col gap-4 border-t border-[#E8DDD0] pt-6">
                            <Link
                                to={accountLink}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 font-body text-body text-noir-chaud"
                            >
                                <User className="w-5 h-5" />
                                {isAuthenticated ? 'Mon compte' : 'Se connecter'}
                            </Link>
                            <Link
                                to="/wishlist"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 font-body text-body text-noir-chaud"
                            >
                                <Heart className="w-5 h-5" />
                                Mes favoris
                            </Link>
                        </div>
                    </nav>
                </div>
            )}

            {/* ===== HEADER DESKTOP ===== */}
            <header className="hidden md:flex items-center justify-between px-10 py-4 bg-creme border-b border-[#E8DDD0]">
                <Link to="/" className="font-heading text-h2 text-noir-chaud">
                    Maille &amp; Câlins
                </Link>

                <nav className="flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="font-body text-body text-noir-chaud hover:text-roux-principal transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-5">
                    <Link to="/search" aria-label="Rechercher">
                        <Search className="w-5 h-5 text-noir-chaud hover:text-roux-principal transition-colors" />
                    </Link>
                    <Link to="/wishlist" aria-label="Mes favoris">
                        <Heart className="w-5 h-5 text-noir-chaud hover:text-roux-principal transition-colors" />
                    </Link>
                    <Link to={accountLink} aria-label="Mon compte">
                        <User className="w-5 h-5 text-noir-chaud hover:text-roux-principal transition-colors" />
                    </Link>
                    <Link to="/cart" className="relative" aria-label="Panier">
                        <ShoppingBag className="w-5 h-5 text-noir-chaud hover:text-roux-principal transition-colors" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-roux-principal text-blanc text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
                        )}
                    </Link>
                </div>
            </header>
        </>
    );
}