"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tv, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { utilitiesAPI } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { TVPlan } from "@/types";

const providers = [
  { value: "DSTV", label: "DStv" },
  { value: "GOTV", label: "GOtv" },
  { value: "STARTIMES", label: "Startimes" },
];

export default function CablePage() {
  const [provider, setProvider] = useState("");
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [plans, setPlans] = useState<TVPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<TVPlan | null>(null);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  useEffect(() => {
    if (provider) {
      fetchPlans();
    }
  }, [provider]);

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    setSelectedPlan(null);
    try {
      const response = await utilitiesAPI.getTVPlans(provider);
      setPlans(response.data);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleVerify = async () => {
    if (!provider || !smartcardNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await utilitiesAPI.verifySmartcard({
        provider,
        smartcard_number: smartcardNumber,
      });
      setCustomerName(response.data.customer_name);
      setIsVerified(true);
      toast.success("Smartcard verified");
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
      toast.error("Please verify smartcard first");
      return;
    }
    if (!selectedPlan) {
      toast.error("Please select a plan");
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
      const response = await utilitiesAPI.payTV({
        provider,
        smartcard_number: smartcardNumber,
        plan_id: selectedPlan!.id,
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
    setProvider("");
    setSmartcardNumber("");
    setCustomerName("");
    setSelectedPlan(null);
    setPlans([]);
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
          Cable TV Subscription
        </h1>
        <p className="text-muted-foreground">
          Subscribe to DStv, GOtv, and Startimes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider & Smartcard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select
            label="Select Provider"
            options={providers}
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setIsVerified(false);
            }}
            placeholder="Choose provider"
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Smartcard/IUC Number"
                placeholder="Enter smartcard number"
                value={smartcardNumber}
                onChange={(e) => {
                  setSmartcardNumber(e.target.value);
                  setIsVerified(false);
                }}
                leftIcon={<Tv className="w-5 h-5" />}
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

      {provider && (
        <Card>
          <CardHeader>
            <CardTitle>Select Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPlans ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : plans.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      selectedPlan?.id === plan.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{plan.name}</p>
                        <p className="text-sm text-muted-foreground">{plan.validity}</p>
                      </div>
                      <span className="text-primary font-bold text-lg">
                        {formatCurrency(plan.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tv className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No plans available</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {selectedPlan && (
            <div className="glass-card rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Plan</p>
                  <p className="font-bold text-foreground">{selectedPlan.name}</p>
                </div>
                <p className="text-xl font-bold text-gradient-gold">
                  {formatCurrency(selectedPlan.price)}
                </p>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!isVerified || !selectedPlan}
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
              <span className="text-muted-foreground">Provider</span>
              <span className="text-foreground">{provider}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Smartcard</span>
              <span className="text-foreground">{smartcardNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span className="text-foreground">{customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <span className="text-foreground">{selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground font-bold">
                {formatCurrency(selectedPlan?.price || 0)}
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
            Confirm Subscription
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
              Subscription Successful!
            </h3>
            <p className="text-muted-foreground">
              {selectedPlan?.name} subscription activated for {customerName}
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
