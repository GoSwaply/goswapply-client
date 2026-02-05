"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { vtuAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const networks = [
  { code: "MTN", name: "MTN Nigeria", color: "bg-yellow-500", logo: "M" },
  { code: "GLO", name: "Glo", color: "bg-green-600", logo: "G" },
  { code: "AIRTEL", name: "Airtel", color: "bg-red-600", logo: "A" },
  { code: "9MOBILE", name: "9mobile", color: "bg-green-500", logo: "9" },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimePage() {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  const handleSubmit = () => {
    if (!selectedNetwork) {
      toast.error("Please select a network");
      return;
    }
    if (!phone || phone.length !== 11) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!amount || parseInt(amount) < 50) {
      toast.error("Minimum amount is N50");
      return;
    }
    setShowPinModal(true);
  };

  const handlePurchase = async () => {
    if (pin.length !== 4) {
      toast.error("Please enter your 4-digit PIN");
      return;
    }

    setIsLoading(true);
    try {
      const response = await vtuAPI.buyAirtime({
        phone,
        network: selectedNetwork,
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
    setSelectedNetwork("");
    setPhone("");
    setAmount("");
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
          Buy Airtime
        </h1>
        <p className="text-muted-foreground">
          Instant airtime top-up for all networks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {networks.map((network) => (
              <button
                key={network.code}
                onClick={() => setSelectedNetwork(network.code)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedNetwork === network.code
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-full ${network.color} flex items-center justify-center text-white font-bold text-xl mb-2`}
                >
                  {network.logo}
                </div>
                <p className="text-sm font-medium text-foreground text-center">
                  {network.name}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enter Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
            leftIcon={<Phone className="w-5 h-5" />}
          />

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    amount === amt.toString()
                      ? "btn-gold text-primary-foreground"
                      : "glass hover:border-primary/50"
                  }`}
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
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
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
              <span className="text-muted-foreground">Network</span>
              <span className="text-foreground">{selectedNetwork}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone</span>
              <span className="text-foreground">{phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground font-bold">{formatCurrency(parseInt(amount) || 0)}</span>
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
            onClick={handlePurchase}
            isLoading={isLoading}
          >
            Confirm Purchase
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
              Airtime Sent!
            </h3>
            <p className="text-muted-foreground">
              {formatCurrency(parseInt(amount))} airtime has been sent to {phone}
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
