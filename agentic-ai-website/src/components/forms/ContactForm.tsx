import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { SERVICE_LABELS } from '../../lib/constants';
import type { FormData, ServiceId } from '../../types';

const serviceIds: ServiceId[] = ['supply-chain', 'factory-orchestrator', 'custom-agents', 'consulting'];

interface ContactFormProps {
  selectedServices: ServiceId[];
  onServiceToggle: (serviceId: ServiceId) => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export function ContactForm({
  selectedServices,
  onServiceToggle,
  onSubmit,
}: ContactFormProps) {
  const form = useFormState(selectedServices);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    form.syncServices(selectedServices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServices.join(',')]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    await form.handleSubmit(async (data) => {
      try {
        await onSubmit(data);
        setSuccess(true);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      }
    });
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-xl border border-primary bg-primary/5 text-center"
      >
        <p className="text-lg font-semibold text-foreground mb-2">Thank you!</p>
        <p className="text-muted-foreground">
          Request submitted successfully! We'll contact you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {submitError && (
        <p role="alert" className="text-red-400 text-sm">
          {submitError}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={form.values.fullName}
            onChange={(e) => form.setFieldValue('fullName', e.target.value)}
            onBlur={() => form.setFieldTouched('fullName')}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[48px]"
            placeholder="Your name"
            aria-required
            aria-invalid={!!form.errors.fullName}
            aria-describedby={form.errors.fullName ? 'fullName-error' : undefined}
          />
          {form.errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1 text-sm text-red-400">
              {form.errors.fullName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={form.values.company ?? ''}
            onChange={(e) => form.setFieldValue('company', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[48px]"
            placeholder="Your company"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={form.values.email}
            onChange={(e) => form.setFieldValue('email', e.target.value)}
            onBlur={() => form.setFieldTouched('email')}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[48px]"
            placeholder="you@company.com"
            aria-required
            aria-invalid={!!form.errors.email}
            aria-describedby={form.errors.email ? 'email-error' : undefined}
          />
          {form.errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-400">
              {form.errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={form.values.phone ?? ''}
            onChange={(e) => form.setFieldValue('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[48px]"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-foreground mb-2">
          Services Interested In <span className="text-accent">*</span>
        </span>
        <div className="flex flex-wrap gap-4" role="group" aria-label="Services">
          {serviceIds.map((id) => (
            <label
              key={id}
              className="flex items-center gap-2 cursor-pointer text-foreground"
            >
              <input
                type="checkbox"
                checked={form.values.services.includes(id)}
                onChange={() => onServiceToggle(id)}
                onBlur={() => form.setFieldTouched('services')}
                className="w-5 h-5 rounded border-border bg-input text-primary focus:ring-primary"
                aria-describedby={form.errors.services ? 'services-error' : undefined}
              />
              <span>{SERVICE_LABELS[id]}</span>
            </label>
          ))}
        </div>
        {form.errors.services && (
          <p id="services-error" role="alert" className="mt-1 text-sm text-red-400">
            {form.errors.services}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="projectDetails" className="block text-sm font-medium text-foreground mb-2">
          Project Details <span className="text-accent">*</span>
        </label>
        <textarea
          id="projectDetails"
          value={form.values.projectDetails}
          onChange={(e) => form.setFieldValue('projectDetails', e.target.value)}
          onBlur={() => form.setFieldTouched('projectDetails')}
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-y"
          placeholder="Tell us about your project (min 20 characters)"
          aria-required
          aria-invalid={!!form.errors.projectDetails}
          aria-describedby={form.errors.projectDetails ? 'projectDetails-error' : undefined}
        />
        {form.errors.projectDetails && (
          <p id="projectDetails-error" role="alert" className="mt-1 text-sm text-red-400">
            {form.errors.projectDetails}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 btn-hover disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center gap-2"
        aria-label="Submit contact form"
      >
        {form.isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden />
            Submit Request
          </>
        )}
      </button>
      <p className="text-xs text-muted-foreground">
        We respect your privacy. Your information will only be used to respond to your request.
      </p>
    </motion.form>
  );
}
