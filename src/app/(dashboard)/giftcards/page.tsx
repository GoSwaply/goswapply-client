"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Upload, ArrowRight, CheckCircle, Loader2, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { giftcardsAPI } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { GiftCardType, GiftCardRate, GiftCardRateOption } from "@/types";

export default function GiftCardsPage() {
  const [cardTypes, setCardTypes] = useState<GiftCardType[]>([]);
  const [selectedType, setSelectedType] = useState<GiftCardType | null>(null);
  const [rates, setRates] = useState<GiftCardRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<GiftCardRate | null>(null);
  /**
   * The exact priced option — format and band. Chosen after a country, because
   * a physical card with a receipt and a bare e-code are different prices.
   */
  const [selectedOption, setSelectedOption] =
    useState<GiftCardRateOption | null>(null);
  const [amount, setAmount] = useState("");
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    fetchCardTypes();
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetchRates();
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedOption && amount) {
      const value = parseFloat(amount);
      if (value >= selectedOption.minAmount && value <= selectedOption.maxAmount) {
        // Shown for reassurance only — the desk prices from the option id.
        setCalculatedAmount(value * selectedOption.ratePerUnit);
      } else {
        setCalculatedAmount(0);
      }
    } else {
      setCalculatedAmount(0);
    }
  }, [selectedOption, amount]);

  const fetchCardTypes = async () => {
    try {
      const response = await giftcardsAPI.getTypes();
      setCardTypes(response.data);
    } catch {
      toast.error("Failed to load gift card types");
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const fetchRates = async () => {
    if (!selectedType) return;
    setIsLoadingRates(true);
    setSelectedRate(null);
    try {
      const response = await giftcardsAPI.getRates(selectedType.code);
      setRates(response.data);
    } catch {
      toast.error("Failed to load rates");
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should not exceed 5MB");
        return;
      }
      setCardImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType || !selectedRate || !amount || !cardImage) {
      toast.error("Please fill in all fields and upload card image");
      return;
    }

    const amountUsd = parseFloat(amount);
    if (!selectedOption) return;
    if (amountUsd < selectedOption.minAmount || amountUsd > selectedOption.maxAmount) {
      toast.error(
        `Enter a value between ${selectedOption.minAmount} and ${selectedOption.maxAmount} ${selectedRate?.currency ?? ""}`
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("card_type", selectedType.code);
      formData.append("country", selectedRate?.countryName ?? "");
      // The desk prices from this, not from anything this page calculated.
      formData.append("rateId", selectedOption.id);
      formData.append("amount_usd", amount);
      formData.append("card_image", cardImage);

      const response = await giftcardsAPI.sell(formData);
      setTransactionRef(response.data.reference);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setSelectedRate(null);
    setAmount("");
    setCardImage(null);
    setImagePreview("");
    setRates([]);
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
          Sell Gift Cards
        </h1>
        <p className="text-muted-foreground">
          Convert gift cards to Naira with verified exchange rates & atomic settlement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Gift Card Type</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTypes ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cardTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    selectedType?.id === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold mb-2">
                    <Gift className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-foreground text-center">
                    {type.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle>Select Country/Currency</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRates ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : rates.length > 0 ? (
              <div className="space-y-3">
                {rates.map((rate) => (
                  <button
                    key={rate.countryCode}
                    onClick={() => {
                      setSelectedRate(rate);
                      // The previous choice belongs to another country's pricing.
                      setSelectedOption(null);
                    }}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      selectedRate?.countryCode === rate.countryCode
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{rate.countryName}</p>
                        <p className="text-sm text-muted-foreground">
                          {rate.options.length} option{rate.options.length === 1 ? "" : "s"} · {rate.currency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold">
                          up to {formatCurrency(Math.max(...rate.options.map((o) => o.ratePerUnit)))}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}

                {selectedRate && (
                  <div className="pt-2 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      A physical card with its receipt is easier to verify, so
                      it pays more than a bare e-code.
                    </p>
                    {selectedRate.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOption(option)}
                        className={cn(
                          "w-full p-3 rounded-lg border-2 text-left transition-all",
                          selectedOption?.id === option.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {option.formatLabel}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.minAmount} – {option.maxAmount}{" "}
                              {selectedRate.currency}
                            </p>
                          </div>
                          <p className="text-primary font-bold shrink-0">
                            {formatCurrency(option.ratePerUnit)} /{" "}
                            {selectedRate.currency}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No rates available for this card type
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {selectedRate && (
        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label={`Card value (${selectedRate.currency}) — ${selectedOption?.minAmount ?? ""} to ${selectedOption?.maxAmount ?? ""}`}
              type="number"
              placeholder="Enter card value"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftIcon={<span className="text-muted-foreground">$</span>}
            />

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Upload Gift Card Image
              </label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                  imagePreview
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => document.getElementById("card-image")?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Card preview"
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Click to upload card image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>
              <input
                id="card-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {calculatedAmount > 0 && (
              <div className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="text-foreground font-mono">{formatCurrency(selectedOption?.ratePerUnit ?? 0)} / {selectedRate.currency}</span>
                </div>
                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="font-medium text-foreground">Estimated Payout</span>
                  <span className="text-2xl font-bold text-gradient-gold font-mono">
                    {formatCurrency(calculatedAmount)}
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Submit for Review
            </Button>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showSuccessModal}
        onClose={resetForm}
        title="Gift Card Submitted"
        showClose={false}
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Card Submitted for Review
            </h3>
            <p className="text-sm text-muted-foreground">
              Your card image is queued for review. Payout will be credited atomically to your wallet once approved.
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 text-left space-y-3 text-sm">
            <div className="flex items-center gap-2 text-green-500 font-medium">
              <CheckCircle className="w-4 h-4" /> 1. Gift Card Image Uploaded
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Loader2 className="w-4 h-4 animate-spin" /> 2. Gift Card Code & Balance Verification
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4" /> 3. Atomic Wallet Settlement & Credit
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Reference</p>
            <p className="text-foreground font-mono font-bold text-sm">{transactionRef}</p>
          </div>
          <Button className="w-full" onClick={resetForm}>
            Done
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
