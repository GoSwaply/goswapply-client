"use client";

import Image from "next/image";
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
];

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
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
                  src="/screenshots/app-home.jpg"
                  alt="Swaply app — pay bills, buy airtime, check gift card rates"
                  width={240}
                  height={520}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>

          {/* Service cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ServiceActionLink
                  destination={service.href}
                  className="block h-full"
                  aria-label={`${service.title} — get started`}
                >
                  <Card hover className="h-full group">
                    <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <service.icon size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
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
      </div>
    </section>
  );
}
