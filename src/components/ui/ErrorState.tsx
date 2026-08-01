"use client";

import {
  AlertTriangle,
  WifiOff,
  Clock,
  Lock,
  SearchX,
  ShieldAlert,
} from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/utils";
import type { AppError, ErrorKind } from "@/lib/errors";

const ICONS: Record<ErrorKind, React.ElementType> = {
  offline: WifiOff,
  timeout: Clock,
  auth: Lock,
  forbidden: ShieldAlert,
  notFound: SearchX,
  validation: AlertTriangle,
  conflict: AlertTriangle,
  rateLimit: Clock,
  server: AlertTriangle,
  unknown: AlertTriangle,
};

interface ErrorStateProps {
  error: AppError;
  onRetry?: () => void;
  /** `inline` sits inside a card; `page` centres in the viewport. */
  variant?: "inline" | "page";
  className?: string;
}

/**
 * Renders a failure. Distinct from EmptyState on purpose: this means "we could
 * not load it", never "there is nothing here".
 */
export default function ErrorState({
  error,
  onRetry,
  variant = "inline",
  className,
}: ErrorStateProps) {
  const Icon = ICONS[error.kind] ?? AlertTriangle;
  const danger = error.kind === "server" || error.kind === "unknown";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "page" ? "min-h-[60vh] p-8" : "py-10 px-6",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-4",
          danger ? "bg-red-500/10" : "bg-muted"
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6",
            danger ? "text-red-500" : "text-muted-foreground"
          )}
        />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">
        {error.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">{error.message}</p>

      {/*
        A write whose outcome we could not confirm must never be presented as a
        clean failure — the money may already have moved.
      */}
      {error.outcomeUnknown && (
        <p className="mt-3 text-sm text-amber-500 max-w-sm font-medium">
          Do not retry until you have checked your transaction history.
        </p>
      )}

      {error.retryable && onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}

      {/* Gives support something traceable instead of "the app broke". */}
      {error.correlationId && error.kind === "server" && (
        <p className="mt-4 text-xs text-muted-foreground/70 font-mono">
          Reference: {error.correlationId.slice(0, 8)}
        </p>
      )}
    </div>
  );
}
