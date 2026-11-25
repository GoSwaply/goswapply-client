"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, Phone, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { vtuAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { DataPlan, NetworkProvider, VasFieldConfig } from "@/types";
import { SlideUpSelect, type SlideUpSelectOption } from "@/components/bills/SlideUpSelect";

const defaultNetworks: { code: NetworkProvider; name: string; color: string; logo: string }[] = [
  { code: "mtn", name: "MTN Nigeria", color: "bg-yellow-500", logo: "M" },
  { code: "glo", name: "Glo", color: "bg-green-600", logo: "G" },
  { code: "airtel", name: "Airtel", color: "bg-red-600", logo: "A" },
  { code: "9mobile", name: "9mobile", color: "bg-green-500", logo: "9" },
];

export default function DataPage() {
  const [networks, setNetworks] = useState(defaultNetworks);
  const [fieldConfig, setFieldConfig] = useState<VasFieldConfig>({});
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkProvider | "">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  useEffect(() => {
    let active = true;
    vtuAPI.getNetworks().then(({ data }) => {
      if (!active) return;
      const config = data.fieldConfig?.data;
      const options = config?.networkOptions ?? [];
      const mapped = options.map((option) => {
        const known = defaultNetworks.find((network) => network.code === option.value);
        return {
          code: option.value as NetworkProvider,
          name: option.label,
          color: known?.color ?? "bg-emerald-700",
          logo: known?.logo ?? option.label.slice(0, 1).toUpperCase(),
        };
      });
      setFieldConfig(config ?? {});
      if (mapped.length > 0) {
        setNetworks(mapped);
        setSelectedNetwork((current) =>
          current && mapped.some((network) => network.code === current)
            ? current
            : "",
        );
      }
    }).catch(() => {
      if (active) toast.error("Could not load active bill payment options");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (selectedNetwork) {
      fetchPlans();
    }
  }, [selectedNetwork]);

  const fetchPlans = async () => {
    setIsLoadingPlans(true);
    setSelectedPlan(null);
    try {
      const response = await vtuAPI.getDataPlans(selectedNetwork as NetworkProvider);
      const raw = response.data;
      type RawDataPlan = {
        item_code?: string;
        id?: string;
        short_name?: string;
        name?: string;
        plan_code?: string;
        data_amount?: string;
        validity?: string;
        amount?: number | string;
        price?: number | string;
        provider_price?: number | string;
        is_active?: boolean;
        priority?: number;
        created_at?: string;
        provider?: "interswitch" | "flutterwave";
      };
      const mapped: DataPlan[] = (Array.isArray(raw) ? raw : []).map((b: RawDataPlan) => ({
        id: b.item_code ?? b.id ?? "",
        network: selectedNetwork as NetworkProvider,
        name: b.short_name ?? b.name ?? "",
        plan_code: b.item_code ?? b.plan_code ?? "",
        data_amount: b.short_name ?? b.data_amount ?? "",
        validity: b.validity ?? "",
        price: Number(b.amount ?? b.price ?? 0),
        provider_price: Number(b.amount ?? b.provider_price ?? 0),
        is_active: b.is_active ?? true,
        priority: b.priority ?? 0,
        created_at: b.created_at ?? "",
        provider: b.provider ?? "flutterwave",
      }));
      setPlans(mapped);
    } catch {
      toast.error("Failed to load data plans");
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedNetwork) {
      toast.error("Please select a network");
      return;
    }
    if (!phoneNumber || phoneNumber.length !== 11) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!selectedPlan) {
      toast.error("Please select a data plan");
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
      const response = await vtuAPI.buyData({
        phone_number: phoneNumber,
        network: selectedNetwork as NetworkProvider,
        plan_id: selectedPlan!.id,
        provider: selectedPlan!.provider,
        amount: selectedPlan!.price,
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
    setPhoneNumber("");
    setSelectedPlan(null);
    setPlans([]);
    setShowSuccessModal(false);
  };
  const networkOptions: SlideUpSelectOption[] = networks.map((network) => ({
    value: network.code,
    label: network.name,
    leading: (
      <span className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${network.color}`}>
        {network.logo}
      </span>
    ),
  }));
  const planOptions: SlideUpSelectOption[] = plans.map((plan) => ({
    value: plan.id,
    label: plan.data_amount,
    description: `${plan.validity} · ${plan.provider ?? "Flutterwave"}`,
    trailing: <span className="font-bold text-primary">{formatCurrency(plan.price)}</span>,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Buy Data Bundle
        </h1>
        <p className="text-muted-foreground">
          Purchase data plans for any network
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{fieldConfig.providerLabel || "Select Network"}</CardTitle>
        </CardHeader>
        <CardContent>
          <SlideUpSelect
            title="Choose a network"
            description="Select the network for this purchase"
            placeholder="Choose a mobile network"
            options={networkOptions}
            value={selectedNetwork}
            onChange={(value) => {
              setSelectedNetwork(value as NetworkProvider);
              setSelectedPlan(null);
            }}
          />
        </CardContent>
      </Card>

      {selectedNetwork && (
        <Card>
          <CardHeader>
            <CardTitle>Select Data Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPlans ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : plans.length > 0 ? (
              <SlideUpSelect
                title="Choose a data plan"
                description={`${plans.length} available plans for ${selectedNetwork}`}
                placeholder="Choose a data plan"
                options={planOptions}
                value={selectedPlan?.id ?? ""}
                onChange={(value) => setSelectedPlan(plans.find((plan) => plan.id === value) ?? null)}
              />
            ) : (
              <div className="text-center py-12">
                <Wifi className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No plans available</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Enter Phone Number</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label={fieldConfig.customerLabel || "Phone Number"}
            type="tel"
            placeholder={fieldConfig.placeholder || "08012345678"}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
            leftIcon={<Phone className="w-5 h-5" />}
          />

          {selectedPlan && (
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Plan</p>
                  <p className="font-bold text-foreground">
                    {selectedPlan.data_amount} - {selectedPlan.validity}
                  </p>
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
            disabled={!selectedPlan}
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
              <span className="text-foreground">{phoneNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <span className="text-foreground">{selectedPlan?.data_amount}</span>
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
              Data Purchased!
            </h3>
            <p className="text-muted-foreground">
              {selectedPlan?.data_amount} data has been sent to {phoneNumber}
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
