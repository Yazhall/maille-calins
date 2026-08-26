import { useState, useEffect } from 'react';
import { Star, Check, X } from 'lucide-react';
import apiClient from '../api/client.js';
import AdminLayout from '../components/AdminLayout.jsx';

function ReviewRow({ review, onModerate }) {
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleAction(status) {
        setIsUpdating(true);
        try {
            await onModerate(review.id, status);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="flex flex-col gap-2 bg-creme rounded-lg p-4">
            <div className="flex items-center justify-between">
                <p className="font-body text-body font-medium text-noir-chaud">{review.userNameSnapshot}</p>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-4 h-4 ${
                                star <= review.rating ? 'fill-roux-principal text-roux-principal' : 'text-brun-gris/30'
                            }`}
                        />
                    ))}
                </div>
            </div>
            <p className="font-body text-body-sm text-brun-gris">{review.comment}</p>
            <p className="font-body text-caption text-brun-gris">{review.createdAt}</p>

            <div className="flex gap-3 mt-2">
                <button
                    onClick={() => handleAction('published')}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-vert-sauge text-blanc font-body text-body-sm"
                >
                    <Check className="w-4 h-4" />
                    Publier
                </button>
                <button
                    onClick={() => handleAction('rejected')}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-red-500 text-red-500 font-body text-body-sm"
                >
                    <X className="w-4 h-4" />
                    Rejeter
                </button>
            </div>
        </div>
    );
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchReviews() {
        try {
            const res = await apiClient.get('/admin/reviews/pending');
            setReviews(res.data);
        } catch (err) {
            console.error('Erreur lors du chargement des avis', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, []);

    async function handleModerate(reviewId, status) {
        try {
            await apiClient.patch(`/admin/reviews/${reviewId}/status`, { status });
            fetchReviews();
        } catch (err) {
            console.error('Erreur lors de la modération', err);
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
            <h1 className="font-heading text-h1 text-noir-chaud mb-1">Avis clients</h1>
            <p className="font-body text-body text-brun-gris mb-6">Avis en attente de modération</p>

            {reviews.length === 0 ? (
                <p className="font-body text-body text-brun-gris text-center">
                    Aucun avis en attente de modération.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {reviews.map((review) => (
                        <ReviewRow key={review.id} review={review} onModerate={handleModerate} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}