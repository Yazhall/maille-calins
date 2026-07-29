import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderdetail } from '../api/orderApi.js';

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderdetail(id);
                setOrder(data);
            } catch (err) {
                setError('Commande introuvable.');
            } finally {
                setLoading(false);
            }
        }

        void fetchOrder();
    }, [id]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return (
            <div>
                <p style={{ color: 'red' }}>{error}</p>
                <Link to="/orders">Retour à mes commandes</Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/orders">Retour à mes commandes</Link>
            <h1>Commande {order.orderNumber}</h1>
            <p>Statut : {order.status}</p>
            <p>Total : {order.totalAmount} €</p>
            <p>Passée le : {order.createdAt}</p>
        </div>
    );
}