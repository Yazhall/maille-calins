import { Star } from 'lucide-react';

export default function ReviewsList({ reviews }) {
    if (reviews.length === 0) {
        return (
            <p className="font-body text-body-sm text-brun-gris pb-4">
                Aucun avis pour le moment sur ce produit.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4 pb-4">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-brun-gris/10 last:border-b-0 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                        star <= review.rating
                                            ? 'fill-roux-principal text-roux-principal'
                                            : 'text-brun-gris/30'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="font-body text-body-sm font-medium text-noir-chaud">
                            {review.userNameSnapshot}
                        </p>
                    </div>
                    <p className="font-body text-body-sm text-brun-gris">{review.comment}</p>

                    {review.adminReply && (
                        <div className="bg-roux-clair/40 rounded-lg p-3 mt-2">
                            <p className="font-body text-caption font-medium text-roux-fonce mb-1">
                                Réponse de Maille &amp; Câlins
                            </p>
                            <p className="font-body text-body-sm text-noir-chaud">{review.adminReply}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}