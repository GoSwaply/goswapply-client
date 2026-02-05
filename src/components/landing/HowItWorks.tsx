"use client";

import { motion } from "framer-motion";
import { UserPlusIcon, WalletIcon, CreditCardIcon, CheckCircleIcon } from "@/components/ui/Icons";

const steps = [
  {
    icon: UserPlusIcon,
    title: "Create Account",
    description: "Sign up in seconds with your email and phone number.",
  },
  {
    icon: WalletIcon,
    title: "Fund Wallet",
    description: "Add money via bank transfer to your dedicated virtual account.",
  },
  {
    icon: CreditCardIcon,
    title: "Make Payments",
    description: "Pay bills, buy airtime, or trade crypto with a few taps.",
  },
  {
    icon: CheckCircleIcon,
    title: "Instant Confirmation",
    description: "Receive instant confirmation and WhatsApp notifications.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">How It</span>{" "}
            <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in four simple steps and unlock the power of seamless
            financial transactions.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center glow-gold">
                      <step.icon size={40} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
