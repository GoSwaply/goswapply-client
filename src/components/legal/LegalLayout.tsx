import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { cn } from "@/lib/utils";
export { LegalSection, LegalList, LegalCallout } from "./LegalSection";

export interface LegalSection {
  id: string;
  title: string;
}

export interface LegalLayoutProps {
  badge: string;
  title: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
}

export default function LegalLayout({
  badge,
  title,
  description,
  effectiveDate,
  lastUpdated,
  sections,
  children,
}: LegalLayoutProps) {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary font-medium mb-6">
              {badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">{title}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>
                  Effective: <span className="text-foreground font-medium">{effectiveDate}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>
                  Last updated: <span className="text-foreground font-medium">{lastUpdated}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 glass-card rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                On this page
              </h2>
              <nav className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 border-l-2 border-transparent hover:border-primary pl-3"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="prose-legal max-w-none">{children}</article>
        </div>
      </section>

      {/* Related */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4 text-foreground">More</h3>
            <p className="text-muted-foreground mb-6">
              Manage your relationship with Swaply.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <RelatedLink href="/" label="Back to home" />
              <RelatedLink href="/delete-account" label="Delete Account" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function RelatedLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 rounded-xl",
        "glass hover:border-primary/40 hover:bg-primary/5 transition-all group"
      )}
    >
      <span className="text-sm font-medium text-foreground group-hover:text-primary">
        {label}
      </span>
      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </Link>
  );
}
