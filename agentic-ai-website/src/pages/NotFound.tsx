import { Link } from 'wouter';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <h1 className="font-display font-bold text-4xl text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-8">This page doesn't exist.</p>
      <Link href="/">
        <a className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 btn-hover">
          <Home className="h-5 w-5" aria-hidden />
          Back to Home
        </a>
      </Link>
    </div>
  );
}
