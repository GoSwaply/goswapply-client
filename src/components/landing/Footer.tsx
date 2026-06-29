"use client";

import Link from "next/link";
import {
  WalletIcon,
  EmailIcon,
  PhoneIcon,
  MapPinIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/ui/Icons";
import AppStoreButtons from "@/components/ui/AppStoreButtons";

const footerLinks = {
  services: [
    { name: "Airtime & Data", href: "#services" },
    { name: "Electricity", href: "#services" },
    { name: "Cable TV", href: "#services" },
    { name: "Betting", href: "#services" },
    { name: "Flights", href: "#services" },
    { name: "Crypto & Gift Cards", href: "#services" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "AML Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <WalletIcon size={24} />
              </div>
              <span className="text-2xl font-bold text-gradient-gold">
                Swaply
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Nigeria&apos;s premier payment platform for airtime, data, bills,
              crypto, gift cards, and more.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <EmailIcon size={20} />
                <span>support@swaply.ng</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <PhoneIcon size={20} />
                <span>+234 800 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPinIcon size={20} />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
            <AppStoreButtons layout="col" />
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Swaply. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:scale-110 transition-all"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
