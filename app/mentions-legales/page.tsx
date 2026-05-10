import Link from "next/link";
import AnimatedBackground from "../../components/AnimatedBackground";
import GlassCard from "../../components/GlassCard";
import GradientText from "../../components/GradientText";

export const metadata = {
  title: "Mentions légales — Fideloo",
  description: "Mentions légales du service Fideloo.",
};

export default function MentionsLegales() {
  return (
    <div className="relative min-h-screen px-4 sm:px-6 py-16">
      <AnimatedBackground />
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-text-muted hover:text-text-main transition-colors">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="heading-display text-4xl sm:text-5xl mt-6 mb-8">
          <GradientText>Mentions légales</GradientText>
        </h1>

        <GlassCard variant="strong" className="p-8 space-y-6 text-text-main">
          <Section title="Éditeur du site">
            <p>Nathan Rolhion</p>
            <p className="text-text-muted text-sm">[Adresse à compléter]</p>
            <p className="text-text-muted text-sm">Numéro SIRET : [À COMPLÉTER]</p>
          </Section>

          <Section title="Directeur de publication">
            <p>Nathan Rolhion</p>
          </Section>

          <Section title="Hébergeur">
            <p>Vercel Inc.</p>
            <p className="text-text-muted text-sm">340 Pine Street, San Francisco, CA 94104, USA</p>
            <p className="text-text-muted text-sm">https://vercel.com</p>
          </Section>

          <Section title="Hébergement backend">
            <p>Render Services Inc.</p>
            <p className="text-text-muted text-sm">San Francisco, CA, USA</p>
            <p className="text-text-muted text-sm">https://render.com</p>
          </Section>

          <Section title="Contact">
            <p>
              Pour toute question ou demande relative à Fideloo :{" "}
              <a href="mailto:contact@fideloo.fr" className="text-[#A78BFA] hover:text-white transition-colors">
                contact@fideloo.fr
              </a>
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p className="text-text-muted">
              L&apos;ensemble des éléments du site Fideloo (textes, graphismes, logos, code) est protégé par le droit
              de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
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
