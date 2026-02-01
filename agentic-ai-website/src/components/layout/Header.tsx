import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Workflow, Menu, X, LogIn, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'technology', label: 'Technology' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'personas', label: 'Personas' },
  { id: 'contact', label: 'Contact' },
];

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  // Check if we're on Dashboard or Live Monitoring Dashboard pages
  const isDashboardPage = location === '/dashboard' || location === '/services/factory-orchestrator/dashboard';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-border bg-black/50 backdrop-blur-md transition-shadow',
        scrolled && 'shadow-lg shadow-black/20'
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-semibold text-xl text-foreground hover:text-primary transition-colors"
            aria-label="Mickey AI - Home"
          >
            <Workflow className="h-8 w-8 text-primary" aria-hidden />
            <span>Mickey AI</span>
          </Link>

          {!isDashboardPage && (
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          <div className="hidden md:flex items-center gap-3">
            {!isDashboardPage && (
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 btn-hover min-h-[44px]"
              >
                Talk to us
              </button>
            )}
            {isDashboardPage ? (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors min-h-[44px]"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors min-h-[44px]"
              >
                <LogIn className="h-4 w-4" />
                Log In
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card"
          >
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-2" aria-label="Mobile navigation">
              {!isDashboardPage && (
                <>
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => {
                        scrollToSection(link.id);
                        setMobileOpen(false);
                      }}
                      className="text-left py-3 text-muted-foreground hover:text-primary font-medium min-h-[44px]"
                    >
                      {link.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection('contact');
                      setMobileOpen(false);
                    }}
                    className="mt-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold min-h-[44px]"
                  >
                    Talk to us
                  </button>
                </>
              )}
              {isDashboardPage ? (
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 w-full py-3 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 w-full py-3 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-muted flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
