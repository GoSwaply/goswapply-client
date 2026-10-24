"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  SmartphoneIcon,
  ElectricityIcon,
  ShieldIcon,
  TrendingUpIcon,
} from "@/components/ui/Icons";
import AppStoreButtons from "@/components/ui/AppStoreButtons";
import ServiceActionLink from "@/components/landing/ServiceActionLink";
import ParticlesBackground from "./ParticlesBackground";
import { publicAPI } from "@/lib/api";

const features = [
  { icon: ElectricityIcon, text: "Instant Transactions" },
  { icon: ShieldIcon, text: "Bank-Grade Security" },
  { icon: TrendingUpIcon, text: "Best Exchange Rates" },
  { icon: SmartphoneIcon, text: "24/7 Availability" },
];

export default function Hero() {
  const [apiLive, setApiLive] = useState(false);

  useEffect(() => {
    publicAPI
      .health()
      .then(() => setApiLive(true))
      .catch(() => setApiLive(false));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-background to-background" />
      <ParticlesBackground />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Nigeria&apos;s Premier Payment Platform
                </span>
              </div>
              {apiLive && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">All Systems Live</span>
                </div>
              )}
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
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10"
            >
              Pay bills, buy airtime and data, top up electricity, renew cable
              TV and book flights — all from one secure Naira wallet.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-10"
            >
              <ServiceActionLink
                destination="/dashboard"
                className="btn-gold text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl"
              >
                Get started free
              </ServiceActionLink>
              <a
                href="#services"
                className="px-8 py-4 rounded-xl font-semibold text-lg glass hover:border-primary/50 transition-all text-foreground"
              >
                Explore services
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mb-8"
            >
              <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase mb-3">
                Also available on mobile
              </p>
              <AppStoreButtons />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <feature.icon size={18} />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Glow behind the phone */}
              <div className="absolute -inset-8 bg-primary/15 rounded-[3rem] blur-3xl" />
              {/* Phone frame */}
              <div className="relative w-[280px] rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-10" />
                <Image
                  src="/screenshots/app-dashboard.jpg"
                  alt="Swaply app — wallet balance, bill payments and gift card rates"
                  width={280}
                  height={606}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
