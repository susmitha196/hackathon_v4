import { useState, useCallback } from 'react';
import type { FormData, ServiceId } from '../types';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateForm(data: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (data.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }
  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (data.services.length === 0) {
    errors.services = 'Please select at least one service';
  }
  if (data.projectDetails.trim().length < 20) {
    errors.projectDetails = 'Please provide more details (min 20 characters)';
  }
  return errors;
}

const initialValues: FormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  services: [],
  projectDetails: '',
};

export function useFormState(initialServices: ServiceId[] = []) {
  const [values, setValues] = useState<FormData>({
    ...initialValues,
    services: [...initialServices],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [isSubmitting, setSubmitting] = useState(false);

  const setFieldValue = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const setFieldTouched = useCallback((field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const syncServices = useCallback((selected: ServiceId[]) => {
    setValues((prev) => ({ ...prev, services: [...selected] }));
    setErrors((prev) => ({ ...prev, services: undefined }));
  }, []);

  const validate = useCallback(() => {
    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const handleSubmit = useCallback(
    async (onSubmit: (data: FormData) => Promise<void>) => {
      setTouched({
        fullName: true,
        email: true,
        services: true,
        projectDetails: true,
      });
      if (!validate()) return;
      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
    [values, validate]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    syncServices,
    validate,
    handleSubmit,
  };
}
