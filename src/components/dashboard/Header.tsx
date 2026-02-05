"use client";

import { useState } from "react";
import { BellIcon, SearchIcon, MoonIcon, SunIcon } from "@/components/ui/Icons";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import { formatCurrency } from "@/lib/utils";

export default function Header() {
  const { user } = useAuthStore();
  const { wallet } = useWalletStore();
  const [isDark, setIsDark] = useState(true);

  return (
    <header className="sticky top-0 z-30 glass border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full hidden md:block">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              placeholder="Search services, transactions..."
              className="w-full h-11 pl-12 pr-4 rounded-xl input-glass text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {wallet && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass-gold">
              <span className="text-sm text-muted-foreground">Balance:</span>
              <span className="font-bold text-gradient-gold">
                {formatCurrency(wallet.balance)}
              </span>
            </div>
          )}

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl glass hover:bg-muted transition-colors"
          >
            {isDark ? (
              <SunIcon size={20} />
            ) : (
              <MoonIcon size={20} />
            )}
          </button>

          <button className="relative p-2 rounded-xl glass hover:bg-muted transition-colors">
            <BellIcon size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="hidden sm:block text-right">
              <div className="font-medium text-foreground text-sm">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.email}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-primary-foreground font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
