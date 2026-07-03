import { cn } from "@/lib/utils";

export function LegalSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-32 mb-12", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
        <span className="w-1.5 h-8 rounded-full gradient-gold" />
        {title}
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-4 text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalCallout({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "warning" | "danger";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-blue-500/30 bg-blue-500/5",
    warning: "border-yellow-500/30 bg-yellow-500/5",
    danger: "border-red-500/30 bg-red-500/5",
  };
  const titleColor = {
    info: "text-blue-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
  };

  return (
    <div className={cn("glass border-l-4 rounded-xl p-5 my-6", styles[variant])}>
      <h4 className={cn("font-semibold mb-2", titleColor[variant])}>{title}</h4>
      <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
    </div>
  );
}
