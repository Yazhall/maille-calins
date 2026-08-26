import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import apiClient from '../api/client.js';
import AdminLayout from '../components/AdminLayout.jsx';
import Button from '../components/Button.jsx';

function ReviewReplyRow({ review, onReplied }) {
    const [reply, setReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await apiClient.patch(`/admin/reviews/${review.id}/reply`, { adminReply: reply });
            onReplied();
        } catch (err) {
            setError(err.response?.data?.errors || "Erreur lors de l'envoi de la réponse.");
        } finally {
            setIsSubmitting(false);
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

            {review.adminReply ? (
                <div className="bg-roux-clair/40 rounded-lg p-3 mt-2">
                    <p className="font-body text-body-sm font-medium text-roux-fonce mb-1">Votre réponse</p>
                    <p className="font-body text-body-sm text-noir-chaud">{review.adminReply}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
          <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Répondre à cet avis..."
              rows={2}
              required
              className="w-full px-4 py-3 rounded-lg font-body text-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none"
          />
                    <div>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                  {isSubmitting ? 'Envoi...' : 'Répondre'}
              </span>
                        </Button>
                    </div>
                    {error && <p className="font-body text-body-sm text-red-500">{JSON.stringify(error)}</p>}
                </form>
            )}
        </div>
    );
}

export default function AdminReviewsRepliesPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchReviews() {
        try {
            const res = await apiClient.get('/admin/reviews/published');
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

    if (loading) {
        return (
            <AdminLayout>
                <p className="font-body text-body text-brun-gris text-center">Chargement...</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <h1 className="font-heading text-h1 text-noir-chaud mb-1">Réponses aux avis</h1>
            <p className="font-body text-body text-brun-gris mb-6">Avis publiés, avec ou sans réponse</p>

            {reviews.length === 0 ? (
                <p className="font-body text-body text-brun-gris text-center">Aucun avis publié pour le moment.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {reviews.map((review) => (
                        <ReviewReplyRow key={review.id} review={review} onReplied={fetchReviews} />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}