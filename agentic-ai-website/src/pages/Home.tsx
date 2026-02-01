import { useState, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { Technology } from '../components/sections/Technology';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { Personas } from '../components/sections/Personas';
import { Contact } from '../components/sections/Contact';
import type { FormData, ServiceId } from '../types';

export function Home() {
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([]);

  const toggleService = useCallback((id: ServiceId) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const handleFormSubmit = useCallback(async (data: FormData) => {
    // Simulate API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form submitted:', data);
  }, []);

  return (
    <>
      <BackgroundEffects />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services selectedServices={selectedServices} onToggle={toggleService} />
        <Technology />
        <WhyChooseUs />
        <Personas />
        <Contact
          selectedServices={selectedServices}
          onServiceToggle={toggleService}
          onSubmit={handleFormSubmit}
        />
      </main>
      <Footer />
    </>
  );
}
