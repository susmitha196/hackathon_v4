import { motion } from 'framer-motion';

const personas = [
  {
    image: '/persona-marcus.png',
    imagePosition: 'center',
    name: 'Marcus',
    role: 'The Operations Director',
    description:
      'Primary decision-maker for operational technology in mid-to-large industrial facilities. Director of Operations, VP of Manufacturing, or Plant Manager in hydrogen, clean energy, advanced manufacturing, or chemical processing.',
    goals: [
      'Reduce unplanned downtime by at least 15% within the first fiscal year',
      'Demonstrate ROI to executive leadership within 90 days of pilot deployment',
      'Build operational resilience against supply chain disruptions',
      'Empower teams with actionable intelligence rather than alert fatigue',
    ],
  },
  {
    image: '/persona-elena.png',
    imagePosition: 'left center',
    name: 'Elena',
    role: 'The Procurement Manager',
    description:
      'Manages strategic sourcing and supplier relationships. Procurement Manager, Supply Chain Director, or Strategic Sourcing Lead overseeing $10M–$50M in annual procurement and 50–200 suppliers across multiple tiers.',
    goals: [
      'Early warning systems for supply chain risks before they impact production',
      'Diversified supplier base for high-risk materials with geopolitical visibility',
      'Demonstrate proactive risk management through documented mitigation actions',
      'Real-time intelligence to identify alternative sources during disruption events',
    ],
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

export function Personas() {
  return (
    <section id="personas" className="py-24 bg-card/50">
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
            Who We Serve
          </motion.span>
          <motion.h2
            variants={item}
            className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4"
          >
            Built for Leaders Like You
          </motion.h2>
          <motion.p variants={item} className="text-xl text-muted-foreground max-w-2xl">
            Our solutions are designed for operations and procurement leaders who need rapid value, transparent AI, and measurable impact.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {personas.map((p) => (
            <motion.div
              key={p.name}
              variants={item}
              className="overflow-hidden rounded-xl border border-border bg-background hover:border-primary/50 card-hover"
            >
              <div className="p-8 pt-10">
                <div className="mb-6 flex justify-center">
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-border">
                    <img
                      src={p.image}
                      alt={`${p.name}, ${p.role}`}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: p.imagePosition ?? 'center' }}
                    />
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-1">
                {p.name}
              </h3>
              <p className="text-primary font-medium text-sm mb-4">{p.role}</p>
              <p className="text-muted-foreground mb-6">{p.description}</p>
              <p className="text-sm font-medium text-foreground mb-2">Goals:</p>
              <ul className="list-none space-y-2 text-sm text-muted-foreground">
                {p.goals.map((goal) => (
                  <li key={goal} className="flex gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
