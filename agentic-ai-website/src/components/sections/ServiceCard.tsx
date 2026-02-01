import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ServiceId } from '../../types';

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  badge: string;
  serviceId: ServiceId;
  isSelected: boolean;
  onToggle: (serviceId: ServiceId) => void;
  detailHref?: string;
}

const cardContent = (
  icon: React.ComponentType<{ className?: string }>,
  title: string,
  description: string,
  features: string[],
  badge: string,
  isSelected: boolean
) => {
  const Icon = icon;
  return (
    <div className="relative">
      {isSelected && (
        <CheckCircle2
          className="absolute top-0 right-0 h-6 w-6 text-primary"
          aria-hidden
        />
      )}
      <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-4">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <ul className="space-y-2 mb-4">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
        {badge}
      </span>
    </div>
  );
};

export function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
  badge,
  serviceId,
  isSelected,
  onToggle,
  detailHref,
}: ServiceCardProps) {
  const cardClassName = cn(
    'text-left w-full p-6 rounded-xl border-2 bg-card card-hover min-h-[200px] cursor-pointer block',
    isSelected
      ? 'border-primary bg-primary/5'
      : 'border-border hover:border-primary/50'
  );

  if (detailHref) {
    return (
      <Link href={detailHref} className="block w-full">
        <motion.div
          className={cardClassName}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          aria-label={`${title} - View details`}
        >
          {cardContent(Icon, title, description, features, badge, isSelected)}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onToggle(serviceId)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(serviceId);
        }
      }}
      className={cardClassName}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      aria-pressed={isSelected}
      aria-label={`${title} - ${isSelected ? 'Selected' : 'Select'}`}
    >
      {cardContent(Icon, title, description, features, badge, isSelected)}
    </motion.div>
  );
}
