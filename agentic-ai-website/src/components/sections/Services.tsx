import { motion } from 'framer-motion';
import { Activity, Briefcase, Code, Shield } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import type { ServiceId } from '../../types';
import { SERVICE_LABELS } from '../../lib/constants';

const container = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const services = [
  {
    serviceId: 'supply-chain' as ServiceId,
    icon: Shield,
    title: 'H2-SupplyChain Guardian',
    description:
      'Lightweight multi-agent system for hydrogen production and clean energy facilities facing supply chain volatility. Monitors rare earth elements and geopolitical risks; three specialized agents provide continuous risk monitoring and mitigation recommendations.',
    features: [
      'Market Intelligence Agent',
      'Mitigation Agent with risk reports',
      'Alternative supplier recommendations',
    ],
    badge: '8-Hour MVP Available',
  },
  {
    serviceId: 'factory-orchestrator' as ServiceId,
    icon: Activity,
    title: 'Factory Orchestrator (ALOC v2.0)',
    description:
      'Comprehensive self-healing production line management that bridges equipment monitoring and global supply chain intelligence. Anomaly detection, material auditing, and autonomous dispatching powered by specialized AI agents.',
    features: ['Anomaly Detector', 'Material Auditor', 'Autonomous Dispatcher'],
    badge: '1.5-Day Implementation',
  },
  {
    serviceId: 'custom-agents' as ServiceId,
    icon: Code,
    title: 'Custom Agentic Workflows',
    description:
      'Bespoke AI workflows tailored to your domain, integrated with your systems and dashboards. Production-ready agentic workflows with reasoning logs for full transparency.',
    features: [
      'Domain-specific design',
      'System integration',
      'Custom dashboards',
    ],
    badge: 'Consultation Required',
  },
  {
    serviceId: 'consulting' as ServiceId,
    icon: Briefcase,
    title: 'AI Strategy and Consulting',
    description:
      'Strategic guidance to identify use cases, design architecture, and train teams on agentic AI. Delivers measurable outcomes and ROI-focused roadmaps.',
    features: [
      'Use case identification',
      'Architecture design',
      'Team training',
    ],
    badge: 'Flexible Engagement',
  },
];

interface ServicesProps {
  selectedServices: ServiceId[];
  onToggle: (id: ServiceId) => void;
}

export function Services({ selectedServices, onToggle }: ServicesProps) {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={container}
          className="mb-16"
        >
          <motion.span
            variants={item}
            className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4"
          >
            Our Services
          </motion.span>
          <motion.h2
            variants={item}
            className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4"
          >
            What We Offer
          </motion.h2>
          <motion.p variants={item} className="text-xl text-muted-foreground max-w-2xl">
            Lightweight, trustworthy AI systems that deliver immediate value. Explore our flagship solutions—H2-SupplyChain Guardian and Factory Orchestrator—and choose what fits your operational needs.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((s) => (
            <motion.div key={s.serviceId} variants={item}>
              <ServiceCard
                icon={s.icon}
                title={s.title}
                description={s.description}
                features={s.features}
                badge={s.badge}
                serviceId={s.serviceId}
                isSelected={selectedServices.includes(s.serviceId)}
                onToggle={onToggle}
                detailHref={
                  s.serviceId === 'supply-chain'
                    ? '/services/h2-supplychain-guardian'
                    : s.serviceId === 'factory-orchestrator'
                      ? '/services/factory-orchestrator'
                      : s.serviceId === 'custom-agents'
                        ? '/services/custom-agentic-workflows'
                        : s.serviceId === 'consulting'
                          ? '/services/ai-strategy-consulting'
                          : undefined
                }
              />
            </motion.div>
          ))}
        </motion.div>

        {selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5"
          >
            <p className="text-sm text-muted-foreground mb-2">Selected services:</p>
            <p className="font-semibold text-foreground mb-4">
              {selectedServices.map((id) => SERVICE_LABELS[id]).join(', ')}
            </p>
            <button
              type="button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-2"
            >
              Scroll to contact form →
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
