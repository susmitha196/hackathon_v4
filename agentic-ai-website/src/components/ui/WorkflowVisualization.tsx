import { motion } from 'framer-motion';
import { Webhook, Brain, Shield, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

const steps = [
  { id: 'trigger', label: 'Webhook Trigger', icon: Webhook, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { id: 'intel', label: 'Market Intelligence', icon: Brain, color: 'bg-primary/20 text-primary border-primary/40' },
  { id: 'mitigation', label: 'Mitigation Agent', icon: Shield, color: 'bg-primary/20 text-primary border-primary/40' },
  { id: 'notify', label: 'Notification', icon: Send, color: 'bg-accent/20 text-accent border-accent/40' },
];

export function WorkflowVisualization() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % (steps.length + 1));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full overflow-x-auto py-8">
      <div className="flex items-center justify-center gap-0 min-w-max px-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeIndex === index;
          const isPassed = activeIndex > index;
          return (
            <div key={step.id} className="flex items-center">
              <motion.div
                layout
                animate={{
                  scale: isActive ? 1.05 : 1,
                  boxShadow: isActive
                    ? '0 0 0 2px var(--primary), 0 0 24px rgba(37, 99, 235, 0.35)'
                    : '0 0 0 1px var(--border)',
                }}
                transition={{ duration: 0.3 }}
                className={`
                  relative flex flex-col items-center gap-2 rounded-xl border-2 px-6 py-4 min-w-[140px]
                  ${step.color}
                  ${isPassed ? 'opacity-90' : ''}
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="workflow-pulse"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-black/20">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="relative text-xs font-medium text-center leading-tight">
                  {step.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="relative mx-1 flex h-0.5 w-8 sm:w-12 items-center bg-border">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{
                      width: isPassed || isActive ? '100%' : activeIndex === index ? '50%' : '0%',
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  {activeIndex === index && (
                    <motion.div
                      className="absolute left-0 h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50"
                      animate={{ x: ['0%', '400%'] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ width: 8, marginLeft: -4 }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Live workflow · n8n automation
      </p>
    </div>
  );
}
