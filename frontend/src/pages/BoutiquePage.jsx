import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../api/catalogApi';
import { getImageUrl } from '../utils/imageUrl.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';

const PRODUCTS_PER_PAGE = 6;

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

function CategoryPillsMobile({ categories, selectedSlug, onSelect }) {
    return (
        <div className="md:hidden flex gap-2 overflow-x-auto px-4 pb-4">
            <button
                onClick={() => onSelect(null)}
                className={`shrink-0 px-4 py-2 rounded-full font-body text-body-sm ${
                    selectedSlug === null
                        ? 'bg-roux-principal text-blanc'
                        : 'bg-roux-clair text-noir-chaud'
                }`}
            >
                Tous
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category.slug)}
                    className={`shrink-0 px-4 py-2 rounded-full font-body text-body-sm whitespace-nowrap ${
                        selectedSlug === category.slug
                            ? 'bg-roux-principal text-blanc'
                            : 'bg-roux-clair text-noir-chaud'
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}

function CategorySidebarDesktop({ categories, selectedSlug, onSelect }) {
    return (
        <aside className="hidden md:block w-56 shrink-0">
            <p className="font-heading text-h3 text-noir-chaud mb-4">Filtrer par</p>
            <p className="font-body text-body-sm text-brun-gris mb-2">Catégorie</p>
            <ul className="flex flex-col gap-2">
                <li>
                    <button
                        onClick={() => onSelect(null)}
                        className={`font-body text-body ${
                            selectedSlug === null ? 'text-roux-principal font-medium' : 'text-noir-chaud'
                        }`}
                    >
                        Tous
                    </button>
                </li>
                {categories.map((category) => (
                    <li key={category.id}>
                        <button
                            onClick={() => onSelect(category.slug)}
                            className={`font-body text-body ${
                                selectedSlug === category.slug
                                    ? 'text-roux-principal font-medium'
                                    : 'text-noir-chaud'
                            }`}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default function BoutiquePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

    const selectedSlug = searchParams.get('categorie');

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                setError('Impossible de charger les catégories.');
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            setVisibleCount(PRODUCTS_PER_PAGE);
            try {
                const category = categories.find((c) => c.slug === selectedSlug);
                const data = await getProducts(category ? category.id : null);
                setProducts(data);
            } catch (err) {
                setError('Impossible de charger les produits.');
            } finally {
                setLoading(false);
            }
        }

        if (categories.length > 0 || selectedSlug === null) {
            fetchProducts();
        }
    }, [selectedSlug, categories]);

    const visibleProducts = useMemo(
        () => products.slice(0, visibleCount),
        [products, visibleCount]
    );

    function handleSelectCategory(slug) {
        if (slug) {
            setSearchParams({ categorie: slug });
        } else {
            setSearchParams({});
        }
    }

    return (
        <div>
            <AnnounceBar />
            <Header />

            <div className="px-4 md:px-16 pt-6">
                <p className="font-body text-body-sm text-brun-gris mb-2">Accueil/Boutique</p>
                <h1 className="font-heading text-h1 text-noir-chaud mb-4">Notre Boutique</h1>
            </div>

            <CategoryPillsMobile
                categories={categories}
                selectedSlug={selectedSlug}
                onSelect={handleSelectCategory}
            />

            <div className="px-4 md:px-16 pb-10 flex gap-10">
                <CategorySidebarDesktop
                    categories={categories}
                    selectedSlug={selectedSlug}
                    onSelect={handleSelectCategory}
                />

                <div className="flex-1">
                    {error && <p className="text-center text-red-500 py-4">{error}</p>}

                    {loading ? (
                        <p className="font-body text-body text-brun-gris text-center py-10">
                            Chargement des produits...
                        </p>
                    ) : visibleProducts.length === 0 ? (
                        <p className="font-body text-body text-brun-gris text-center py-10">
                            Aucun produit dans cette catégorie pour le moment.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {visibleProducts.map((product) => (
                                    <Link key={product.id} to={`/products/${product.slug}`}>
                                        <ProductCard
                                            image={product.image ? getImageUrl(product.image) : null}
                                            name={product.name}
                                            details="15 cm · Pièce unique"
                                            price={`${product.price.toFixed(2)} €`}
                                        />
                                    </Link>
                                ))}
                            </div>

                            {visibleCount < products.length && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => setVisibleCount((count) => count + PRODUCTS_PER_PAGE)}
                                        className="px-6 py-3 rounded-lg border border-noir-chaud font-body text-body text-noir-chaud"
                                    >
                                        Voir plus de produits
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}