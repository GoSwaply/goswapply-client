"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { useWalletStore } from "@/store/wallet";
import { walletAPI } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { Transaction } from "@/types";

const transactionTypes = [
  { value: "", label: "All Types" },
  { value: "deposit", label: "Deposits" },
  { value: "withdrawal", label: "Withdrawals" },
  { value: "airtime", label: "Airtime" },
  { value: "data", label: "Data" },
  { value: "electricity", label: "Electricity" },
  { value: "tv", label: "Cable TV" },
  { value: "betting", label: "Betting" },
  { value: "transfer", label: "Transfers" },
];

export default function WalletPage() {
  const { wallet, fundingAccounts, fetchWallet } = useWalletStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawPin, setWithdrawPin] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filterType]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { limit: 50 };
      if (filterType) params.type = filterType;
      const response = await walletAPI.getTransactions(params);
      setTransactions(response.data.results || response.data);
    } catch {
      toast.error("Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const copyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    toast.success("Account number copied!");
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawBank || !withdrawAccount || !withdrawPin) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsWithdrawing(true);
    try {
      await walletAPI.withdraw({
        amount: parseInt(withdrawAmount),
        bank_code: withdrawBank,
        account_number: withdrawAccount,
        pin: withdrawPin,
      });
      toast.success("Withdrawal initiated successfully");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      setWithdrawBank("");
      setWithdrawAccount("");
      setWithdrawPin("");
      fetchWallet();
      fetchTransactions();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (searchQuery) {
      return (
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Wallet
        </h1>
        <p className="text-muted-foreground">
          Manage your funds and view transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="gold" className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="relative pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-muted-foreground mb-1">Available Balance</p>
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
                <Button
                  onClick={() => setShowFundModal(true)}
                  leftIcon={<ArrowDownLeft className="w-4 h-4" />}
                >
                  Fund Wallet
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawModal(true)}
                  leftIcon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Funded</span>
              <span className="text-green-500 font-semibold">
                +{formatCurrency(0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="text-red-400 font-semibold">
                -{formatCurrency(0)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-muted-foreground">Transactions</span>
              <span className="text-foreground font-semibold">
                {transactions.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-lg input-glass text-sm w-full sm:w-48"
              />
            </div>
            <Select
              options={transactionTypes}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl glass hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        tx.type === "deposit"
                          ? "bg-green-500/20"
                          : "bg-red-500/20"
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
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p
                        className={cn(
                          "font-semibold",
                          tx.type === "deposit"
                            ? "text-green-500"
                            : "text-foreground"
                        )}
                      >
                        {tx.type === "deposit" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.reference}
                      </p>
                    </div>
                    {getStatusIcon(tx.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
        title="Fund Your Wallet"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Transfer to any of these accounts to fund your wallet instantly.
          </p>

          {fundingAccounts.length > 0 ? (
            <div className="space-y-4">
              {fundingAccounts.map((account) => (
                <div
                  key={account.id}
                  className="glass-card rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bank</span>
                    <span className="text-foreground font-medium">
                      {account.bank_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Account Number
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono font-bold">
                        {account.account_number}
                      </span>
                      <button
                        onClick={() => copyAccountNumber(account.account_number)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Copy className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Account Name
                    </span>
                    <span className="text-foreground">
                      {account.account_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No funding accounts available. Please contact support.
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Your wallet will be credited automatically after transfer.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Funds"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            leftIcon={<span className="text-muted-foreground">NGN</span>}
          />

          <Input
            label="Bank Code"
            placeholder="Enter bank code (e.g., 044)"
            value={withdrawBank}
            onChange={(e) => setWithdrawBank(e.target.value)}
          />

          <Input
            label="Account Number"
            placeholder="Enter 10-digit account number"
            value={withdrawAccount}
            onChange={(e) =>
              setWithdrawAccount(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />

          <Input
            label="Transaction PIN"
            type="password"
            placeholder="Enter 4-digit PIN"
            value={withdrawPin}
            onChange={(e) =>
              setWithdrawPin(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            maxLength={4}
          />

          <Button
            className="w-full"
            size="lg"
            onClick={handleWithdraw}
            isLoading={isWithdrawing}
          >
            Withdraw
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
