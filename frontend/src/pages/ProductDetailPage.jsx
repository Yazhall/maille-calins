import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug } from '../api/catalogApi'

function ProductDetailPage() {
    const { slug } = useParams()

    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true)
            setError(null)
            try {
                const data = await getProductBySlug(slug)
                setProduct(data)
            } catch (err) {
                setError('Produit introuvable.')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug])

    if (loading) {
        return <p>Chargement...</p>
    }

    if (error) {
        return (
            <div>
                <p style={{ color: 'red' }}>{error}</p>
                <Link to="/">Retour au catalogue</Link>
            </div>
        )
    }

    return (
        <div>
            <Link to="/">Retour au catalogue</Link>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>{product.price} €</p>
            <p>Stock : {product.stock}</p>
            <p>Note moyenne : {product.ratingAverage} ({product.ratingCount} avis)</p>
        </div>
    )
}

export default ProductDetailPage