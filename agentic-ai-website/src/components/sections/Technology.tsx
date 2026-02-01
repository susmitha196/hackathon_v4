import { motion } from 'framer-motion';
import { Bot, Workflow, Zap, LayoutDashboard } from 'lucide-react';

const techs = [
  {
    icon: Bot,
    name: 'Cursor AI',
    description: 'AI-powered code editor for rapid prototyping and implementation of agent logic, reducing development time from weeks to hours.',
  },
  {
    icon: Zap,
    name: 'Google Gemini',
    description: 'Advanced reasoning for complex decision-making, multi-factor trade-off analysis, and natural language explanations. Large context window for BOMs and risk reports.',
  },
  {
    icon: Workflow,
    name: 'n8n / LangChain',
    description: 'Workflow automation and agent framework for coordination, webhooks, and integration with ERP, email, Slack. Reasoning loops, tool use, and memory.',
  },
  {
    icon: LayoutDashboard,
    name: 'Vercel / Streamlit',
    description: 'Hosting for production web applications and rapid development of interactive dashboards for agent reasoning logs and operational metrics.',
  },
];

const container = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function Technology() {
  return (
    <section id="technology" className="py-24 bg-card/50">
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
            Technology
          </motion.span>
          <motion.h2
            variants={item}
            className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4"
          >
            Built With Best-in-Class Tools
          </motion.h2>
          <motion.p variants={item} className="text-xl text-muted-foreground max-w-2xl">
            Modern, production-grade tooling for development, reasoning, orchestration, and deployment—no marketing jargon, clear technical terminology.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {techs.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="p-6 rounded-xl border border-border bg-background hover:border-primary/50 card-hover"
            >
              <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-4">
                <t.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
