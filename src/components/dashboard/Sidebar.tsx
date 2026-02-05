"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DashboardIcon,
  WalletIcon,
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  CableTVIcon,
  BettingIcon,
  FlightsIcon,
  GiftCardIcon,
  CryptoIcon,
  UserIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronLeftIcon,
  MenuIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const menuItems = [
  { icon: DashboardIcon, label: "Dashboard", href: "/dashboard" },
  { icon: WalletIcon, label: "Wallet", href: "/dashboard/wallet" },
  { icon: AirtimeIcon, label: "Airtime", href: "/dashboard/airtime" },
  { icon: DataIcon, label: "Data Bundles", href: "/dashboard/data" },
  { icon: ElectricityIcon, label: "Electricity", href: "/dashboard/electricity" },
  { icon: CableTVIcon, label: "Cable TV", href: "/dashboard/cable" },
  { icon: BettingIcon, label: "Betting", href: "/dashboard/betting" },
  { icon: FlightsIcon, label: "Flights", href: "/dashboard/flights" },
  { icon: GiftCardIcon, label: "Gift Cards", href: "/dashboard/giftcards" },
  { icon: CryptoIcon, label: "Crypto", href: "/dashboard/crypto" },
];

const bottomMenuItems = [
  { icon: UserIcon, label: "Profile", href: "/dashboard/profile" },
  { icon: SettingsIcon, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
            <WalletIcon size={24} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-gradient-gold"
            >
              Swaply
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <ChevronLeftIcon
            size={20}
            className={cn("transition-transform", isCollapsed && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                  {item.label}
                </motion.span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        {bottomMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogoutIcon size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {!isCollapsed && user && (
        <div className="p-4 border-t border-border">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-primary-foreground font-bold">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass text-foreground"
      >
        <MenuIcon size={24} />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 glass-card flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "hidden lg:flex flex-col glass-card border-r border-border h-screen sticky top-0 transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
