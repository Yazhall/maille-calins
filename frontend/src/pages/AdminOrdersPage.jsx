import { useState, useEffect } from 'react';
import apiClient from '../api/client.js';
import AdminLayout from '../components/AdminLayout.jsx';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_LABELS = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
};

// Chaque filtre regroupe un ou plusieurs statuts (null = toutes les commandes)
const FILTERS = [
    { key: 'all', label: 'Toutes', statuses: null },
    { key: 'ongoing', label: 'En cours', statuses: ['pending', 'confirmed', 'shipped'] },
    { key: 'done', label: 'Terminées', statuses: ['delivered'] },
    { key: 'cancelled', label: 'Annulées', statuses: ['cancelled'] },
];

function matchesFilter(order, filter) {
    return filter.statuses === null || filter.statuses.includes(order.status);
}

function OrderDetails({ order }) {
    const items = order.items || [];
    const address = order.shippingAddress;
    const customer = order.customer;

    return (
        <div className="border-t border-brun-gris/20 mt-3 pt-4 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
                <div>
                    <p className="font-body text-body-sm text-brun-gris mb-1">Client</p>
                    <p className="font-body text-body text-noir-chaud">
                        {customer?.firstName} {customer?.lastName}
                    </p>
                    <p className="font-body text-body-sm text-brun-gris">{customer?.email}</p>
                </div>
                <div>
                    <p className="font-body text-body-sm text-brun-gris mb-1">Adresse de livraison</p>
                    {address ? (
                        <>
                            <p className="font-body text-body text-noir-chaud">{address.street}</p>
                            <p className="font-body text-body-sm text-brun-gris">
                                {address.postalCode} {address.city}
                            </p>
                            <p className="font-body text-body-sm text-brun-gris">{address.country}</p>
                        </>
                    ) : (
                        <p className="font-body text-body-sm text-brun-gris">Non renseignée</p>
                    )}
                </div>
            </div>

            <div>
                <p className="font-body text-body-sm text-brun-gris mb-1">Produits commandés</p>
                <ul className="flex flex-col gap-2">
                    {items.map((item, index) => (
                        <li
                            key={`${item.productId}-${index}`}
                            className="flex justify-between gap-4 font-body text-body-sm text-noir-chaud"
                        >
                            <span>
                                {item.name} × {item.quantity}
                            </span>
                            <span>{(Number(item.price) * item.quantity).toFixed(2)} €</span>
                        </li>
                    ))}
                </ul>
                <p className="flex justify-between border-t border-brun-gris/20 mt-3 pt-3 font-body text-body font-medium text-noir-chaud">
                    <span>Total</span>
                    <span>{order.totalAmount} €</span>
                </p>
            </div>
        </div>
    );
}

function OrderRow({ order, onStatusChange }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    async function handleChange(e) {
        setIsUpdating(true);
        try {
            await onStatusChange(order.id, e.target.value);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="bg-creme rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <button
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    className="flex-1 text-left cursor-pointer"
                >
                    <p className="font-body text-body font-medium text-noir-chaud">
                        {order.orderNumber}
                        <span className="ml-2 text-brun-gris">{isOpen ? '▲' : '▼'}</span>
                    </p>
                    <p className="font-body text-body-sm text-brun-gris">
                        {order.createdAt}
                        {order.customer && ` · ${order.customer.firstName} ${order.customer.lastName}`}
                    </p>
                </button>
                <p className="font-body text-body text-noir-chaud">{order.totalAmount} €</p>
                <select
                    value={order.status}
                    onChange={handleChange}
                    disabled={isUpdating}
                    className="px-4 py-2 rounded-lg border border-brun-gris/30 font-body text-body-sm text-noir-chaud bg-blanc outline-none"
                >
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>
            </div>

            {isOpen && <OrderDetails order={order} />}
        </div>
    );
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilterKey, setActiveFilterKey] = useState('all');

    async function fetchOrders() {
        try {
            const res = await apiClient.get('/admin/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des commandes', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    async function handleStatusChange(orderId, newStatus) {
        try {
            await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            console.error('Erreur lors du changement de statut', err);
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <p className="font-body text-body text-brun-gris text-center">Chargement...</p>
            </AdminLayout>
        );
    }

    const activeFilter = FILTERS.find((f) => f.key === activeFilterKey);
    // Le tri (plus récentes en premier) est fait par le backend : on ne retrie pas ici
    const visibleOrders = orders.filter((order) => matchesFilter(order, activeFilter));

    return (
        <AdminLayout>
            <h1 className="font-heading text-h1 text-noir-chaud mb-6">Commandes</h1>

            <div className="flex flex-wrap gap-2 mb-6">
                {FILTERS.map((filter) => {
                    const count = orders.filter((order) => matchesFilter(order, filter)).length;
                    const isActive = filter.key === activeFilterKey;
                    return (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => setActiveFilterKey(filter.key)}
                            aria-pressed={isActive}
                            className={`px-4 py-2 rounded-lg font-body text-body-sm border cursor-pointer ${
                                isActive
                                    ? 'bg-noir-chaud text-blanc border-noir-chaud'
                                    : 'bg-blanc text-noir-chaud border-brun-gris/30'
                            }`}
                        >
                            {filter.label} ({count})
                        </button>
                    );
                })}
            </div>

            {visibleOrders.length === 0 ? (
                <p className="font-body text-body text-brun-gris text-center">
                    Aucune commande dans cette catégorie.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {visibleOrders.map((order) => (
                        <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}