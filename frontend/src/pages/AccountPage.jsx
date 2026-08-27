import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, Trash2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
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

const SECTIONS = [
    { key: 'infos', label: 'Infos personnelles' },
    { key: 'orders', label: 'Mes commandes' },
    { key: 'addresses', label: 'Mes adresses' },
    { key: 'logout', label: 'Déconnexion' },
];

function NavMobile({ activeSection, onSelect }) {
    return (
        <div className="md:hidden flex flex-col">
            {SECTIONS.map((section) => (
                <button
                    key={section.key}
                    onClick={() => onSelect(section.key)}
                    className="flex items-center justify-between px-4 py-4 border-b border-brun-gris/10 font-body text-body text-noir-chaud"
                >
                    {section.label}
                    <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                            activeSection === section.key ? 'rotate-180' : ''
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

function NavDesktop({ activeSection, onSelect }) {
    return (
        <div className="hidden md:flex flex-col gap-4 w-64 shrink-0">
            {SECTIONS.map((section) => (
                <button
                    key={section.key}
                    onClick={() => onSelect(section.key)}
                    className={`flex items-center justify-between px-5 py-3 rounded-lg border font-body text-body ${
                        activeSection === section.key
                            ? 'border-roux-principal text-roux-principal'
                            : 'border-brun-gris/20 text-noir-chaud'
                    }`}
                >
                    {section.label}
                    <ChevronDown className="w-4 h-4" />
                </button>
            ))}
        </div>
    );
}

function InfosPersonnellesSection({ user, onUpdated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await apiClient.patch('/me', form);
            onUpdated();
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.errors || 'Erreur lors de la mise à jour.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isEditing) {
        return (
            <div className="flex flex-col items-center gap-6 text-center">
                <h2 className="font-heading text-h2 text-noir-chaud">Modifier mes informations</h2>
                <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                    <Input
                        placeholder="Prénom"
                        value={form.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Nom"
                        value={form.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        required
                    />
                    <Input
                        placeholder="Téléphone"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                    <div className="flex gap-3 justify-center">
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                        <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>
                            Annuler
                        </Button>
                    </div>
                    {error && <p className="font-body text-body-sm text-red-500">{JSON.stringify(error)}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-heading text-h2 text-noir-chaud">Informations personnelles</h2>
            <div>
                <p className="font-body text-body-sm text-brun-gris">Nom complet</p>
                <p className="font-body text-body text-noir-chaud">
                    {user.firstName} {user.lastName}
                </p>
            </div>
            <div>
                <p className="font-body text-body-sm text-brun-gris">Email</p>
                <p className="font-body text-body text-noir-chaud">{user.email}</p>
            </div>
            {user.phone && (
                <div>
                    <p className="font-body text-body-sm text-brun-gris">Téléphone</p>
                    <p className="font-body text-body text-noir-chaud">{user.phone}</p>
                </div>
            )}
            <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 rounded-lg border border-noir-chaud font-body text-body text-noir-chaud"
            >
                Modifier mes informations
            </button>
        </div>
    );
}

const STATUS_LABELS = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
};

function OrdersSection() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await apiClient.get('/orders');
                setOrders(res.data);
            } catch (err) {
                console.error('Erreur lors du chargement des commandes', err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) {
        return <p className="font-body text-body text-brun-gris text-center">Chargement...</p>;
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="font-heading text-h2 text-noir-chaud text-center">Mes commandes</h2>
            {orders.length === 0 ? (
                <p className="font-body text-body text-brun-gris text-center">
                    Vous n'avez pas encore passé de commande.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            to={`/orders/${order.id}`}
                            className="flex items-center justify-between bg-creme rounded-lg px-5 py-4"
                        >
                            <div>
                                <p className="font-body text-body text-noir-chaud">{order.orderNumber}</p>
                                <p className="font-body text-body-sm text-brun-gris">{order.createdAt}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-body text-body-sm text-roux-principal font-medium">
                                    {STATUS_LABELS[order.status] || order.status}
                                </p>
                                <p className="font-body text-body text-noir-chaud">{order.totalAmount} €</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function AddressCard({ address, onSetDefault, onDelete }) {
    return (
        <div className="bg-creme rounded-lg p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="font-body text-body text-noir-chaud">
                    {address.street}, {address.postalCode} {address.city}
                </p>
                {address.isDefault && (
                    <span className="flex items-center gap-1 font-body text-body-sm text-vert-sauge">
            <Star className="w-3.5 h-3.5 fill-vert-sauge" />
            Par défaut
          </span>
                )}
            </div>
            <p className="font-body text-body-sm text-brun-gris">{address.country}</p>
            <div className="flex gap-3 mt-2">
                {!address.isDefault && (
                    <button
                        onClick={() => onSetDefault(address.id)}
                        className="font-body text-body-sm text-roux-principal"
                    >
                        Définir par défaut
                    </button>
                )}
                <button
                    onClick={() => onDelete(address.id)}
                    className="flex items-center gap-1 font-body text-body-sm text-red-500"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer
                </button>
            </div>
        </div>
    );
}

function AddressForm({ onCreated }) {
    const [form, setForm] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
        type: 'both',
        isDefault: false,
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await apiClient.post('/addresses', form);
            setForm({
                street: '',
                city: '',
                postalCode: '',
                country: 'France',
                type: 'both',
                isDefault: false,
            });
            onCreated();
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'ajout de l'adresse.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-blanc border border-brun-gris/15 rounded-lg p-5">
            <p className="font-body text-body font-medium text-noir-chaud">Ajouter une adresse</p>
            <Input
                placeholder="Rue"
                value={form.street}
                onChange={(e) => handleChange('street', e.target.value)}
                required
            />
            <div className="flex gap-3">
                <Input
                    placeholder="Code postal"
                    value={form.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    required
                />
                <Input
                    placeholder="Ville"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                />
            </div>
            <Input
                placeholder="Pays"
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
                required
            />
            <label className="flex items-center gap-2 font-body text-body-sm text-noir-chaud">
                <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => handleChange('isDefault', e.target.checked)}
                />
                Définir comme adresse par défaut
            </label>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ajout en cours...' : "Ajouter l'adresse"}
            </Button>
            {error && <p className="font-body text-body-sm text-red-500">{error}</p>}
        </form>
    );
}

function AddressesSection() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchAddresses() {
        try {
            const res = await apiClient.get('/addresses');
            setAddresses(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des adresses', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAddresses();
    }, []);

    async function handleSetDefault(id) {
        try {
            await apiClient.patch(`/addresses/${id}/default`);
            fetchAddresses();
        } catch (err) {
            console.error('Erreur lors de la mise à jour', err);
        }
    }

    async function handleDelete(id) {
        try {
            await apiClient.delete(`/addresses/${id}`);
            fetchAddresses();
        } catch (err) {
            console.error('Erreur lors de la suppression', err);
        }
    }

    if (loading) {
        return <p className="font-body text-body text-brun-gris text-center">Chargement...</p>;
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="font-heading text-h2 text-noir-chaud text-center">Mes adresses</h2>

            {addresses.length === 0 ? (
                <p className="font-body text-body text-brun-gris text-center">
                    Vous n'avez pas encore enregistré d'adresse.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onSetDefault={handleSetDefault}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <AddressForm onCreated={fetchAddresses} />
        </div>
    );
}

export default function AccountPage() {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'infos');
    const [loading, setLoading] = useState(true);

    async function fetchMe() {
        try {
            const res = await apiClient.get('/me');
            setUser(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement du profil', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMe();
    }, []);

    function handleSelectSection(key) {
        if (key === 'logout') {
            logoutUser();
            navigate('/');
            return;
        }
        setActiveSection((current) => (current === key ? null : key));
    }

    if (loading || !user) {
        return (
            <div>
                <AnnounceBar />
                <Header />
                <p className="text-center py-20 font-body text-body text-brun-gris">Chargement...</p>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="px-4 md:px-16 pt-6 pb-4 border-b border-brun-gris/10">
                <h1 className="font-heading text-h1 text-noir-chaud">Mon compte</h1>
                <p className="font-body text-body text-brun-gris">Bonjour, {user.firstName}</p>
            </div>

            <NavMobile activeSection={activeSection} onSelect={handleSelectSection} />

            <div className="px-4 md:px-16 py-10 flex gap-10">
                <NavDesktop activeSection={activeSection} onSelect={handleSelectSection} />

                <div className="flex-1">
                    {activeSection === 'infos' && (
                        <InfosPersonnellesSection user={user} onUpdated={fetchMe} />
                    )}
                    {activeSection === 'orders' && <OrdersSection />}
                    {activeSection === 'addresses' && <AddressesSection />}
                </div>
            </div>

            <Footer />
        </div>
    );
}