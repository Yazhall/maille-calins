import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, Truck, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/client.js';
import { getProducts } from '../api/catalogApi.js';
import AdminLayout from '../components/AdminLayout.jsx';

const STATUS_ICONS = {
    pending: PackageCheck,
    confirmed: PackageCheck,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: PackageCheck,
};

function StatCard({ label, value, sublabel }) {
    return (
        <div className="bg-creme rounded-xl p-6 text-center flex flex-col gap-1">
            <p className="font-body text-body-sm text-brun-gris">{label}</p>
            <p className="font-heading text-h2 text-noir-chaud">{value}</p>
            {sublabel && <p className="font-body text-body-sm text-vert-sauge">{sublabel}</p>}
        </div>
    );
}

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState([]);
    const [productsCount, setProductsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [ordersRes, products] = await Promise.all([
                    apiClient.get('/admin/orders'),
                    getProducts(),
                ]);
                setOrders(ordersRes.data);
                setProductsCount(products.length);
            } catch (err) {
                console.error('Erreur lors du chargement du tableau de bord', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <p className="font-body text-body text-brun-gris text-center">Chargement...</p>
            </AdminLayout>
        );
    }

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <AdminLayout>
            <h1 className="font-heading text-h1 text-noir-chaud mb-1">Tableau de bord</h1>
            <p className="font-body text-body text-brun-gris mb-6">Aperçu de votre boutique</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <StatCard label="Chiffre d'affaires" value={`${totalRevenue.toFixed(2)} €`} />
                <StatCard label="Commandes" value={orders.length} />
                <StatCard label="Produits en catalogue" value={productsCount} />
                <StatCard label="Avis en attente" value="—" />
            </div>

            <h2 className="font-heading text-h2 text-noir-chaud text-center mb-4">Dernières commandes</h2>
            <div className="flex flex-col gap-2 mb-10">
                {recentOrders.length === 0 ? (
                    <p className="font-body text-body text-brun-gris text-center">Aucune commande pour le moment.</p>
                ) : (
                    recentOrders.map((order) => {
                        const Icon = STATUS_ICONS[order.status] || PackageCheck;
                        return (
                            <div
                                key={order.id}
                                className="flex items-center justify-between bg-creme rounded-lg px-5 py-4"
                            >
                                <div>
                                    <p className="font-body text-body font-medium text-noir-chaud">{order.orderNumber}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-body text-body text-noir-chaud">{order.totalAmount} €</p>
                                    <Icon className="w-5 h-5 text-roux-principal" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <h2 className="font-heading text-h2 text-noir-chaud text-center mb-4">Accès rapides</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <Link
                    to="/admin/produits"
                    className="flex-1 text-center px-6 py-3 rounded-lg border border-noir-chaud font-body text-body text-noir-chaud"
                >
                    Gérer les produits
                </Link>
                <Link
                    to="/admin/categories"
                    className="flex-1 text-center px-6 py-3 rounded-lg border border-noir-chaud font-body text-body text-noir-chaud"
                >
                    Gérer les catégories
                </Link>
                <Link
                    to="/admin/avis"
                    className="flex-1 text-center px-6 py-3 rounded-lg border border-noir-chaud font-body text-body text-noir-chaud"
                >
                    Voir les avis clients
                </Link>
            </div>
        </AdminLayout>
    );
}