import { motion } from 'framer-motion';
import { Play, Rocket } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Hero() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.08) 0%, transparent 60%)',
      }}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: { transition: { staggerChildren: 0.1 } },
          }}
          className="max-w-4xl"
        >
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-8 border border-primary/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now Offering · 8-Hour MVP Development
          </motion.div>

          <motion.h1
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            className="font-display font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-foreground leading-[1.1] mb-6"
          >
            <span className="block">Build Self-Healing Systems with Mickey AI</span>
          </motion.h1>

          <motion.p
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            Transform industrial operations from reactive to proactive through reasoning-based AI agents that deliver measurable ROI in days, not months. Our 8-hour MVP approach eliminates lengthy implementation cycles while maintaining production-grade quality and transparency.
          </motion.p>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <button
              type="button"
              onClick={() => scrollToSection('services')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 btn-hover min-h-[48px]"
            >
              <Rocket className="h-5 w-5" aria-hidden />
              Explore Our Services
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 font-semibold btn-hover min-h-[48px]"
            >
              <Play className="h-5 w-5" aria-hidden />
              Book a Demo
            </button>
          </motion.div>

          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            className="flex flex-wrap gap-8 sm:gap-12 text-muted-foreground"
          >
            <div>
              <span className="block font-display font-bold text-2xl sm:text-3xl text-foreground">8 Hours</span>
              <span className="text-sm">MVP Development</span>
            </div>
            <div>
              <span className="block font-display font-bold text-2xl sm:text-3xl text-foreground">3 Agents</span>
              <span className="text-sm">Core System</span>
            </div>
            <div>
              <span className="block font-display font-bold text-2xl sm:text-3xl text-foreground">24/7</span>
              <span className="text-sm">Autonomous Operation</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
