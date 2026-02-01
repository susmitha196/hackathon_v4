export type ServiceId =
  | 'supply-chain'
  | 'factory-orchestrator'
  | 'custom-agents'
  | 'consulting';

export interface FormData {
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  services: string[];
  projectDetails: string;
}

export interface FormState {
  values: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  touched: Partial<Record<keyof FormData, boolean>>;
  isSubmitting: boolean;
}

export interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  badge: string;
  serviceId: ServiceId;
  isSelected: boolean;
  onToggle: (serviceId: ServiceId) => void;
}

export interface ContactFormProps {
  selectedServices: ServiceId[];
  onServiceToggle: (serviceId: ServiceId) => void;
  onSubmit: (data: FormData) => Promise<void>;
}
