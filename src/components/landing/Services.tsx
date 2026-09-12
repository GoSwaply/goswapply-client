"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  CableTVIcon,
  FlightsIcon,
} from "@/components/ui/Icons";
import Card from "@/components/ui/Card";
import ServiceActionLink from "@/components/landing/ServiceActionLink";

/**
 * Public-facing services only.
 *
 * Betting top-ups, crypto and gift-card trading are deliberately absent. They
 * remain available inside the signed-in app, but advertising them publicly has
 * repeatedly blocked platform and payment-partner verification — gambling and
 * virtual-asset trading are restricted categories for most reviewers.
 *
 * What is listed here maps to what our payment partner actually supports as
 * bill categories: airtime, mobile data, utility bills, cable TV. Flights are
 * collected through standard checkout rather than the bill-payment API.
 */
const services = [
  {
    icon: AirtimeIcon,
    title: "Airtime",
    href: "/airtime",
    description: "Instant top-up for MTN, Glo, Airtel and 9mobile",
  },
  {
    icon: DataIcon,
    title: "Data Bundles",
    href: "/data",
    description: "Data plans for every network, delivered in seconds",
  },
  {
    icon: ElectricityIcon,
    title: "Electricity",
    href: "/electricity",
    description: "Prepaid and postpaid tokens for every disco nationwide",
  },
  {
    icon: CableTVIcon,
    title: "Cable TV",
    href: "/cable",
    description: "Renew DStv, GOtv and StarTimes without leaving the app",
  },
  {
    icon: FlightsIcon,
    title: "Flights",
    href: "/flights",
    description: "Book domestic and international flights from your wallet",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-900/5 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">All Your</span>{" "}
            <span className="text-gradient-gold">Services</span>{" "}
            <span className="text-foreground">in One Place</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Airtime, data, electricity, cable TV and flights — paid from one wallet,
            settled instantly, with every transaction receipted.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              {/* Each tile is the entry point into that service, routing
                  through sign-in or sign-up as needed. */}
              <ServiceActionLink
                destination={service.href}
                className="block h-full"
                aria-label={`${service.title} — get started`}
              >
                <Card hover className="h-full group">
                  <div className="w-14 h-14 rounded-xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Get started
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </ServiceActionLink>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
