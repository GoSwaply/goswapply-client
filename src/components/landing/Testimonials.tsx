"use client";

import { motion } from "framer-motion";
import { StarIcon, QuoteIcon } from "@/components/ui/Icons";
import Card from "@/components/ui/Card";

const testimonials = [
  {
    name: "Chioma Adeyemi",
    role: "Business Owner",
    avatar: "CA",
    rating: 5,
    content:
      "Swaply has transformed how I handle my business transactions. The instant airtime and data purchases save me so much time!",
  },
  {
    name: "Emeka Okafor",
    role: "Crypto Trader",
    avatar: "EO",
    rating: 5,
    content:
      "Best rates for crypto exchange in Nigeria. I've tried many platforms but Swaply consistently offers the best deals.",
  },
  {
    name: "Fatima Ibrahim",
    role: "Student",
    avatar: "FI",
    rating: 5,
    content:
      "Simple, fast, and reliable. I use Swaply for all my utility bills and cable TV subscriptions. Highly recommended!",
  },
  {
    name: "David Eze",
    role: "Freelancer",
    avatar: "DE",
    rating: 5,
    content:
      "The gift card trading feature is amazing. Quick payments and excellent customer support whenever I need help.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">What Our</span>{" "}
            <span className="text-gradient-gold">Users Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who trust Swaply for their daily
            financial needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full relative">
                <div className="absolute top-6 right-6 opacity-20">
                  <QuoteIcon size={40} />
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} size={20} filled />
                  ))}
                </div>
                <p className="text-foreground/90 mb-6 text-lg leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
