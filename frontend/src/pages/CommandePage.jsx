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

const SHIPPING_TYPES = ['shipping', 'both'];
const BILLING_TYPES = ['billing', 'both'];

function pickInitial(addresses, allowedTypes) {
    const eligible = addresses.filter((a) => allowedTypes.includes(a.type));
    const initial = eligible.find((a) => a.isDefault) || eligible[0] || null;
    return initial ? initial.id : null;
}

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

function AddressList({ title, name, addresses, selectedId, onSelect, user, emptyMessage }) {
    return (
        <div className="bg-creme rounded-xl p-6">
            <p className="font-body text-body-sm text-brun-gris mb-3 text-center">{title}</p>
            {addresses.length > 0 ? (
                <fieldset className="flex flex-col gap-3">
                    <legend className="sr-only">{title}</legend>
                    {addresses.map((address) => {
                        const isSelected = address.id === selectedId;
                        return (
                            <label
                                key={address.id}
                                className={`flex items-start gap-3 rounded-lg px-4 py-3 cursor-pointer bg-blanc border ${
                                    isSelected ? 'border-noir-chaud' : 'border-brun-gris/30'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={name}
                                    value={address.id}
                                    checked={isSelected}
                                    onChange={() => onSelect(address.id)}
                                    className="mt-1 accent-noir-chaud"
                                />
                                <span className="flex flex-col">
                                    <span className="font-body text-body font-medium text-noir-chaud">
                                        {user?.firstName} {user?.lastName}
                                        {address.isDefault && (
                                            <span className="ml-2 font-body text-body-sm text-vert-sauge">
                                                Par défaut
                                            </span>
                                        )}
                                    </span>
                                    <span className="font-body text-body-sm text-brun-gris">
                                        {address.street}, {address.postalCode} {address.city}
                                    </span>
                                    <span className="font-body text-body-sm text-brun-gris">{address.country}</span>
                                </span>
                            </label>
                        );
                    })}
                </fieldset>
            ) : (
                <p className="font-body text-body-sm text-red-500 text-center">{emptyMessage}</p>
            )}
            <div className="text-center mt-4">
                <Link
                    to="/account?section=addresses"
                    className="inline-block px-5 py-2 rounded-lg border border-noir-chaud font-body text-body-sm text-noir-chaud"
                >
                    Gérer mes adresses
                </Link>
            </div>
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
    const [addresses, setAddresses] = useState([]);
    const [shippingAddressId, setShippingAddressId] = useState(null);
    const [billingAddressId, setBillingAddressId] = useState(null);
    const [sameAsShipping, setSameAsShipping] = useState(true);
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
                const list = addressesRes.data;
                setAddresses(list);
                setShippingAddressId(pickInitial(list, SHIPPING_TYPES));
                setBillingAddressId(pickInitial(list, BILLING_TYPES));
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

    const shippingAddresses = addresses.filter((a) => SHIPPING_TYPES.includes(a.type));
    const billingAddresses = addresses.filter((a) => BILLING_TYPES.includes(a.type));
    const selectedShipping = addresses.find((a) => a.id === shippingAddressId) || null;
    // "Même adresse" n'est possible que si l'adresse de livraison choisie sert aussi à la facturation
    const canReuseForBilling = selectedShipping?.type === 'both';
    const useSameForBilling = canReuseForBilling && sameAsShipping;
    const effectiveBillingId = useSameForBilling ? shippingAddressId : billingAddressId;

    async function handleConfirmOrder() {
        setError(null);
        setIsPlacingOrder(true);
        try {
            const order = await createOrder(shippingAddressId, effectiveBillingId);
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
                        <AddressList
                            title="Adresse de livraison"
                            name="shippingAddress"
                            addresses={shippingAddresses}
                            selectedId={shippingAddressId}
                            onSelect={setShippingAddressId}
                            user={user}
                            emptyMessage="Aucune adresse de livraison enregistrée. Rendez-vous dans votre compte pour en ajouter une avant de commander."
                        />
                        {canReuseForBilling && (
                            <label className="flex items-center justify-center gap-2 font-body text-body-sm text-noir-chaud cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sameAsShipping}
                                    onChange={(e) => setSameAsShipping(e.target.checked)}
                                    className="accent-noir-chaud"
                                />
                                Utiliser la même adresse pour la facturation
                            </label>
                        )}
                        {!useSameForBilling && (
                            <AddressList
                                title="Adresse de facturation"
                                name="billingAddress"
                                addresses={billingAddresses}
                                selectedId={billingAddressId}
                                onSelect={setBillingAddressId}
                                user={user}
                                emptyMessage="Aucune adresse de facturation enregistrée. Ajoutez-en une dans votre compte (type « facturation » ou « les deux »)."
                            />
                        )}
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
                            disabled={!shippingAddressId || !effectiveBillingId}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}