"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldIcon,
  ElectricityIcon,
  ClockIcon,
  SupportIcon,
  LockIcon,
  CreditCardIcon,
} from "@/components/ui/Icons";

const features = [
  {
    icon: ShieldIcon,
    title: "Bank-Grade Security",
    description:
      "Your funds and data are protected with enterprise-level encryption and security protocols.",
  },
  {
    icon: ElectricityIcon,
    title: "Lightning Fast",
    description:
      "Experience instant transactions with our optimized payment infrastructure.",
  },
  {
    icon: ClockIcon,
    title: "24/7 Availability",
    description:
      "Our platform never sleeps. Access your wallet and make transactions anytime.",
  },
  {
    icon: SupportIcon,
    title: "Dedicated Support",
    description:
      "Get help when you need it with our responsive customer support team.",
  },
  {
    icon: LockIcon,
    title: "Transaction PIN",
    description:
      "Additional security layer with transaction PIN for all financial operations.",
  },
  {
    icon: CreditCardIcon,
    title: "Virtual Account",
    description:
      "Get a dedicated virtual account for seamless bank transfers and funding.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Why Choose</span>{" "}
            <span className="text-gradient-gold">Swaply?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with user-centric design to deliver
            the best financial experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Feature cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass-card rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-4">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/10 rounded-[3rem] blur-2xl" />
              <div className="relative w-[240px] rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-xl z-10" />
                <Image
                  src="/screenshots/app-giftcards.jpg"
                  alt="Swaply app — sell gift cards and track trades"
                  width={240}
                  height={520}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
