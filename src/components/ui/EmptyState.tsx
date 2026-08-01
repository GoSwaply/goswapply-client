"use client";

import { Inbox } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  /** Say what will populate this, not just that it is empty. */
  description?: string;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
  className?: string;
}

/**
 * "Loaded successfully, nothing to show." Never used for failures — a request
 * that errored must render ErrorState so the user knows to retry.
 */
export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-10 px-6",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && (
        <Button variant="outline" size="sm" className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
