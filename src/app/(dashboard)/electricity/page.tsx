"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, CheckCircle, Copy, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { utilitiesAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const providers = [
  { value: "IKEDC", label: "Ikeja Electric (IKEDC)" },
  { value: "EKEDC", label: "Eko Electric (EKEDC)" },
  { value: "AEDC", label: "Abuja Electric (AEDC)" },
  { value: "KEDCO", label: "Kano Electric (KEDCO)" },
  { value: "PHED", label: "Port Harcourt Electric (PHED)" },
  { value: "JED", label: "Jos Electric (JED)" },
  { value: "IBEDC", label: "Ibadan Electric (IBEDC)" },
  { value: "KAEDCO", label: "Kaduna Electric (KAEDCO)" },
  { value: "EEDC", label: "Enugu Electric (EEDC)" },
  { value: "BEDC", label: "Benin Electric (BEDC)" },
];

const meterTypes = [
  { value: "prepaid", label: "Prepaid" },
  { value: "postpaid", label: "Postpaid" },
];

export default function ElectricityPage() {
  const [provider, setProvider] = useState("");
  const [meterType, setMeterType] = useState<"prepaid" | "postpaid">("prepaid");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [pin, setPin] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  const handleVerify = async () => {
    if (!provider || !meterNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await utilitiesAPI.verifyMeter({
        provider_code: provider,
        meter_number: meterNumber,
        meter_type: meterType,
      });
      setCustomerName(response.data.customer_name);
      setIsVerified(true);
      toast.success("Meter verified successfully");
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
      toast.error("Please verify meter number first");
      return;
    }
    if (!amount || parseInt(amount) < 500) {
      toast.error("Minimum amount is N500");
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
      const response = await utilitiesAPI.buyElectricity({
        provider_code: provider,
        meter_number: meterNumber,
        meter_type: meterType,
        amount: parseInt(amount),
        pin,
      });
      setTransactionRef(response.data.reference);
      setToken(response.data.token || "");
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

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard");
  };

  const resetForm = () => {
    setProvider("");
    setMeterType("prepaid");
    setMeterNumber("");
    setAmount("");
    setCustomerName("");
    setIsVerified(false);
    setToken("");
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
          Pay Electricity Bill
        </h1>
        <p className="text-muted-foreground">
          Buy prepaid tokens or pay postpaid bills
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meter Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select
            label="Distribution Company"
            options={providers}
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setIsVerified(false);
            }}
            placeholder="Select provider"
          />

          <Select
            label="Meter Type"
            options={meterTypes}
            value={meterType}
            onChange={(e) => {
              setMeterType(e.target.value as "prepaid" | "postpaid");
              setIsVerified(false);
            }}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Meter Number"
                placeholder="Enter meter number"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value);
                  setIsVerified(false);
                }}
                leftIcon={<Zap className="w-5 h-5" />}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleVerify}
                isLoading={isVerifying}
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
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-bold text-foreground">{customerName}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Amount</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount (min. N500)"
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
            {isVerified ? "Continue" : "Verify meter first"}
          </Button>
        </CardContent>
      </Card>

      <Modal isOpen={showPinModal} onClose={() => setShowPinModal(false)} title="Enter PIN">
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Provider</span>
              <span className="text-foreground">{provider}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meter</span>
              <span className="text-foreground">{meterNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
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
            onClick={handlePurchase}
            isLoading={isLoading}
          >
            Confirm Payment
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
              Payment Successful!
            </h3>
            <p className="text-muted-foreground">
              {formatCurrency(parseInt(amount))} electricity payment completed
            </p>
          </div>

          {token && (
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Token</p>
              <div className="flex items-center justify-between gap-2 bg-muted rounded-lg p-3">
                <code className="text-lg font-mono text-primary flex-1">
                  {token}
                </code>
                <button
                  onClick={copyToken}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                  <Copy className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

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
