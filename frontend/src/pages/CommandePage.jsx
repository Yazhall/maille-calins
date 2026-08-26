import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { getProductById } from '../api/catalogApi.js';
import { createOrder } from '../api/orderApi.js';
import apiClient from '../api/client.js';
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

function AddressBlock({ address, user }) {
    return (
        <div className="bg-creme rounded-xl p-6 text-center">
            <p className="font-body text-body-sm text-brun-gris mb-1">Adresse de livraison</p>
            {address ? (
                <>
                    <p className="font-body text-body font-medium text-noir-chaud">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="font-body text-body-sm text-brun-gris mb-4">
                        {address.street}, {address.postalCode} {address.city}
                    </p>
                </>
            ) : (
                <p className="font-body text-body-sm text-red-500 mb-4">
                    Aucune adresse enregistrée. Rendez-vous dans votre compte pour en ajouter une avant de commander.
                </p>
            )}
            <button
                disabled
                className="px-5 py-2 rounded-lg border border-noir-chaud/30 font-body text-body-sm text-brun-gris cursor-not-allowed"
                title="La gestion des adresses arrive bientôt dans votre espace compte"
            >
                Modifier
            </button>
        </div>
    );
}

function DeliveryOptions() {
    return (
        <div className="flex flex-col gap-3">
            <p className="font-body text-body font-medium text-noir-chaud text-center">Mode de livraison</p>
            <div className="flex items-center justify-between gap-4 bg-roux-clair rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-noir-chaud shrink-0" />
                    <span className="font-body text-body text-noir-chaud">Livraison standard</span>
                    <span className="font-body text-body-sm text-brun-gris">3-5 jours ouvrés</span>
                </div>
                <span className="font-body text-body-sm text-vert-sauge font-medium">Gratuite</span>
            </div>
            <div className="flex items-center justify-between gap-4 bg-rose-poudre/50 rounded-lg px-4 py-3 opacity-60">
                <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border border-brun-gris shrink-0" />
                    <span className="font-body text-body text-noir-chaud">Livraison Express</span>
                    <span className="font-body text-body-sm text-brun-gris">2-3 jours ouvrés</span>
                </div>
                <span className="font-body text-body-sm text-brun-gris">4,90 €</span>
            </div>
        </div>
    );
}

function PaymentForm() {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-body text-body font-medium text-noir-chaud text-center">Paiement</p>
            <div>
                <label className="font-body text-body-sm text-brun-gris block mb-1">Numéro de carte</label>
                <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-5 py-3 rounded-lg font-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none"
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="font-body text-body-sm text-brun-gris block mb-1">MM/AA</label>
                    <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-5 py-3 rounded-lg font-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none"
                    />
                </div>
                <div className="flex-1">
                    <label className="font-body text-body-sm text-brun-gris block mb-1">CVC</label>
                    <input
                        type="text"
                        placeholder="CVC"
                        className="w-full px-5 py-3 rounded-lg font-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none"
                    />
                </div>
            </div>
            <p className="flex items-center justify-center gap-2 font-body text-body-sm text-brun-gris">
                <Lock className="w-3.5 h-3.5" />
                Paiement 100% sécurisé
            </p>
        </div>
    );
}

function OrderRecap({ items, products, total, onConfirm, isPlacingOrder, error, disabled }) {
    return (
        <div className="bg-creme rounded-xl p-6 flex flex-col gap-4 md:sticky md:top-6">
            <p className="font-heading text-h3 text-noir-chaud text-center">Récapitulatif</p>

            <div className="flex flex-col gap-2">
                {items.map((item) => {
                    const product = products[item.productId];
                    return (
                        <div key={item.id} className="flex justify-between font-body text-body-sm text-noir-chaud">
              <span>
                {product ? product.name : '...'} x{item.quantity}
              </span>
                            <span>{product ? (product.price * item.quantity).toFixed(2) : '...'} €</span>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-brun-gris/20 pt-4 flex flex-col gap-2">
                <div className="flex justify-between font-body text-body text-noir-chaud">
                    <span>Sous-total</span>
                    <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-body text-body text-noir-chaud">
                    <span>Livraison</span>
                    <span className="text-vert-sauge">Offerte</span>
                </div>
            </div>

            <div className="border-t border-brun-gris/20 pt-4 flex justify-between font-heading text-h3 text-noir-chaud">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
            </div>

            <Button
                variant="primary"
                className="w-full"
                onClick={onConfirm}
                disabled={isPlacingOrder || disabled}
            >
                {isPlacingOrder ? 'Confirmation en cours...' : 'Confirmer la commande'}
            </Button>

            {error && <p className="font-body text-body-sm text-red-500 text-center">{error}</p>}
        </div>
    );
}

export default function CommandePage() {
    const { cart, refreshCart } = useCart();
    const navigate = useNavigate();

    const [products, setProducts] = useState({});
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCheckoutData() {
            try {
                const [addressesRes, meRes] = await Promise.all([
                    apiClient.get('/addresses'),
                    apiClient.get('/me'),
                ]);
                const addresses = addressesRes.data;
                setDefaultAddress(addresses.find((a) => a.isDefault) || addresses[0] || null);
                setUser(meRes.data);
            } catch (err) {
                console.error('Erreur lors du chargement des données de commande', err);
            } finally {
                setLoading(false);
            }
        }

        fetchCheckoutData();
    }, []);

    useEffect(() => {
        if (!cart) return;

        async function loadProducts() {
            const entries = await Promise.all(
                cart.items.map(async (item) => {
                    try {
                        const product = await getProductById(item.productId);
                        return [item.productId, product];
                    } catch (err) {
                        return [item.productId, null];
                    }
                })
            );
            setProducts(Object.fromEntries(entries));
        }

        void loadProducts();
    }, [cart]);

    if (!cart || loading) {
        return (
            <div>
                <AnnounceBar />
                <Header />
                <p className="text-center py-20 font-body text-body text-brun-gris">Chargement...</p>
                <Footer />
            </div>
        );
    }

    const total = cart.items.reduce((sum, item) => {
        const product = products[item.productId];
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    async function handleConfirmOrder() {
        setError(null);
        setIsPlacingOrder(true);
        try {
            const order = await createOrder(null, null);
            await refreshCart();
            navigate(`/orders/${order.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la confirmation de la commande.');
        } finally {
            setIsPlacingOrder(false);
        }
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="px-4 md:px-16 pt-6 pb-4">
                <h1 className="font-heading text-h1 text-noir-chaud">Finaliser ma commande</h1>
            </div>

            {cart.items.length === 0 ? (
                <div className="text-center py-20">
                    <p className="font-body text-body text-brun-gris mb-4">
                        Votre panier est vide, impossible de passer commande.
                    </p>
                    <Link to="/boutique">
                        <Button variant="primary">Découvrir la boutique</Button>
                    </Link>
                </div>
            ) : (
                <div className="px-4 md:px-16 pb-12 flex flex-col md:flex-row gap-8 md:gap-10">
                    <div className="flex-1 flex flex-col gap-8">
                        <AddressBlock address={defaultAddress} user={user} />
                        <DeliveryOptions />
                        <PaymentForm />
                    </div>

                    <div className="w-full md:w-96 shrink-0">
                        <OrderRecap
                            items={cart.items}
                            products={products}
                            total={total}
                            onConfirm={handleConfirmOrder}
                            isPlacingOrder={isPlacingOrder}
                            error={error}
                            disabled={!defaultAddress}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}