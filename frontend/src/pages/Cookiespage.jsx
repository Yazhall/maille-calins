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

export default function CookiesPage() {
    return (
        <div>
            <AnnounceBar />
            <Header />

            <section className="bg-rose-poudre px-4 md:px-16 py-14 md:py-20 text-center">
                <h1 className="font-heading text-h1 text-noir-chaud">Politique de cookies</h1>
            </section>

            <section className="bg-creme px-4 md:px-16 py-14 md:py-20">
                <div className="max-w-2xl mx-auto flex flex-col gap-10">
                    <Section title="1. Qu'est-ce qu'un cookie ?">
                        <p>
                            Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur,
                            tablette, mobile) lors de votre navigation sur un site internet. Il permet au
                            site de mémoriser des informations vous concernant, notamment pour assurer son
                            bon fonctionnement.
                        </p>
                    </Section>

                    <Section title="2. Les cookies utilisés sur Maille & Câlins">
                        <p>
                            Le site n'utilise que des cookies <strong>strictement nécessaires</strong> à son
                            fonctionnement. Aucun cookie publicitaire, de mesure d'audience ou de traçage tiers
                            n'est déposé à ce jour.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-brun-gris/20">
                                    <th className="py-2 pr-4 font-body text-body-sm font-medium text-roux-fonce">
                                        Cookie
                                    </th>
                                    <th className="py-2 pr-4 font-body text-body-sm font-medium text-roux-fonce">
                                        Finalité
                                    </th>
                                    <th className="py-2 font-body text-body-sm font-medium text-roux-fonce">
                                        Durée
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="border-b border-brun-gris/10">
                                    <td className="py-2 pr-4 font-body text-body-sm">Jeton de session (JWT)</td>
                                    <td className="py-2 pr-4 font-body text-body-sm">
                                        Maintenir votre connexion à votre compte
                                    </td>
                                    <td className="py-2 font-body text-body-sm">Durée de la session</td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 font-body text-body-sm">Panier</td>
                                    <td className="py-2 pr-4 font-body text-body-sm">
                                        Conserver le contenu de votre panier entre deux visites
                                    </td>
                                    <td className="py-2 font-body text-body-sm">30 jours</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="3. Cookies strictement nécessaires">
                        <p>
                            Ces cookies étant indispensables au fonctionnement du site (connexion, panier),
                            ils ne nécessitent pas de consentement préalable conformément à la réglementation
                            en vigueur, et ne peuvent pas être désactivés depuis le site.
                        </p>
                    </Section>

                    <Section title="4. Gérer les cookies depuis votre navigateur">
                        <p>
                            Vous pouvez à tout moment configurer votre navigateur pour refuser ou supprimer
                            les cookies. Attention : la désactivation des cookies nécessaires peut empêcher le
                            bon fonctionnement du site (connexion, panier).
                        </p>
                        <ul className="list-disc list-inside flex flex-col gap-1">
                            <li>Chrome : Paramètres → Confidentialité et sécurité → Cookies</li>
                            <li>Firefox : Paramètres → Vie privée et sécurité</li>
                            <li>Safari : Préférences → Confidentialité</li>
                        </ul>
                    </Section>

                    <Section title="5. Évolution de cette politique">
                        <p>
                            Si le site venait à utiliser de nouveaux cookies (mesure d'audience, cookies
                            publicitaires), un bandeau de consentement serait mis en place conformément à la
                            réglementation, et cette page serait mise à jour en conséquence.
                        </p>
                    </Section>

                    <Section title="6. Contact">
                        <p>
                            Pour toute question relative à notre utilisation des cookies, contactez-nous à{' '}
                            <strong>contact@mailleetcalins.fr</strong>.
                        </p>
                    </Section>
                </div>
            </section>

            <Footer />
        </div>
    );
}