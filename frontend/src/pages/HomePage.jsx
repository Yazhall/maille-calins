import { useState, useEffect } from 'react'
import { getCategories, getProducts } from '../api/catalogApi'
import { Link } from 'react-router-dom'
function HomePage() {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories()
                setCategories(data)
            } catch (err) {
                setError('Impossible de charger les catégories.')
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            try {
                const data = await getProducts(selectedCategoryId)
                setProducts(data)
            } catch (err) {
                setError('Impossible de charger les produits.')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [selectedCategoryId])

    return (
        <div>
            <h1>Maille & Câlins</h1>

            <nav>
                <button onClick={() => setSelectedCategoryId(null)}>
                    Tous les produits
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </nav>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
                <p>Chargement des produits...</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <Link to={`/products/${product.slug}`}>
                                <h2>{product.name}</h2>
                            </Link>
                            <p>{product.price} €</p>
                            <p>Stock : {product.stock}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default HomePage