import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { getProductById } from '../api/catalogApi.js';

export default function CartPage() {
    const { cart, updateItem, removeItem } = useCart();
    const [products, setProducts] = useState({});

    useEffect(() => {
        if (!cart) return;

        async function loadProducts() {
            const entries = await Promise.all(
                cart.items.map(async (item) => {
                    try {
                        const product = await getProductById(item.productId);
                        return [item.productId, product];
                    } catch (error) {
                        console.error(`Produit introuvable: ${item.productId}`, error);
                        return [item.productId, null];
                    }
                })
            );
            setProducts(Object.fromEntries(entries));
        }

        void loadProducts();
    }, [cart]);

    if (!cart) {
        return <p>Chargement du panier...</p>;
    }

    if (cart.items.length === 0) {
        return <p>Votre panier est vide.</p>;
    }

    const total = cart.items.reduce((sum, item) => {
        const product = products[item.productId];
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    async function handleQuantityChange(itemId, newQuantity) {
        if (newQuantity < 1) return;
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

    return (
        <div>
            <h1>Mon panier</h1>
            <ul>
                {cart.items.map((item) => {
                    const product = products[item.productId];
                    return (
                        <li key={item.id}>
                            {product ? product.name : 'Chargement...'}
                            {' — '}
                            {product ? `${product.price} €` : ''}
                            {' x '}
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            />
                            <button onClick={() => handleRemove(item.id)}>Supprimer</button>
                        </li>
                    );
                })}
            </ul>
            <p>Total : {total.toFixed(2)} €</p>
        </div>
    );
}