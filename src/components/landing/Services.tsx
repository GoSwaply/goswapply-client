"use client";

import { motion } from "framer-motion";
import {
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  CableTVIcon,
  BettingIcon,
  FlightsIcon,
  GiftCardIcon,
  CryptoIcon,
} from "@/components/ui/Icons";
import Card from "@/components/ui/Card";

const services = [
  {
    icon: AirtimeIcon,
    title: "Airtime",
    description: "Instant airtime top-up for all networks at discounted rates",
  },
  {
    icon: DataIcon,
    title: "Data Bundles",
    description: "Buy data plans for MTN, Glo, Airtel, and 9mobile instantly",
  },
  {
    icon: ElectricityIcon,
    title: "Electricity",
    description: "Pay PHCN bills for all distribution companies nationwide",
  },
  {
    icon: CableTVIcon,
    title: "Cable TV",
    description: "Subscribe to DStv, GOtv, and Startimes seamlessly",
  },
  {
    icon: BettingIcon,
    title: "Betting",
    description: "Fund your Bet9ja, BetKing, SportyBet accounts instantly",
  },
  {
    icon: FlightsIcon,
    title: "Flights",
    description: "Book domestic and international flights at great prices",
  },
  {
    icon: GiftCardIcon,
    title: "Gift Cards",
    description: "Sell Amazon, iTunes, Steam gift cards for instant cash",
  },
  {
    icon: CryptoIcon,
    title: "Crypto",
    description: "Exchange BTC, ETH, USDT for Naira at the best rates",
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
            From utility bills to crypto trading, we&apos;ve got everything you need
            to manage your finances effortlessly.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card hover className="h-full group">
                <div className="w-14 h-14 rounded-xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon size={36} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
