import apiClient from "./client.js";

export async function getCart(){
    const response = await apiClient.get('/cart')
    return response.data
}

export async function addItemToCart(productId, quantity){
    const response = await apiClient.post('/cart/items', {productId,quantity})
    return response.data
}

export async  function updateCartItem(itemId, quantity){
    const response = await apiClient.patch(`/cart/items/${itemId}`, {quantity})
    return response.data
}

export async function removeCartItem(itemId){
    await apiClient.delete(`/cart/items/${itemId}`)
}