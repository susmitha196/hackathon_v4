import { Link } from 'wouter';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import { Briefcase, ArrowLeft } from 'lucide-react';

export function AIStrategyConsulting() {
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
              <Briefcase className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <span className="text-sm font-medium text-primary">Our Services</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                AI Strategy and Consulting
              </h1>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Strategic guidance to identify use cases, design architecture, and train teams on agentic AI. We deliver measurable outcomes and ROI-focused roadmaps so you can adopt AI with confidence—without the hype or lengthy pilots.
          </p>

          <section className="space-y-10">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Use case identification
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We work with your operations, procurement, and IT teams to pinpoint where agentic AI will have the highest impact. We assess pain points—reactive operations, fragmented intelligence, supply chain blindness—and map them to solutions such as H2-SupplyChain Guardian or Factory Orchestrator. You get a prioritized list of use cases with rough effort and ROI so you can decide what to build first.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Architecture design
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We design the technical and operational architecture for your agentic workflows: how agents connect to your data sources (ERP, SCADA, BOM), how they coordinate via n8n or LangChain, and how reasoning logs and dashboards fit into your existing tools. The result is a clear blueprint for implementation—whether you build in-house, with us, or with a partner—so you avoid costly rework later.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Team training
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We train your teams on agentic AI concepts, tooling, and governance. Topics include how agents reason and act, how to read and use reasoning logs, how to integrate workflows with your systems, and how to set guardrails and review cycles. Training is tailored to roles—operations, procurement, IT—so everyone can contribute to and trust the new systems.
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-2">
                Flexible engagement
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Engagements can be short (e.g., a strategy workshop and use case roadmap) or ongoing (e.g., architecture oversight and team training through implementation). We offer fixed-scope deliverables and time-and-materials support so you can scale up or down as needed. Typical starting point is a discovery call and a lightweight assessment, then a proposal for the next steps.
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
