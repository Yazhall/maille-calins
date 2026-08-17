import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { getProductById } from '../api/catalogApi.js';
import { getImageUrl } from '../utils/imageUrl.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

function CartItemRow({ item, product, onQuantityChange, onRemove }) {
    return (
        <div className="flex items-center gap-4 bg-creme rounded-xl p-4">
            <div className="w-16 h-16 bg-rose-poudre rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {product?.image ? (
                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon className="w-6 h-6 text-brun-gris" strokeWidth={1.2} />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-body text-body text-noir-chaud truncate">
                    {product ? product.name : 'Chargement...'}
                </p>
                <p className="font-body text-body-sm text-brun-gris">15 cm · Pièce unique</p>
                <p className="font-body text-body text-noir-chaud">
                    {product ? `${product.price.toFixed(2)} €` : ''}
                </p>

                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-md bg-roux-principal text-blanc flex items-center justify-center"
                        aria-label="Diminuer la quantité"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 h-8 rounded-md bg-roux-principal text-blanc flex items-center justify-center font-body text-body-sm font-medium">
            {item.quantity}
          </span>
                    <button
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-md bg-roux-principal text-blanc flex items-center justify-center"
                        aria-label="Augmenter la quantité"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <button
                onClick={() => onRemove(item.id)}
                aria-label="Supprimer cet article"
                className="text-brun-gris shrink-0"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}

function OrderSummary({ total, onCheckout, isPlacingOrder, error }) {
    return (
        <div className="bg-creme rounded-xl p-6 flex flex-col gap-4 md:sticky md:top-6">
            <div className="flex justify-between font-body text-body text-noir-chaud">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-body text-body text-noir-chaud">
                <span>Livraison</span>
                <span className="text-vert-sauge">Offerte</span>
            </div>
            <div className="border-t border-brun-gris/20 pt-4 flex justify-between font-heading text-h3 text-noir-chaud">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
            </div>

            <Button variant="primary" className="w-full" onClick={onCheckout} disabled={isPlacingOrder}>
                {isPlacingOrder ? 'Commande en cours...' : 'Passer la commande'}
            </Button>

            {error && <p className="font-body text-body-sm text-red-500">{error}</p>}
        </div>
    );
}

export default function CartPage() {
    const { cart, updateItem, removeItem, refreshCart } = useCart();
    const [products, setProducts] = useState({});
    const [orderError] = useState(null);
    const [isPlacingOrder] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!cart) return;

        async function loadProducts() {
            const entries = await Promise.all(
                cart.items.map(async (item) => {
                    try {
                        const product = await getProductById(item.productId);
                        return [item.productId, product];
                    } catch (error) {
                        return [item.productId, null];
                    }
                })
            );
            setProducts(Object.fromEntries(entries));
        }

        void loadProducts();
    }, [cart]);

    if (!cart) {
        return (
            <div>
                <AnnounceBar />
                <Header />
                <p className="text-center py-20 font-body text-body text-brun-gris">
                    Chargement du panier...
                </p>
                <Footer />
            </div>
        );
    }

    const total = cart.items.reduce((sum, item) => {
        const product = products[item.productId];
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    async function handleQuantityChange(itemId, newQuantity) {
        try {
            await updateItem(itemId, newQuantity);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la quantité', error);
        }
    }

    async function handleRemove(itemId) {
        try {
            await removeItem(itemId);
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
        }
    }

    function handlePlaceOrder() {
        navigate('/commande');
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="px-4 md:px-16 pt-6 pb-4">
                <h1 className="font-heading text-h1 text-noir-chaud">
                    Mon panier <span className="font-body text-body text-brun-gris">{cart.items.length} article{cart.items.length > 1 ? 's' : ''}</span>
                </h1>
            </div>

            {cart.items.length === 0 ? (
                <div className="text-center py-20">
                    <p className="font-body text-body text-brun-gris mb-4">Votre panier est vide.</p>
                    <Link to="/boutique">
                        <Button variant="primary">Découvrir la boutique</Button>
                    </Link>
                </div>
            ) : (
                <div className="px-4 md:px-16 pb-12 flex flex-col md:flex-row gap-6 md:gap-10">
                    <div className="flex-1 flex flex-col gap-4">
                        {cart.items.map((item) => (
                            <CartItemRow
                                key={item.id}
                                item={item}
                                product={products[item.productId]}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    <div className="w-full md:w-80 shrink-0">
                        <OrderSummary
                            total={total}
                            onCheckout={handlePlaceOrder}
                            isPlacingOrder={isPlacingOrder}
                            error={orderError}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}