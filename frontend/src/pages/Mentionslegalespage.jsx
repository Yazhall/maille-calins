import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function AnnounceBar() {
    return (
        <div className="bg-noir-chaud text-blanc text-center py-2 px-4">
            <p className="font-body text-body-sm">✦ Livraison offerte dès 50€ ✦</p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="flex flex-col gap-3">
            <h2 className="font-heading text-h3 text-noir-chaud">{title}</h2>
            <div className="font-body text-body text-noir-chaud flex flex-col gap-3">{children}</div>
        </div>
    );
}

export default function MentionsLegalesPage() {
    return (
        <div>
            <AnnounceBar />
            <Header />

            <section className="bg-rose-poudre px-4 md:px-16 py-14 md:py-20 text-center">
                <h1 className="font-heading text-h1 text-noir-chaud">Mentions légales</h1>
            </section>

            <section className="bg-creme px-4 md:px-16 py-14 md:py-20">
                <div className="max-w-2xl mx-auto flex flex-col gap-10">
                    <Section title="Éditeur du site">
                        <p>
                            Le site Maille &amp; Câlins est édité par{' '}
                            <strong>[Nom de la société / auto-entreprise à compléter]</strong>, entreprise
                            individuelle immatriculée sous le numéro SIRET{' '}
                            <strong>[Numéro SIRET à compléter]</strong>, dont le siège est situé à{' '}
                            <strong>[Adresse complète à compléter]</strong>, Clermont-Ferrand, France.
                        </p>
                        <p>
                            Contact : <strong>contact@mailleetcalins.fr</strong>
                        </p>
                    </Section>

                    <Section title="Directeur de la publication">
                        <p>Le directeur de la publication du site est [Nom du responsable à compléter].</p>
                    </Section>

                    <Section title="Hébergement">
                        <p>
                            Le site est hébergé par <strong>[Nom de l'hébergeur à compléter — ex. Hetzner, Scaleway]</strong>,{' '}
                            dont le siège social est situé à <strong>[Adresse de l'hébergeur à compléter]</strong>.
                        </p>
                    </Section>

                    <Section title="Propriété intellectuelle">
                        <p>
                            L'ensemble des contenus présents sur le site Maille &amp; Câlins (textes, images,
                            photographies, logo, mise en page) est protégé par le droit d'auteur. Toute
                            reproduction, représentation, modification ou exploitation, totale ou partielle,
                            sans autorisation préalable écrite est interdite.
                        </p>
                    </Section>

                    <Section title="Données personnelles">
                        <p>
                            Les informations recueillies lors de la création d'un compte ou d'une commande
                            (nom, prénom, email, adresse, téléphone) sont nécessaires à la gestion de la
                            relation commerciale et ne sont ni cédées ni vendues à des tiers.
                        </p>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données (RGPD), vous
                            disposez d'un droit d'accès, de rectification et de suppression des données vous
                            concernant. Pour l'exercer, contactez-nous à l'adresse indiquée ci-dessus.
                        </p>
                    </Section>

                    <Section title="Cookies">
                        <p>
                            Le site utilise des cookies techniques nécessaires à son bon fonctionnement
                            (panier, session de connexion). Aucun cookie publicitaire ou de traçage tiers
                            n'est utilisé à ce jour.
                        </p>
                    </Section>

                    <Section title="Droit applicable">
                        <p>
                            Les présentes mentions légales sont soumises au droit français. En cas de litige,
                            les tribunaux français seront seuls compétents.
                        </p>
                    </Section>
                </div>
            </section>

            <Footer />
        </div>
    );
}