import { motion } from 'framer-motion';
import { Clock, Target, Brain } from 'lucide-react';

const values = [
  {
    icon: Clock,
    headline: 'Rapid Development',
    description:
      'Build confidence through speed and proven frameworks. Sophisticated AI systems deployed in hours, not months—8-hour MVP and 1.5-day implementation timelines prominently featured. Immediate proof of concept rather than lengthy pilot programs.',
  },
  {
    icon: Target,
    headline: 'ROI-Focused',
    description:
      'Transform anxiety into agency through measurable outcomes. Relentless focus on business metrics—downtime reduction, cost savings, risk mitigation—with quantifiable results and ROI timelines from day one.',
  },
  {
    icon: Brain,
    headline: 'Reasoning-Based AI',
    description:
      'Eliminate black-box AI through reasoning-based decision logs. Agentic systems explain their decisions through natural language reasoning logs, making AI actions auditable and trustworthy. Transparent logic to build trust with stakeholders.',
  },
];

const container = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={container}
          className="mb-16"
        >
          <motion.span
            variants={item}
            className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            variants={item}
            className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4"
          >
            Why Choose Us
          </motion.h2>
          <motion.p variants={item} className="text-xl text-muted-foreground max-w-2xl">
            Three value propositions that differentiate us from traditional consulting: Rapid Development, ROI-Focus, and Reasoning-Based AI.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {values.map((v) => (
            <motion.div
              key={v.headline}
              variants={item}
              className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 card-hover"
            >
              <div className="inline-flex p-3 rounded-lg bg-accent/20 text-accent mb-4">
                <v.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">{v.headline}</h3>
              <p className="text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
