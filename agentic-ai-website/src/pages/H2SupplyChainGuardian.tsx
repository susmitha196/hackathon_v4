import { Link } from 'wouter';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import { Shield, ArrowLeft } from 'lucide-react';

export function H2SupplyChainGuardian() {
  return (
    <>
      <BackgroundEffects />
      <Header />
      <main id="main" className="min-h-screen">
        <article className="container mx-auto px-6 py-16 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Shield className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <span className="text-sm font-medium text-primary">Our Services</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                H2-SupplyChain Guardian
              </h1>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            A lightweight multi-agent system designed specifically for hydrogen production and clean energy facilities facing supply chain volatility. Three specialized agents work in concert to provide continuous risk monitoring and mitigation recommendations.
          </p>

          <section className="space-y-10">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Market Intelligence Agent
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Monitors global commodity markets, geopolitical events, and industry news sources to identify potential disruptions affecting rare earth elements (neodymium, dysprosium, praseodymium) and other critical components. Uses natural language processing to extract relevant signals from news feeds, trade publications, and government announcements, scoring each event by potential impact severity and likelihood.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Mitigation Agent
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cross-references external risk signals with your facility&apos;s internal bill of materials (BOM) and project schedules. When a high-risk event is detected (e.g., export restrictions on neodymium), the agent reasons through potential impacts on specific projects and equipment, generating a risk report with Red/Yellow/Green severity classification. Provides specific mitigation recommendations: alternative supplier suggestions, material substitution options, and inventory buffer strategies.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Notification Agent
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Delivers risk reports to relevant stakeholders via email, Slack, or SMS based on severity level and user preferences. High-severity (Red) alerts trigger immediate notifications to procurement managers and operations directors; medium-severity (Yellow) alerts are batched into daily digest emails.
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-2">
                8-Hour MVP
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The 8-hour MVP includes configuration of monitoring parameters, integration with one data source (e.g., company BOM spreadsheet), and deployment of the three-agent system with a basic dashboard for viewing risk reports. Deployed as a cloud-hosted service with webhook integrations to your ERP or procurement systems.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Get in touch for a demo
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
