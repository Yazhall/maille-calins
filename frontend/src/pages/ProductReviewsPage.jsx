import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getProductBySlug, getProductReviews } from '../api/catalogApi';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ReviewsList from '../components/ReviewsList.jsx';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

export default function ProductReviewsPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const productData = await getProductBySlug(slug);
                setProduct(productData);
                const reviewsData = await getProductReviews(productData.id);
                setReviews(reviewsData);
            } catch (err) {
                console.error('Erreur lors du chargement des avis', err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div>
                <AnnounceBar />
                <Header />
                <p className="text-center py-20 font-body text-body text-brun-gris">Chargement...</p>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="max-w-3xl mx-auto px-4 py-12">
                <Link
                    to={`/products/${slug}`}
                    className="inline-flex items-center gap-2 font-body text-body-sm text-brun-gris hover:text-noir-chaud transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la fiche produit
                </Link>

                <h1 className="font-heading text-h1 text-noir-chaud mb-2">
                    Avis sur {product?.name}
                </h1>
                <p className="font-body text-body text-brun-gris mb-8">
                    {reviews.length} avis client{reviews.length > 1 ? 's' : ''}
                </p>

                <ReviewsList reviews={reviews} />
            </div>

            <Footer />
        </div>
    );
}