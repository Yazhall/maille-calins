import apiClient from './client'

export async function getCategories() {
    const response = await apiClient.get('/categories')
    return response.data
}

export async function getProducts(categoryId = null) {
    const params = categoryId ? { categoryId } : {}
    const response = await apiClient.get('/products', { params })
    return response.data
}
export async function getProductBySlug(slug) {
    const response = await apiClient.get(`/products/${slug}`)
    return response.data
}