"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
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
              Start Your Journey Today
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Ready to Experience</span>
            <br />
            <span className="text-gradient-gold">Seamless Payments?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join over 50,000 Nigerians who trust Swaply for their daily financial
            transactions. Sign up now and get started in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                rightIcon={<ArrowRightIcon size={20} />}
                className="text-lg px-10"
              >
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-10">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No hidden fees. No minimum balance. Start transacting instantly.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
