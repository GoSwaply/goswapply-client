"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resolveActionHref } from "@/lib/auth-intent";

interface ServiceActionLinkProps {
  /** Where the visitor ultimately wants to go, e.g. "/airtime". */
  destination: string;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Wraps a call to action so it lands somewhere useful whether or not the
 * visitor has an account.
 *
 * The correct target depends on cookies and localStorage, neither of which
 * exists during server rendering. Rendering the sign-up path first keeps the
 * server and client markup identical, then the real target is resolved on
 * mount — so the href is always right by the time anyone can click it, and
 * middle-click and "open in new tab" keep working.
 */
export default function ServiceActionLink({
  destination,
  children,
  className,
  "aria-label": ariaLabel,
}: ServiceActionLinkProps) {
  const [href, setHref] = useState(
    `/register?next=${encodeURIComponent(destination)}`
  );

  useEffect(() => {
    setHref(resolveActionHref(destination));
  }, [destination]);

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
