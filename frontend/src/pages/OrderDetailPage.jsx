import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, CreditCard, Star } from 'lucide-react';
import { getOrderdetail } from '../api/orderApi.js';
import apiClient from '../api/client.js';
import Button from '../components/Button.jsx';

const STATUS_STYLES = {
    pending: { label: 'En attente', className: 'bg-roux-clair text-roux-fonce' },
    paid: { label: 'Payée', className: 'bg-vert-sauge/15 text-vert-sauge' },
    confirmed: { label: 'Confirmée', className: 'bg-vert-sauge/15 text-vert-sauge' },
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

function ReviewForm({ productId, onSubmitted, onCancel }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await apiClient.post(`/products/${productId}/reviews`, { rating, comment });
            onSubmitted();
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'envoi de l'avis.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-roux-clair/40 rounded-lg p-4 mt-3">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        aria-label={`${star} étoiles`}
                    >
                        <Star
                            className={`w-6 h-6 ${
                                star <= rating ? 'fill-roux-principal text-roux-principal' : 'text-brun-gris/30'
                            }`}
                        />
                    </button>
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre avis sur ce produit..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-lg font-body text-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none"
            />
            <div className="flex gap-3">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi...' : "Envoyer l'avis"}
                </Button>
                <Button variant="secondary" type="button" onClick={onCancel}>
                    Annuler
                </Button>
            </div>
            {error && <p className="font-body text-body-sm text-red-500">{error}</p>}
        </form>
    );
}

function OrderItemRow({ item }) {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewSent, setReviewSent] = useState(false);

    return (
        <div className="border-b border-brun-gris/10 last:border-b-0 py-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="font-body text-body text-noir-chaud">{item.name}</p>
                    <p className="font-body text-body-sm text-brun-gris">
                        Quantité : {item.quantity} · {Number(item.price).toFixed(2)} € l'unité
                    </p>
                </div>
                {!reviewSent && !isReviewOpen && (
                    <button
                        onClick={() => setIsReviewOpen(true)}
                        className="font-body text-body-sm text-roux-principal shrink-0"
                    >
                        Laisser un avis
                    </button>
                )}
                {reviewSent && (
                    <p className="font-body text-body-sm text-vert-sauge shrink-0">Avis envoyé, merci !</p>
                )}
            </div>

            {isReviewOpen && !reviewSent && (
                <ReviewForm
                    productId={item.productId}
                    onSubmitted={() => {
                        setReviewSent(true);
                        setIsReviewOpen(false);
                    }}
                    onCancel={() => setIsReviewOpen(false)}
                />
            )}
        </div>
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

            {order.items && order.items.length > 0 && (
                <div className="bg-blanc border border-brun-gris/15 rounded-xl p-6 md:p-8">
                    <p className="font-heading text-h3 text-noir-chaud mb-2">Produits commandés</p>
                    <div className="flex flex-col">
                        {order.items.map((item) => (
                            <OrderItemRow key={item.productId} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}