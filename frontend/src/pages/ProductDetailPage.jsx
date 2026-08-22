import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImageIcon, ChevronDown, Minus, Plus , Star } from 'lucide-react';
import { getProductBySlug, getProducts, getProductReviews } from '../api/catalogApi';
import { useCart } from '../context/CartContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { getImageUrl } from '../utils/imageUrl.js';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

function Gallery({ image, name }) {
    return (
        <div className="flex-1">
            <div className="w-full aspect-square bg-blanc rounded-xl flex items-center justify-center">
                {image ? (
                    <img src={getImageUrl(image)} alt={name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                    <ImageIcon className="w-12 h-12 text-brun-gris" strokeWidth={1.2} />
                )}
            </div>
            <div className="bg-rose-poudre rounded-b-xl p-4 flex gap-3 justify-center">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-14 h-14 bg-blanc rounded-lg border border-[#E8DDD0] flex items-center justify-center"
                    >
                        {image ? (
                            <img src={getImageUrl(image)} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <ImageIcon className="w-5 h-5 text-brun-gris" strokeWidth={1.2} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function QuantitySelector({ quantity, onChange }) {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => onChange(Math.max(1, quantity - 1))}
                className="w-11 h-11 rounded-lg bg-roux-principal text-blanc flex items-center justify-center"
                aria-label="Diminuer la quantité"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="w-11 h-11 rounded-lg bg-roux-principal text-blanc flex items-center justify-center font-body font-medium">
        {quantity}
      </span>
            <button
                onClick={() => onChange(quantity + 1)}
                className="w-11 h-11 rounded-lg bg-roux-principal text-blanc flex items-center justify-center"
                aria-label="Augmenter la quantité"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}

function AccordionItem({ title, content, isOpen, onToggle }) {
    return (
        <div className="border-b border-brun-gris/15">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-4 font-body text-body text-noir-chaud"
            >
                {title}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <p className="font-body text-body-sm text-brun-gris pb-4">{content}</p>
            )}
        </div>
    );
}
function ReviewsList({ reviews }) {
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
                </div>
            ))}
        </div>
    );
}

export default function ProductDetailPage() {
    const { slug } = useParams();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addStatus, setAddStatus] = useState(null);
    const [openAccordion, setOpenAccordion] = useState('description');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            setError(null);
            setQuantity(1);
            setAddStatus(null);
            try {
                const data = await getProductBySlug(slug);
                setProduct(data);
                setProduct(data);

                const productReviews = await getProductReviews(data.id);
                setReviews(productReviews);

                const allProducts = await getProducts(data.categoryIds?.[0]);
                setRelatedProducts(allProducts.filter((p) => p.slug !== slug).slice(0, 4));
            } catch (err) {
                setError('Produit introuvable.');
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    async function handleAddToCart() {
        setAddStatus(null);
        try {
            await addItem(product.id, quantity);
            setAddStatus('success');
        } catch (err) {
            setAddStatus('error');
        }
    }

    function toggleAccordion(key) {
        setOpenAccordion((current) => (current === key ? null : key));
    }

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

    if (error || !product) {
        return (
            <div>
                <AnnounceBar />
                <Header />
                <div className="text-center py-20">
                    <p className="font-body text-body text-red-500 mb-4">{error}</p>
                    <Link to="/boutique" className="font-body text-body text-roux-principal">
                        Retour à la boutique
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="px-4 md:px-16 pt-6">
                <p className="font-body text-body-sm text-brun-gris mb-6">
                    Accueil / Boutique / {product.name}
                </p>
            </div>

            <div className="px-4 md:px-16 pb-12 flex flex-col md:flex-row gap-8 md:gap-12">
                <Gallery image={product.image} name={product.name} />

                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-blanc rounded-xl p-6 flex flex-col gap-3">
                        <h1 className="font-heading text-h2 text-noir-chaud">{product.name}</h1>
                        <p className="font-body text-h3 text-noir-chaud">{product.price.toFixed(2)} €</p>
                        <p className="font-body text-body-sm text-brun-gris">
                            15 cm · Pièce unique · Fait main
                        </p>
                        <p className="font-body text-body text-noir-chaud">{product.description}</p>
                    </div>

                    <QuantitySelector quantity={quantity} onChange={setQuantity} />

                    <Button variant="primary" className="w-full" onClick={handleAddToCart}>
                        Ajouter au Panier
                    </Button>

                    {addStatus === 'success' && (
                        <p className="font-body text-body-sm text-vert-sauge">Ajouté au panier !</p>
                    )}
                    {addStatus === 'error' && (
                        <p className="font-body text-body-sm text-red-500">Erreur lors de l'ajout.</p>
                    )}

                    <div>
                        <AccordionItem
                            title="Description Longue"
                            content={product.description}
                            isOpen={openAccordion === 'description'}
                            onToggle={() => toggleAccordion('description')}
                        />
                        <AccordionItem
                            title="Dimensions & Matière"
                            content="15 cm de hauteur. Fils de laine douce, rembourrage hypoallergénique, yeux en sécurité."
                            isOpen={openAccordion === 'dimensions'}
                            onToggle={() => toggleAccordion('dimensions')}
                        />
                        <AccordionItem
                            title="Entretien"
                            content="Nettoyage à sec recommandé, ou lavage délicat à la main à l'eau froide."
                            isOpen={openAccordion === 'entretien'}
                            onToggle={() => toggleAccordion('entretien')}
                        />
                        <AccordionItem
                            title="Livraison & Retours"
                            content="Expédition sous 3 à 5 jours ouvrés. Retours acceptés sous 14 jours."
                            isOpen={openAccordion === 'livraison'}
                            onToggle={() => toggleAccordion('livraison')}
                        />
                        <div className="border-b border-brun-gris/15">
                            <button
                                onClick={() => toggleAccordion('avis')}
                                className="w-full flex items-center justify-between py-4 font-body text-body text-noir-chaud"
                            >
                                Avis clients ({reviews.length})
                                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'avis' ? 'rotate-180' : ''}`} />
                            </button>
                            {openAccordion === 'avis' && <ReviewsList reviews={reviews} />}
                        </div>

                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="px-4 md:px-16 pb-12">
                    <h2 className="font-heading text-h2 text-noir-chaud mb-6">Vous aimerez aussi</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((related) => (
                            <Link key={related.id} to={`/products/${related.slug}`}>
                                <ProductCard
                                    image={related.image ? getImageUrl(related.image) : null}
                                    name={related.name}
                                    details="15 cm · Pièce unique"
                                    price={`${related.price.toFixed(2)} €`}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}