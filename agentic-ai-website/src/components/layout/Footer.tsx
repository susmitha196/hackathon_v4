import { Workflow } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-black py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 font-display font-semibold text-lg text-foreground hover:text-primary transition-colors"
          aria-label="Mickey AI - Home"
        >
          <Workflow className="h-6 w-6 text-primary" aria-hidden />
          <span>Mickey AI</span>
        </a>
        <p className="text-muted-foreground text-sm text-center md:text-right">
          © {new Date().getFullYear()} Mickey AI. Intelligent workflow automation for industrial operations.
        </p>
      </div>
    </footer>
  );
}
