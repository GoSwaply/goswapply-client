"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  WalletIcon,
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  CableTVIcon,
  BettingIcon,
  FlightsIcon,
  GiftCardIcon,
  CryptoIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";
import { ArrowUpRight, ArrowDownLeft, AlertCircle } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const quickActions = [
  { icon: AirtimeIcon, label: "Airtime", href: "/dashboard/airtime" },
  { icon: DataIcon, label: "Data", href: "/dashboard/data" },
  { icon: ElectricityIcon, label: "Electricity", href: "/dashboard/electricity" },
  { icon: CableTVIcon, label: "Cable TV", href: "/dashboard/cable" },
  { icon: BettingIcon, label: "Betting", href: "/dashboard/betting" },
  { icon: FlightsIcon, label: "Flights", href: "/dashboard/flights" },
  { icon: GiftCardIcon, label: "Gift Cards", href: "/dashboard/giftcards" },
  { icon: CryptoIcon, label: "Crypto", href: "/dashboard/crypto" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { wallet, transactions, fetchTransactions } = useWalletStore();

  useEffect(() => {
    fetchTransactions({ limit: 5 });
  }, [fetchTransactions]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon size={16} />;
      case "pending":
      case "processing":
        return <ClockIcon size={16} />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon size={16} />;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {getGreeting()}, {user?.first_name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your account activity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card variant="gold" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Total Balance</p>
                  <h2 className="text-4xl sm:text-5xl font-bold text-gradient-gold">
                    {wallet ? formatCurrency(wallet.balance) : "---"}
                  </h2>
                  {wallet && wallet.bonus_balance > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      + {formatCurrency(wallet.bonus_balance)} bonus
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link href="/dashboard/wallet?action=fund">
                    <Button leftIcon={<ArrowDownLeft className="w-4 h-4" />}>
                      Fund
                    </Button>
                  </Link>
                  <Link href="/dashboard/wallet?action=withdraw">
                    <Button
                      variant="outline"
                      leftIcon={<ArrowUpRight className="w-4 h-4" />}
                    >
                      Withdraw
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon size={20} />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Income</span>
                <span className="text-green-500 font-semibold">+{formatCurrency(125000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Spent</span>
                <span className="text-red-400 font-semibold">-{formatCurrency(45000)}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-foreground font-medium">Net</span>
                <span className="text-primary font-bold">+{formatCurrency(80000)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card hover className="text-center py-6 h-full">
                <div className="w-12 h-12 mx-auto rounded-xl glass flex items-center justify-center mb-3">
                  <action.icon size={28} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {action.label}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Link href="/dashboard/wallet">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-xl glass hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          tx.type === "deposit" ? "bg-green-500/20" : "bg-red-500/20"
                        )}
                      >
                        {tx.type === "deposit" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {tx.type.replace("_", " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p
                          className={cn(
                            "font-semibold",
                            tx.type === "deposit" ? "text-green-500" : "text-foreground"
                          )}
                        >
                          {tx.type === "deposit" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {tx.status}
                        </p>
                      </div>
                      {getStatusIcon(tx.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                  <WalletIcon size={64} />
                </div>
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Fund your wallet to start transacting
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
