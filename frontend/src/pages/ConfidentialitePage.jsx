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

export default function ConfidentialitePage() {
    return (
        <div>
            <AnnounceBar />
            <Header />

            <section className="bg-rose-poudre px-4 md:px-16 py-14 md:py-20 text-center">
                <h1 className="font-heading text-h1 text-noir-chaud">Politique de confidentialité</h1>
            </section>

            <section className="bg-creme px-4 md:px-16 py-14 md:py-20">
                <div className="max-w-2xl mx-auto flex flex-col gap-10">
                    <Section title="1. Responsable du traitement">
                        <p>
                            Le responsable du traitement des données personnelles collectées sur le site
                            Maille &amp; Câlins est <strong>[Nom de la société / auto-entreprise à compléter]</strong>,
                            joignable à l'adresse <strong>contact@mailleetcalins.fr</strong>.
                        </p>
                    </Section>

                    <Section title="2. Données collectées">
                        <p>Selon votre utilisation du site, nous collectons les données suivantes :</p>
                        <ul className="list-disc list-inside flex flex-col gap-1">
                            <li>Nom, prénom, email, téléphone (création de compte)</li>
                            <li>Adresses de livraison et de facturation</li>
                            <li>Historique des commandes et des paiements</li>
                            <li>Avis laissés sur les produits achetés</li>
                            <li>Contenu des messages envoyés via le formulaire de contact</li>
                        </ul>
                    </Section>

                    <Section title="3. Finalités du traitement">
                        <p>Ces données sont utilisées pour :</p>
                        <ul className="list-disc list-inside flex flex-col gap-1">
                            <li>Gérer votre compte client et vos commandes</li>
                            <li>Assurer la livraison des produits</li>
                            <li>Répondre à vos demandes via le formulaire de contact</li>
                            <li>Vous envoyer, si vous y avez consenti, notre newsletter</li>
                            <li>Respecter nos obligations légales et comptables</li>
                        </ul>
                    </Section>

                    <Section title="4. Base légale">
                        <p>
                            Le traitement de vos données repose sur l'exécution du contrat de vente (gestion
                            de commande, livraison), sur votre consentement (newsletter) ou sur le respect
                            d'obligations légales (facturation, comptabilité).
                        </p>
                    </Section>

                    <Section title="5. Durée de conservation">
                        <p>
                            Les données liées à votre compte sont conservées pendant toute la durée de la
                            relation commerciale, puis archivées conformément aux durées légales de
                            conservation (notamment 10 ans pour les documents comptables). Les données de
                            prospection (newsletter) sont conservées 3 ans à compter du dernier contact.
                        </p>
                    </Section>

                    <Section title="6. Destinataires des données">
                        <p>
                            Vos données ne sont ni vendues ni cédées à des tiers. Elles peuvent être transmises
                            à nos prestataires techniques strictement nécessaires au fonctionnement du site
                            (hébergement, envoi d'emails, traitement des paiements), soumis à une obligation de
                            confidentialité.
                        </p>
                    </Section>

                    <Section title="7. Vos droits">
                        <p>
                            Conformément au RGPD, vous disposez des droits suivants sur vos données
                            personnelles : droit d'accès, de rectification, d'effacement, de limitation du
                            traitement, de portabilité et d'opposition.
                        </p>
                        <p>
                            Pour exercer ces droits, contactez-nous à{' '}
                            <strong>contact@mailleetcalins.fr</strong>. Une réponse vous sera apportée sous 30
                            jours.
                        </p>
                        <p>
                            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
                            réclamation auprès de la CNIL (
                            <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-roux-principal underline">
                                www.cnil.fr
                            </a>
                            ).
                        </p>
                    </Section>

                    <Section title="8. Sécurité">
                        <p>
                            Nous mettons en œuvre des mesures techniques et organisationnelles adaptées
                            (chiffrement des mots de passe, connexions sécurisées) pour protéger vos données
                            contre tout accès, perte ou divulgation non autorisés.
                        </p>
                    </Section>

                    <Section title="9. Cookies">
                        <p>
                            Le site utilise uniquement des cookies techniques indispensables à son
                            fonctionnement (maintien de votre session, contenu du panier). Aucun cookie
                            publicitaire ou de suivi tiers n'est déposé. Pour plus de détails, consultez notre{' '}
                            page dédiée aux cookies.
                        </p>
                    </Section>
                </div>
            </section>

            <Footer />
        </div>
    );
}