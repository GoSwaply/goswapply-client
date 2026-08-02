"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { isReturningVisitor, isSignedIn } from "@/lib/auth-intent";

type Audience = "guest" | "returning" | "signedIn";

interface AuthNavActionsProps {
  layout?: "row" | "col";
  onNavigate?: () => void;
  className?: string;
}

/**
 * Sign-in / sign-up entry points, adapted to who is looking.
 *
 * Rendered as a guest on the server (no cookies there) and corrected on mount,
 * so server and client markup match during hydration.
 */
export default function AuthNavActions({
  layout = "row",
  onNavigate,
  className,
}: AuthNavActionsProps) {
  const [audience, setAudience] = useState<Audience>("guest");

  useEffect(() => {
    if (isSignedIn()) setAudience("signedIn");
    else if (isReturningVisitor()) setAudience("returning");
    else setAudience("guest");
  }, []);

  const wrapper = cn(
    "flex items-center gap-3",
    layout === "col" && "flex-col items-stretch",
    className
  );

  if (audience === "signedIn") {
    return (
      <div className={wrapper}>
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="btn-gold text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-center transition-all hover:shadow-lg"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  // A first-timer needs an account, so signing up leads. Someone who has been
  // here before just needs to get back in, so signing in leads instead.
  const primary =
    audience === "returning"
      ? { href: "/login", label: "Sign in" }
      : { href: "/register", label: "Create free account" };
  const secondary =
    audience === "returning"
      ? { href: "/register", label: "Create account" }
      : { href: "/login", label: "Sign in" };

  return (
    <div className={wrapper}>
      <Link
        href={secondary.href}
        onClick={onNavigate}
        className="px-4 py-2.5 rounded-xl font-semibold text-center text-foreground/90 hover:text-primary transition-colors"
      >
        {secondary.label}
      </Link>
      <Link
        href={primary.href}
        onClick={onNavigate}
        className="btn-gold text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-center transition-all hover:shadow-lg"
      >
        {primary.label}
      </Link>
    </div>
  );
}
