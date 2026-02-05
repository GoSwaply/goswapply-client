"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRightIcon,
  SmartphoneIcon,
  ElectricityIcon,
  ShieldIcon,
  TrendingUpIcon,
} from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import ParticlesBackground from "./ParticlesBackground";

const stats = [
  { label: "Active Users", value: "50K+" },
  { label: "Transactions", value: "1M+" },
  { label: "Success Rate", value: "99.9%" },
  { label: "Countries", value: "5+" },
];

const features = [
  { icon: ElectricityIcon, text: "Instant Transactions" },
  { icon: ShieldIcon, text: "Bank-Grade Security" },
  { icon: TrendingUpIcon, text: "Best Exchange Rates" },
  { icon: SmartphoneIcon, text: "24/7 Availability" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-background to-background" />
      <ParticlesBackground />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Nigeria&apos;s Premier Payment Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Your All-in-One</span>
            <br />
            <span className="text-gradient-gold">Financial Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Pay bills, buy airtime & data, trade crypto, sell gift cards, and
            book flights — all from one powerful platform with the best rates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/register">
              <Button
                size="lg"
                rightIcon={<ArrowRightIcon size={20} />}
                className="text-lg px-8"
              >
                Start Now — It&apos;s Free
              </Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Explore Services
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-16"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <feature.icon size={20} />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
