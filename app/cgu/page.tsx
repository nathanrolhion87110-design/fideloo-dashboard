import Link from "next/link";
import AnimatedBackground from "../../components/AnimatedBackground";
import GlassCard from "../../components/GlassCard";
import GradientText from "../../components/GradientText";

export const metadata = {
  title: "Conditions Générales d'Utilisation — Fideloo",
  description: "Conditions Générales d'Utilisation du service Fideloo.",
};

export default function CGU() {
  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-16">
      <AnimatedBackground />
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-text-muted hover:text-text-main transition-colors">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="heading-display text-4xl sm:text-5xl mt-6 mb-8">
          <GradientText>Conditions Générales d&apos;Utilisation</GradientText>
        </h1>

        <GlassCard variant="strong" className="p-8 space-y-6 text-text-main">
          <Section title="Article 1 — Objet">
            <p className="text-text-muted">
              Fideloo est un service SaaS (Software as a Service) édité par Nathan Rolhion, permettant aux commerçants
              de créer et gérer une carte de fidélité digitale ajoutable dans Apple Wallet et Google Wallet.
              Les présentes Conditions Générales d&apos;Utilisation régissent l&apos;accès et l&apos;utilisation du service.
            </p>
          </Section>

          <Section title="Article 2 — Accès au service">
            <p className="text-text-muted">
              L&apos;inscription est requise pour accéder au tableau de bord. Un (1) compte est attribué par commerçant.
              L&apos;utilisateur s&apos;engage à fournir des informations exactes et à conserver ses identifiants confidentiels.
            </p>
          </Section>

          <Section title="Article 3 — Plan Gratuit">
            <p className="text-text-muted">
              Le Plan Gratuit permet de gérer <span className="text-text-main">jusqu&apos;à 50 clients</span> pour un (1) commerce,
              sans engagement. Au-delà, le Plan Pro est requis.
            </p>
          </Section>

          <Section title="Article 4 — Plan Pro">
            <p className="text-text-muted">
              Le Plan Pro est facturé <span className="text-text-main">70 € TTC par mois</span>. Il offre des clients illimités,
              le multi-commerce, les notifications push, les analytics avancés et un support prioritaire.
              <br />
              Sans engagement, résiliable à tout moment depuis l&apos;onglet Abonnement des paramètres.
            </p>
          </Section>

          <Section title="Article 5 — Paiement">
            <p className="text-text-muted">
              Le paiement est traité par <span className="text-text-main">Stripe Payments Europe Ltd</span>.
              Le prélèvement est mensuel et automatique. Aucune donnée bancaire n&apos;est stockée par Fideloo.
              En cas d&apos;échec de paiement, le compte repasse automatiquement en Plan Gratuit.
            </p>
          </Section>

          <Section title="Article 6 — Données personnelles">
            <p className="text-text-muted">
              Le traitement des données est régi par notre{" "}
              <Link href="/politique-confidentialite" style={{ color: "var(--violet)" }} className="hover:text-white">Politique de confidentialité</Link>{" "}
              conforme au RGPD.
            </p>
          </Section>

          <Section title="Article 7 — Responsabilité">
            <p className="text-text-muted">
              Fideloo met tout en œuvre pour garantir la disponibilité du service mais n&apos;est pas responsable
              des données clients renseignées par les commerçants ni de l&apos;usage qu&apos;ils en font.
              Le commerçant est responsable du respect du RGPD vis-à-vis de ses propres clients.
            </p>
          </Section>

          <Section title="Article 8 — Résiliation">
            <p className="text-text-muted">
              L&apos;abonnement Pro peut être résilié à tout moment depuis l&apos;onglet Abonnement des paramètres
              ou via le portail Stripe. La résiliation prend effet à la fin de la période en cours.
              Le commerçant peut également supprimer son compte à tout moment ; les données seront effacées
              conformément à la politique de confidentialité.
            </p>
          </Section>

          <Section title="Article 9 — Droit applicable">
            <p className="text-text-muted">
              Les présentes CGU sont régies par le <span className="text-text-main">droit français</span>.
              En cas de litige, et après tentative de résolution amiable, le tribunal compétent sera celui de
              <span className="text-text-main"> Limoges</span>.
            </p>
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
