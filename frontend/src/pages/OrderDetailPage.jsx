import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, CreditCard } from 'lucide-react';
import { getOrderdetail } from '../api/orderApi.js';

const STATUS_STYLES = {
    pending: { label: 'En attente', className: 'bg-roux-clair text-roux-fonce' },
    paid: { label: 'Payée', className: 'bg-vert-sauge/15 text-vert-sauge' },
    processing: { label: 'En préparation', className: 'bg-roux-clair text-roux-fonce' },
    shipped: { label: 'Expédiée', className: 'bg-vert-sauge/15 text-vert-sauge' },
    delivered: { label: 'Livrée', className: 'bg-vert-sauge/15 text-vert-sauge' },
    cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-600' },
};

function StatusBadge({ status }) {
    const style = STATUS_STYLES[status] || { label: status, className: 'bg-roux-clair text-roux-fonce' };
    return (
        <span className={`inline-block px-3 py-1 rounded-full font-body text-body-sm font-medium ${style.className}`}>
            {style.label}
        </span>
    );
}

function BackLink() {
    return (
        <Link
            to="/account"
            className="inline-flex items-center gap-2 font-body text-body-sm text-brun-gris hover:text-noir-chaud transition-colors"
        >
            <ArrowLeft className="w-4 h-4" />
            Retour à mes commandes
        </Link>
    );
}

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
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="font-body text-body text-brun-gris">Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-start gap-4">
                <BackLink />
                <p className="font-body text-body text-red-500">{error}</p>
            </div>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-6">
            <BackLink />

            <div className="bg-blanc border border-brun-gris/15 rounded-xl p-6 md:p-8 flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="font-body text-body-sm text-brun-gris mb-1">Commande</p>
                        <h1 className="font-heading text-h2 text-noir-chaud">{order.orderNumber}</h1>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                <div className="h-px bg-brun-gris/15" />

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-roux-clair flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-roux-fonce" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-body text-body-sm text-brun-gris">Passée le</p>
                            <p className="font-body text-body text-noir-chaud">{formattedDate}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-roux-clair flex items-center justify-center shrink-0">
                            <CreditCard className="w-4 h-4 text-roux-fonce" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-body text-body-sm text-brun-gris">Total</p>
                            <p className="font-body text-body font-semibold text-noir-chaud">
                                {Number(order.totalAmount).toFixed(2)} €
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-roux-clair flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-roux-fonce" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-body text-body-sm text-brun-gris">Statut</p>
                            <p className="font-body text-body text-noir-chaud">
                                {STATUS_STYLES[order.status]?.label || order.status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}