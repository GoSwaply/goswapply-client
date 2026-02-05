"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Upload, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { giftcardsAPI } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { GiftCardType, GiftCardRate } from "@/types";

export default function GiftCardsPage() {
  const [cardTypes, setCardTypes] = useState<GiftCardType[]>([]);
  const [selectedType, setSelectedType] = useState<GiftCardType | null>(null);
  const [rates, setRates] = useState<GiftCardRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<GiftCardRate | null>(null);
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
    if (selectedRate && amount) {
      const amountUsd = parseFloat(amount);
      if (amountUsd >= selectedRate.min_amount && amountUsd <= selectedRate.max_amount) {
        setCalculatedAmount(amountUsd * selectedRate.rate);
      } else {
        setCalculatedAmount(0);
      }
    }
  }, [selectedRate, amount]);

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
    if (amountUsd < selectedRate.min_amount || amountUsd > selectedRate.max_amount) {
      toast.error(
        `Amount must be between $${selectedRate.min_amount} and $${selectedRate.max_amount}`
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("card_type", selectedType.code);
      formData.append("country", selectedRate.country);
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
          Convert your gift cards to Naira instantly
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
                    key={rate.id}
                    onClick={() => setSelectedRate(rate)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      selectedRate?.id === rate.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{rate.country}</p>
                        <p className="text-sm text-muted-foreground">
                          ${rate.min_amount} - ${rate.max_amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold">
                          {formatCurrency(rate.rate)}/USD
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
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
              label={`Card Value (USD) - Min: $${selectedRate.min_amount}, Max: $${selectedRate.max_amount}`}
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
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">You will receive</span>
                  <span className="text-2xl font-bold text-gradient-gold">
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
        title="Submitted!"
        showClose={false}
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Card Submitted for Review
            </h3>
            <p className="text-muted-foreground">
              Your gift card is being reviewed. You&apos;ll receive payment once
              approved.
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
