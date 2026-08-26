import apiClient from "./client.js";

export async function createOrder(shippingAddressId, billingAddressId) {
    const response = await apiClient.post('/orders',{shippingAddressId, billingAddressId})
    return response.data
}

export async function getOrders(){
    const response = await apiClient.get('/orders')
    return response.data
}

export async function getOrderdetail(id){
    const response = await apiClient.get(`/orders/${id}`)
    return response.data
}