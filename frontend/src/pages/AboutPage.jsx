import { HandHeart, Sparkles, Truck } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Button from '../components/Button.jsx';
import { Link } from 'react-router-dom';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

function Intro() {
    return (
        <section className="bg-rose-poudre px-4 md:px-16 py-14 md:py-20 text-center">
            <p className="font-body text-body-sm text-roux-fonce mb-3">Notre histoire</p>
            <h1 className="font-heading text-h1 text-noir-chaud max-w-2xl mx-auto mb-4">
                Des créations cousues main, à Clermont-Ferrand
            </h1>
            <p className="font-body text-body-lg text-brun-gris max-w-xl mx-auto">
                Maille &amp; Câlins est née d'une passion pour le crochet et l'envie de créer des
                compagnons doux, uniques et pleins de caractère.
            </p>
        </section>
    );
}

function Story() {
    return (
        <section className="bg-creme px-4 md:px-16 py-14 md:py-20">
            <div className="max-w-2xl mx-auto flex flex-col gap-5">
                <h2 className="font-heading text-h2 text-noir-chaud">Notre atelier</h2>
                <p className="font-body text-body text-noir-chaud">
                    Chaque peluche est imaginée et crochetée à la main, fil après fil, dans notre
                    atelier à Clermont-Ferrand. Nous prenons le temps de choisir des matières douces
                    et sûres, pensées pour durer et pour être aimées longtemps.
                </p>
                <p className="font-body text-body text-noir-chaud">
                    Parce qu'aucune pièce ne ressemble vraiment à une autre, chaque création porte sa
                    propre petite personnalité. C'est ce qui rend chaque commande unique : la vôtre
                    n'existera nulle part ailleurs.
                </p>
                <p className="font-body text-body text-noir-chaud">
                    Envie d'un modèle particulier, d'une couleur précise ou d'une taille sur mesure ?
                    Nous créons aussi des pièces personnalisées, rien que pour vous.
                </p>
                <Link to="/sur-commande" className="mt-2 self-start">
                    <Button variant="secondary">Faire une demande sur-mesure</Button>
                </Link>
            </div>
        </section>
    );
}

function Values() {
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
        <section className="bg-rose-poudre px-4 md:px-16 py-14 md:py-20">
            <h2 className="font-heading text-h2 text-noir-chaud text-center mb-10">Nos valeurs</h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-6 md:justify-center">
                {items.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex flex-col items-center text-center gap-2 md:max-w-xs">
                        <div className="w-12 h-12 rounded-full bg-blanc flex items-center justify-center">
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

function CtaSurMesure() {
    return (
        <section className="bg-noir-chaud px-4 md:px-16 py-12 md:py-16 text-center">
            <h2 className="font-heading text-h2 text-blanc mb-2">Une envie particulière ?</h2>
            <p className="font-body text-body text-blanc/80 mb-6 max-w-md mx-auto">
                Décrivez-nous votre peluche de rêve, on la crée rien que pour vous.
            </p>
            <Link to="/contact">
                <Button variant="primary">Nous contacter</Button>
            </Link>
        </section>
    );
}

export default function AboutPage() {
    return (
        <div>
            <AnnounceBar />
            <Header />
            <Intro />
            <Story />
            <Values />
            <CtaSurMesure />
            <Footer />
        </div>
    );
}