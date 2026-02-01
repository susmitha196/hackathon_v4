import { Link } from 'wouter';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import { Activity, ArrowLeft } from 'lucide-react';

export function FactoryOrchestrator() {
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
              <Activity className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <span className="text-sm font-medium text-primary">Our Services</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                Factory Orchestrator (ALOC v2.0)
              </h1>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            A comprehensive self-healing production line management system that bridges the gap between physical equipment monitoring and global supply chain intelligence. Three core modules—each powered by specialized AI agents—deliver anomaly detection, material auditing, and autonomous dispatching.
          </p>

          <section className="space-y-10">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Anomaly Detector
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ingests real-time telemetry from production equipment via sensor networks or existing SCADA systems. Monitored parameters include RPM, temperature, vibration, pressure, and power consumption. Uses statistical process control and machine learning models to detect deviations from normal operating parameters. When a threshold is breached (e.g., bearing temperature exceeds 90°C), the system automatically sends a JSON payload to an n8n webhook, triggering the downstream workflow.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Material Auditor
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Receives anomaly alerts and performs intelligent root cause analysis. The agent queries your facility&apos;s bill of materials database to identify which components are affected by the failing equipment. If the component contains rare earth elements or other high-risk materials, the agent escalates the alert and initiates a supply chain risk assessment. Uses reasoning capabilities to evaluate current inventory levels, lead times from primary suppliers, geopolitical risks affecting material availability, and alternative sourcing options.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-foreground mb-3">
                Autonomous Dispatcher
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Executes procurement and maintenance actions based on the Material Auditor&apos;s recommendations. For high-confidence scenarios (e.g., a bearing failure with clear replacement part and available inventory), the system can autonomously generate a purchase order or work order. For complex scenarios requiring human judgment, the system prepares a decision package with recommended actions and notifies the appropriate personnel via Slack or email.
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-2">
                1.5-Day Implementation
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Includes installation of the sensor-to-webhook pipeline, integration with your BOM and inventory systems, configuration of the three agent modules, and deployment of a Streamlit dashboard for monitoring system status and reviewing agent reasoning logs.
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
