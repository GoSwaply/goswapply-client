"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export interface SlideUpSelectOption {
  value: string;
  label: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function SlideUpSelect({
  title,
  description,
  placeholder,
  options,
  value,
  onChange,
}: {
  title: string;
  description?: string;
  placeholder: string;
  options: SlideUpSelectOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary/60"
      >
        {selected?.leading}
        <span className="flex-1">
          <span className={`block font-semibold ${selected ? "text-foreground" : "text-muted-foreground"}`}>
            {selected?.label ?? placeholder}
          </span>
          {selected?.description && <span className="text-sm text-muted-foreground">{selected.description}</span>}
        </span>
        {selected?.trailing}
        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="max-h-[82vh] w-full overflow-hidden rounded-t-3xl bg-background shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-bold text-foreground">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              <div className="max-h-[68vh] space-y-2 overflow-y-auto p-4 pb-8">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      {option.leading}
                      <span className="flex-1">
                        <span className="block font-semibold">{option.label}</span>
                        {option.description && <span className="text-sm text-muted-foreground">{option.description}</span>}
                      </span>
                      {option.trailing}
                      {isSelected && <Check className="h-5 w-5 shrink-0 text-primary" />}
                    </button>
                  );
                })}
                {!options.length && <p className="py-8 text-center text-sm text-muted-foreground">No options available.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
