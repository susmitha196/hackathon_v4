import { motion } from 'framer-motion';
import { ContactForm } from '../forms/ContactForm';
import type { FormData, ServiceId } from '../../types';

interface ContactProps {
  selectedServices: ServiceId[];
  onServiceToggle: (serviceId: ServiceId) => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export function Contact({ selectedServices, onServiceToggle, onSubmit }: ContactProps) {
  return (
    <section id="contact" className="py-24 bg-card/50">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Start Your Project
          </h2>
          <p className="text-xl text-muted-foreground">
            Tell us about your goals and we'll get back within 24 hours.
          </p>
        </motion.div>
        <ContactForm
          selectedServices={selectedServices}
          onServiceToggle={onServiceToggle}
          onSubmit={onSubmit}
        />
      </div>
    </section>
  );
}
