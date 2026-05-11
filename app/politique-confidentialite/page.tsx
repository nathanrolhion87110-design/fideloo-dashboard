import Link from "next/link";
import AnimatedBackground from "../../components/AnimatedBackground";
import GlassCard from "../../components/GlassCard";
import GradientText from "../../components/GradientText";

export const metadata = {
  title: "Politique de confidentialité — Fideloo",
  description: "Comment Fideloo collecte, utilise et protège vos données personnelles (RGPD).",
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-16">
      <AnimatedBackground />
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-text-muted hover:text-text-main transition-colors">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="heading-display text-4xl sm:text-5xl mt-6 mb-4">
          <GradientText>Politique de confidentialité</GradientText>
        </h1>
        <p className="text-text-muted mb-8">
          Conforme au Règlement Général sur la Protection des Données (RGPD).
        </p>

        <GlassCard variant="strong" className="p-8 space-y-6 text-text-main">
          <Section title="1. Responsable du traitement">
            <p>Nathan Rolhion — <a href="mailto:contact@fideloo.fr" className="text-[#C9A84C] hover:text-white">contact@fideloo.fr</a></p>
          </Section>

          <Section title="2. Données collectées">
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li><span className="text-text-main">Comptes commerçants</span> : email, mot de passe (haché bcrypt), nom et type de commerce, identifiant Google ou Apple si OAuth.</li>
              <li><span className="text-text-main">Clients fidélité</span> : prénom/nom, email, date d&apos;anniversaire (optionnelle), points cumulés, historique des transactions.</li>
              <li><span className="text-text-main">Données techniques</span> : adresse IP, user-agent (logs serveur), strictement à des fins de sécurité et de prévention des abus.</li>
            </ul>
          </Section>

          <Section title="3. Finalités du traitement">
            <p className="text-text-muted">
              Les données sont collectées dans le seul but de fournir le service de carte de fidélité digitale :
              création et gestion du compte commerçant, génération et mise à jour des cartes Apple Wallet / Google Wallet,
              suivi des points et envoi de notifications de fidélité.
            </p>
          </Section>

          <Section title="4. Base légale">
            <p className="text-text-muted">
              Le traitement repose sur l&apos;<span className="text-text-main">exécution du contrat</span> (CGU) pour les commerçants
              et sur le <span className="text-text-main">consentement explicite</span> pour les clients qui s&apos;inscrivent à un programme de fidélité.
            </p>
          </Section>

          <Section title="5. Durée de conservation">
            <p className="text-text-muted">
              Les données sont conservées <span className="text-text-main">3 ans à compter de la dernière activité</span> (dernière transaction
              ou connexion). Au-delà, elles sont anonymisées ou supprimées.
            </p>
          </Section>

          <Section title="6. Vos droits">
            <p className="text-text-muted mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>Droit d&apos;accès</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
            <p className="text-text-muted mt-2">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@fideloo.fr" className="text-[#C9A84C] hover:text-white">contact@fideloo.fr</a>.
              Vous pouvez également déposer une réclamation auprès de la CNIL (cnil.fr).
            </p>
          </Section>

          <Section title="7. Hébergement">
            <p className="text-text-muted">
              Frontend hébergé par <span className="text-text-main">Vercel Inc.</span> (États-Unis), backend par
              <span className="text-text-main"> Render Services Inc.</span> (États-Unis), base de données par
              <span className="text-text-main"> Supabase Inc.</span> (Union Européenne — région Frankfurt).
              Les transferts éventuels hors UE sont encadrés par les clauses contractuelles types de la Commission européenne.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p className="text-text-muted">
              Fideloo n&apos;utilise <span className="text-text-main">aucun cookie de tracking ni de publicité</span>.
              Seuls des cookies fonctionnels strictement nécessaires (session, authentification) sont stockés
              localement dans votre navigateur (localStorage) pour vous permettre de rester connecté.
            </p>
          </Section>

          <Section title="9. Délégué à la Protection des Données (DPO)">
            <p>Nathan Rolhion — <a href="mailto:contact@fideloo.fr" className="text-[#C9A84C] hover:text-white">contact@fideloo.fr</a></p>
          </Section>
        </GlassCard>

        <p className="mt-8 text-sm text-text-muted text-center">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold mb-2 text-text-main">{title}</h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}
