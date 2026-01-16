// pages/index.tsx
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with modern web technologies.',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant',
    description: 'Each blog is fully isolated and secure.',
  },
  {
    icon: Globe,
    title: 'SEO Optimized',
    description: 'Built-in SEO to help your content rank higher.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 👉 Redirect logged-in users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Postory</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium">
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-accent text-accent-foreground rounded"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-7xl md:text-7xl font-bold mb-6">
          <div>Create And Discover Beautiful</div>
          <div className="text-accent font-normal mt-5" >Stories With unlimited Creative Ideas</div>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          A modern multi-tenant blogging platform built for creators and teams.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded"
          >
            Start Your Blog
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 border rounded"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-8 rounded-2xl shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Start Blogging?
        </h2>
        <p className="text-muted-foreground mb-8">
          Create your free account and publish today.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded"
        >
          Create Free Account
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-sm text-muted-foreground flex justify-between">
        <span>Postory Blog</span>
        <span>© 2024 Capstone Project</span>
      </footer>
    </div>
  );
}
