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

function OrderRow({ order, onStatusChange }) {
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleChange(e) {
        setIsUpdating(true);
        try {
            await onStatusChange(order.id, e.target.value);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 bg-creme rounded-lg p-4">
            <div className="flex-1">
                <p className="font-body text-body font-medium text-noir-chaud">{order.orderNumber}</p>
                <p className="font-body text-body-sm text-brun-gris">{order.createdAt}</p>
            </div>
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
    );
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <AdminLayout>
            <h1 className="font-heading text-h1 text-noir-chaud mb-6">Commandes</h1>

            {orders.length === 0 ? (
                <p className="font-body text-body text-brun-gris text-center">Aucune commande pour le moment.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {orders.map((order) => (
                        <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
