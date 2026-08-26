import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orderApi.js';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                setError('Impossible de charger vos commandes.');
            } finally {
                setLoading(false);
            }
        }

        void fetchOrders();
    }, []);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (orders.length === 0) {
        return <p>Vous n'avez pas encore passé de commande.</p>;
    }

    return (
        <div>
            <h1>Mes commandes</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <Link to={`/orders/${order.id}`}>
                            {order.orderNumber} — {order.status} — {order.totalAmount} €
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}