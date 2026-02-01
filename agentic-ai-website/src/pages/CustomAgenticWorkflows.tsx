import { Link } from 'wouter';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import { Code, ArrowLeft } from 'lucide-react';

export function CustomAgenticWorkflows() {
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
              <Code className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <span className="text-sm font-medium text-primary">Our Services</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                Custom Agentic Workflows
              </h1>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Bespoke AI workflows tailored to your domain, integrated with your systems and dashboards. Production-ready agentic workflows with full reasoning logs for transparency—designed for your specific use cases rather than off-the-shelf solutions.
          </p>

          <section className="space-y-10">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Domain-specific design
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We design agentic workflows around your industry, terminology, and business rules. Whether you operate in hydrogen, clean energy, advanced manufacturing, or chemical processing, the agents are configured with your domain logic, data sources, and decision criteria so that recommendations and actions align with how you work.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                System integration
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Workflows connect to your existing systems—ERP, SCADA, BOM and inventory databases, email, Slack, and internal APIs. We use n8n and LangChain for orchestration, webhooks, and tool use so that agents read from and write to your stack without requiring a full rip-and-replace. Integration is incremental and secure.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Custom dashboards
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You get dashboards built for your workflows: agent status, reasoning logs, and key metrics in one place. Deployed on Vercel or Streamlit, they give operations and procurement teams visibility into what the agents are doing and why, supporting trust and oversight without needing to dig into raw logs.
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-2">
                Consultation required
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Custom agentic workflows are scoped and priced per engagement. We start with a discovery call to understand your use cases, data, and integration needs, then propose an architecture and timeline. Typical engagements range from proof-of-concept workflows to full production deployments with ongoing support.
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
