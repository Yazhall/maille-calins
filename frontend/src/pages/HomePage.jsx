import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HandHeart, Sparkles, Truck, ImageIcon } from 'lucide-react';
import { getCategories, getProducts } from '../api/catalogApi';
import { getImageUrl } from '../utils/imageUrl.js';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import heroImage from '../assets/images/hero-home.jpg';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

function Hero() {
    return (
        <section className="bg-rose-poudre px-4 md:px-16 py-10 md:py-20">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="w-full md:w-1/2 aspect-square bg-blanc rounded-xl overflow-hidden">
                    <img
                        src={heroImage}
                        alt="Création crochet Maille & Câlins"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
                    <h1 className="font-heading text-h1 text-noir-chaud leading-tight">
                        Chaque peluche, une histoire cousue main
                    </h1>
                    <p className="font-body text-body-lg text-brun-gris max-w-md">
                        Découvrez notre univers cosy de créations artisanales, imaginées et crochetées avec soin.
                    </p>
                    <Link to="/boutique">
                        <Button variant="primary">Découvrir la boutique</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Reassurance() {
    const items = [
        {
            icon: HandHeart,
            title: 'Fait main',
            description: 'Chaque pièce façonnée à la main, avec patience',
        },
        {
            icon: Sparkles,
            title: 'Pièces uniques',
            description: 'Chaque création est unique, jamais deux fois la même',
        },
        {
            icon: Truck,
            title: 'Livraison offerte',
            description: "Dès 50€ d'achat, on s'occupe du reste",
        },
    ];

    return (
        <section className="bg-creme px-4 md:px-16 py-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-6 md:justify-center">
                {items.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex flex-col items-center text-center gap-2 md:max-w-xs">
                        <div className="w-12 h-12 rounded-full bg-roux-clair flex items-center justify-center">
                            <Icon className="w-5 h-5 text-roux-fonce" strokeWidth={1.5} />
                        </div>
                        <p className="font-body text-body font-medium text-noir-chaud">{title}</p>
                        <p className="font-body text-body-sm text-brun-gris">{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Univers({ categories }) {
    return (
        <section className="bg-rose-poudre px-4 md:px-16 py-10 md:py-14">
            <h2 className="font-heading text-h2 text-noir-chaud text-center mb-8">Nos univers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/boutique?categorie=${category.slug}`}
                        className="bg-creme rounded-xl p-4 flex flex-col items-center gap-3"
                    >
                        <div className="w-full aspect-square bg-blanc rounded-lg overflow-hidden flex items-center justify-center">
                            {category.image ? (
                                <img
                                    src={getImageUrl(category.image)}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-brun-gris" strokeWidth={1.2} />
                            )}
                        </div>
                        <p className="font-body text-body-sm text-noir-chaud">{category.name}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function CoupsDeCoeur({ products }) {
    return (
        <section className="bg-creme px-4 md:px-16 py-10 md:py-14">
            <h2 className="font-heading text-h2 text-noir-chaud text-center mb-8">Nos coups de cœur</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
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
        </section>
    );
}

function CtaSurMesure() {
    return (
        <section className="bg-noir-chaud px-4 md:px-16 py-12 md:py-16 text-center">
            <h2 className="font-heading text-h2 text-blanc mb-2">Une envie particulière ?</h2>
            <p className="font-body text-body text-blanc/80 mb-6 max-w-md mx-auto">
                Décrivez-nous votre peluche de rêve, on la crée rien que pour vous.
            </p>
            <Link to="/sur-commande">
                <Button variant="primary">Faire une demande sur-mesure</Button>
            </Link>
        </section>
    );
}

export default function HomePage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesData, productsData] = await Promise.all([
                    getCategories(),
                    getProducts(),
                ]);
                setCategories(categoriesData);
                setProducts(productsData.slice(0, 4));
            } catch (err) {
                setError('Impossible de charger la page.');
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <AnnounceBar />
            <Header />
            <Hero />
            <Reassurance />
            {categories.length > 0 && <Univers categories={categories} />}
            {error && <p className="text-center text-red-500 py-4">{error}</p>}
            {products.length > 0 && <CoupsDeCoeur products={products} />}
            <CtaSurMesure />
            <Footer />
        </div>
    );
}