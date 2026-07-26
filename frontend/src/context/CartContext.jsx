import {createContext, useContext, useEffect, useState}from 'react';
import {getCart, addItemToCart, updateCartItem,removeCartItem} from "../api/cartApi.js";
import {useAuth} from "./AuthContext.jsx";

const CartContext = createContext(null)

export function CartProvider({children}){
    const {isAuthenticated} = useAuth();
    const [cart, setCart] = useState(null)

    useEffect(()=> {
    if (isAuthenticated){
        void refreshCart();

    }else {
        setCart(null);
    }}
    , [isAuthenticated]);

    async function refreshCart(){
        try{const data = await getCart();
            setCart(data)
        }catch (error) {
            console.error('Erreur lors du chargement du panier', error)
        }

    }

    async function addItem(produtId, quanity){
        await addItemToCart(produtId, quanity);
        await refreshCart();
    }

    async function updateItem(itemId, quantity){
        await updateCartItem(itemId, quantity);
        await refreshCart();
    }

    async function removeItem(itemId){
        await removeCartItem(itemId);
        await refreshCart();
    }
    const itemCount = cart ? cart.items.length : 0;

    const  value = {
        cart,
        itemCount,
        addItem,
        updateItem,
        removeItem,
        refreshCart
    };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>

}

export function useCart(){
    return useContext(CartContext);
}