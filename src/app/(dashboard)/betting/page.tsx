"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { bettingAPI } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";

const providers = [
  { code: "BET9JA", name: "Bet9ja", color: "bg-green-600" },
  { code: "BETKING", name: "BetKing", color: "bg-blue-600" },
  { code: "SPORTYBET", name: "SportyBet", color: "bg-red-600" },
  { code: "1XBET", name: "1xBet", color: "bg-blue-500" },
  { code: "BETWAY", name: "Betway", color: "bg-gray-800" },
  { code: "NAIRABET", name: "NairaBet", color: "bg-orange-600" },
];

const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

export default function BettingPage() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  const handleVerify = async () => {
    if (!selectedProvider || !customerId) {
      toast.error("Please select provider and enter customer ID");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await bettingAPI.verifyCustomer({
        provider_code: selectedProvider,
        customer_id: customerId,
      });
      setCustomerName(response.data.customer_name);
      setIsVerified(true);
      toast.success("Account verified");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Verification failed");
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = () => {
    if (!isVerified) {
      toast.error("Please verify account first");
      return;
    }
    if (!amount || parseInt(amount) < 100) {
      toast.error("Minimum amount is N100");
      return;
    }
    setShowPinModal(true);
  };

  const handleFund = async () => {
    if (pin.length !== 4) {
      toast.error("Please enter your 4-digit PIN");
      return;
    }

    setIsLoading(true);
    try {
      const response = await bettingAPI.fundAccount({
        provider_code: selectedProvider,
        customer_id: customerId,
        amount: parseInt(amount),
        pin,
      });
      setTransactionRef(response.data.reference);
      setShowPinModal(false);
      setShowSuccessModal(true);
      setPin("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedProvider("");
    setCustomerId("");
    setCustomerName("");
    setAmount("");
    setIsVerified(false);
    setShowSuccessModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Fund Betting Account
        </h1>
        <p className="text-muted-foreground">
          Instantly fund your betting wallet
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <button
                key={provider.code}
                onClick={() => {
                  setSelectedProvider(provider.code);
                  setIsVerified(false);
                }}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  selectedProvider === provider.code
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-xl ${provider.color} flex items-center justify-center text-white font-bold text-lg mb-2`}
                >
                  <Trophy className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-foreground text-center">
                  {provider.name}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Customer ID / Username"
                placeholder="Enter your betting ID"
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setIsVerified(false);
                }}
                leftIcon={<Trophy className="w-5 h-5" />}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleVerify}
                isLoading={isVerifying}
                disabled={!selectedProvider}
              >
                Verify
              </Button>
            </div>
          </div>

          {isVerified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4"
            >
              <p className="text-sm text-muted-foreground">Account Name</p>
              <p className="font-bold text-foreground">{customerName}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amount</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={cn(
                  "py-3 px-4 rounded-xl text-sm font-medium transition-all",
                  amount === amt.toString()
                    ? "btn-gold text-primary-foreground"
                    : "glass hover:border-primary/50"
                )}
              >
                {formatCurrency(amt)}
              </button>
            ))}
          </div>

          <Input
            type="number"
            placeholder="Or enter custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            leftIcon={<span className="text-muted-foreground">NGN</span>}
          />

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!isVerified}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Continue
          </Button>
        </CardContent>
      </Card>

      <Modal isOpen={showPinModal} onClose={() => setShowPinModal(false)} title="Enter PIN">
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform</span>
              <span className="text-foreground">{selectedProvider}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account</span>
              <span className="text-foreground">{customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground font-bold">
                {formatCurrency(parseInt(amount) || 0)}
              </span>
            </div>
          </div>

          <Input
            label="Transaction PIN"
            type="password"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
          />

          <Button
            className="w-full"
            size="lg"
            onClick={handleFund}
            isLoading={isLoading}
          >
            Confirm Funding
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={resetForm} title="Success!" showClose={false}>
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Funding Successful!
            </h3>
            <p className="text-muted-foreground">
              {formatCurrency(parseInt(amount))} has been added to {customerName}&apos;s {selectedProvider} account
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Reference</p>
            <p className="text-foreground font-mono">{transactionRef}</p>
          </div>
          <Button className="w-full" onClick={resetForm}>
            Done
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
