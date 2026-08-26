import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
    { label: 'Tableau de bord', to: '/admin' },
    { label: 'Produits', to: '/admin/produits' },
    { label: 'Catégories', to: '/admin/categories' },
    { label: 'Commandes', to: '/admin/commandes' },
    { label: 'Avis clients', to: '/admin/avis' },
    { label: 'Réponses aux avis', to: '/admin/avis/reponses' },
];

export default function AdminLayout({ children }) {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        logoutUser();
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-blanc">
            <header className="bg-noir-chaud px-4 md:px-16 py-4 flex items-center justify-between">
                <p className="font-heading text-h3 text-blanc">Maille &amp; Câlins — Admin</p>
                <button onClick={handleLogout} aria-label="Déconnexion">
                    <LogOut className="w-5 h-5 text-blanc" />
                </button>
            </header>

            <div className="px-4 md:px-16 py-8 flex flex-col md:flex-row gap-8">
                <nav className="w-full md:w-56 shrink-0 flex flex-col gap-2">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`px-5 py-3 rounded-lg border font-body text-body ${
                                location.pathname === item.to
                                    ? 'border-roux-principal bg-roux-clair text-roux-fonce'
                                    : 'border-brun-gris/20 text-noir-chaud'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}