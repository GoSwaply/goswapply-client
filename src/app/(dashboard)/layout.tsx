"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, fetchProfile } = useAuthStore();
  const { fetchWallet, fetchFundingAccounts } = useWalletStore();

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      // Carry the destination so a deep link survives signing in.
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    fetchProfile().then(() => {
      fetchWallet();
      fetchFundingAccounts();
    });
  }, [router, pathname, fetchProfile, fetchWallet, fetchFundingAccounts]);

  if (!isAuthenticated && !Cookies.get("access_token")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
