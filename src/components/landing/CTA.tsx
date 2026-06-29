"use client";

import { motion } from "framer-motion";
import { SparklesIcon } from "@/components/ui/Icons";
import AppStoreButtons from "@/components/ui/AppStoreButtons";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-secondary/10 to-primary/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 sm:p-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-6">
            <SparklesIcon size={16} />
            <span className="text-sm font-medium text-primary">
              Download the App Today
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Your Finances,</span>
            <br />
            <span className="text-gradient-gold">In Your Pocket</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join over 50,000 Nigerians who trust Swaply for their daily financial
            transactions. Download the app and get started in minutes — no web account needed.
          </p>

          <AppStoreButtons className="justify-center" />

          <p className="mt-8 text-sm text-muted-foreground">
            Free to download. No hidden fees. No minimum balance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
