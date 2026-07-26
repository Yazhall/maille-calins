import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug } from '../api/catalogApi'
import { useCart } from '../context/CartContext.jsx'

function ProductDetailPage() {
    const { slug } = useParams()
    const { addItem } = useCart()

    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [addStatus, setAddStatus] = useState(null)

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

    async function handleAddToCart() {
        setAddStatus(null)
        try {
            await addItem(product.id, quantity)
            setAddStatus('success')
        } catch (err) {
            console.error('Erreur lors de l\'ajout au panier', err)
            setAddStatus('error')
        }
    }

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

            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button onClick={handleAddToCart}>Ajouter au panier</button>

            {addStatus === 'success' && <p style={{ color: 'green' }}>Ajouté au panier !</p>}
            {addStatus === 'error' && <p style={{ color: 'red' }}>Erreur lors de l'ajout.</p>}

            <Link to="/cart">Voir mon panier</Link>
        </div>
    )
}

export default ProductDetailPage