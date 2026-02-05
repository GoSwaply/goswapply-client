"use client";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative glass-card rounded-2xl p-8 h-full">
                <div className="w-14 h-14 rounded-xl glass flex items-center justify-center mb-6">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
