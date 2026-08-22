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

export default function CGVPage() {
    return (
        <div>
            <AnnounceBar />
            <Header />

            <section className="bg-rose-poudre px-4 md:px-16 py-14 md:py-20 text-center">
                <h1 className="font-heading text-h1 text-noir-chaud">Conditions Générales de Vente</h1>
            </section>

            <section className="bg-creme px-4 md:px-16 py-14 md:py-20">
                <div className="max-w-2xl mx-auto flex flex-col gap-10">
                    <Section title="1. Champ d'application">
                        <p>
                            Les présentes conditions générales de vente régissent les relations
                            contractuelles entre <strong>[Nom de la société / auto-entreprise à compléter]</strong>,
                            éditeur du site Maille &amp; Câlins, et toute personne effectuant un achat via le
                            site. Toute commande passée sur le site implique l'acceptation sans réserve des
                            présentes CGV.
                        </p>
                    </Section>

                    <Section title="2. Produits">
                        <p>
                            Les produits proposés sont des créations en crochet et tricot faites main. Chaque
                            pièce étant réalisée manuellement, de légères variations d'aspect (couleur,
                            texture, finitions) peuvent exister par rapport aux photos présentées, sans que
                            cela ne constitue un défaut.
                        </p>
                        <p>
                            Les créations sur mesure (rubrique « Sur Commande ») sont réalisées spécifiquement
                            selon les demandes du client après validation des modalités (délai, prix, détails
                            du modèle).
                        </p>
                    </Section>

                    <Section title="3. Prix">
                        <p>
                            Les prix sont indiqués en euros, toutes taxes comprises (TTC). Les frais de
                            livraison sont précisés avant la validation de la commande ; la livraison est
                            offerte dès 50€ d'achat.
                        </p>
                    </Section>

                    <Section title="4. Commande">
                        <p>
                            La commande est validée après confirmation du panier, choix de l'adresse de
                            livraison et paiement. Un email de confirmation récapitulant la commande est
                            envoyé au client à réception de son paiement.
                        </p>
                    </Section>

                    <Section title="5. Paiement">
                        <p>
                            Le paiement s'effectue en ligne au moment de la commande, par les moyens proposés
                            sur le site. La commande n'est considérée comme définitive qu'après confirmation
                            du paiement.
                        </p>
                    </Section>

                    <Section title="6. Livraison">
                        <p>
                            Les créations sont expédiées sous 3 à 5 jours ouvrés après validation de la
                            commande (délai pouvant être allongé pour les créations sur mesure). La livraison
                            est assurée en France métropolitaine.
                        </p>
                    </Section>

                    <Section title="7. Droit de rétractation">
                        <p>
                            Conformément à l'article L221-18 du Code de la consommation, le client dispose
                            d'un délai de 14 jours à compter de la réception de sa commande pour exercer son
                            droit de rétractation, sans avoir à justifier de motif.
                        </p>
                        <p>
                            Conformément à l'article L221-28 du Code de la consommation, ce droit de
                            rétractation ne s'applique pas aux créations personnalisées ou confectionnées sur
                            mesure selon les spécifications du client (rubrique « Sur Commande »).
                        </p>
                    </Section>

                    <Section title="8. Garanties">
                        <p>
                            Tous les produits bénéficient de la garantie légale de conformité et de la
                            garantie contre les vices cachés, conformément aux dispositions du Code civil et
                            du Code de la consommation.
                        </p>
                    </Section>

                    <Section title="9. Responsabilité">
                        <p>
                            <strong>[Nom de la société / auto-entreprise à compléter]</strong> ne saurait être
                            tenue responsable des dommages résultant d'une mauvaise utilisation des produits
                            achetés ou d'un usage non conforme aux préconisations d'entretien indiquées sur
                            les fiches produits.
                        </p>
                    </Section>

                    <Section title="10. Droit applicable et litiges">
                        <p>
                            Les présentes CGV sont soumises au droit français. En cas de litige, le client est
                            invité à contacter le service client avant toute action judiciaire. À défaut de
                            résolution amiable, les tribunaux français seront seuls compétents.
                        </p>
                    </Section>
                </div>
            </section>

            <Footer />
        </div>
    );
}