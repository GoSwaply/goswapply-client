"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Upload, ArrowRight, CheckCircle, Loader2, Copy } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { cryptoAPI } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { CryptoCurrency, CryptoExchangeRate } from "@/types";

export default function CryptoPage() {
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [rates, setRates] = useState<CryptoExchangeRate[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency | null>(null);
  const [amount, setAmount] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [txHash, setTxHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCurrency && amount && rates.length > 0) {
      const rate = rates.find((r) => r.currency === selectedCurrency.symbol);
      if (rate) {
        const amountNum = parseFloat(amount);
        const usdtValue = amountNum * rate.usdt_rate;
        const ngnValue = usdtValue * rate.ngn_rate;
        setCalculatedAmount(ngnValue);
      }
    }
  }, [selectedCurrency, amount, rates]);

  const fetchData = async () => {
    try {
      const [currenciesRes, ratesRes] = await Promise.all([
        cryptoAPI.getCurrencies(),
        cryptoAPI.getRates(),
      ]);
      setCurrencies(currenciesRes.data);
      setRates(ratesRes.data);
    } catch {
      toast.error("Failed to load crypto data");
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should not exceed 5MB");
        return;
      }
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyAddress = () => {
    if (selectedCurrency) {
      navigator.clipboard.writeText(selectedCurrency.wallet_address);
      toast.success("Wallet address copied!");
    }
  };

  const handleSubmit = async () => {
    if (!selectedCurrency || !amount || !proofImage) {
      toast.error("Please fill in all fields and upload payment proof");
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum < selectedCurrency.min_amount || amountNum > selectedCurrency.max_amount) {
      toast.error(
        `Amount must be between ${selectedCurrency.min_amount} and ${selectedCurrency.max_amount} ${selectedCurrency.symbol}`
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("currency", selectedCurrency.symbol);
      formData.append("amount", amount);
      formData.append("payment_screenshot", proofImage);
      if (txHash) {
        formData.append("transaction_hash", txHash);
      }

      const response = await cryptoAPI.sell(formData);
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
    setSelectedCurrency(null);
    setAmount("");
    setProofImage(null);
    setImagePreview("");
    setTxHash("");
    setShowSuccessModal(false);
  };

  const getRate = (symbol: string) => {
    const rate = rates.find((r) => r.currency === symbol);
    return rate ? `${formatCurrency(rate.usdt_rate * rate.ngn_rate)}/unit` : "Loading...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Sell Crypto
        </h1>
        <p className="text-muted-foreground">
          Exchange your cryptocurrency for Naira
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Cryptocurrency</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCurrencies ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currencies.map((currency) => (
                <button
                  key={currency.id}
                  onClick={() => setSelectedCurrency(currency)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    selectedCurrency?.id === currency.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold mb-2">
                    <Bitcoin className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-foreground text-center">
                    {currency.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    {currency.network}
                  </p>
                  <p className="text-xs text-primary text-center mt-1">
                    {getRate(currency.symbol)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCurrency && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Send to This Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="glass-card rounded-xl p-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Network</p>
                  <p className="text-foreground font-medium">
                    {selectedCurrency.network}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Wallet Address
                  </p>
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                    <code className="flex-1 text-sm text-foreground break-all">
                      {selectedCurrency.wallet_address}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-yellow-500">
                  Only send {selectedCurrency.symbol} on {selectedCurrency.network}{" "}
                  network. Sending other coins may result in loss.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label={`Amount (${selectedCurrency.symbol})`}
                type="number"
                placeholder={`Min: ${selectedCurrency.min_amount}, Max: ${selectedCurrency.max_amount}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                leftIcon={<Bitcoin className="w-5 h-5" />}
              />

              <Input
                label="Transaction Hash (Optional)"
                placeholder="Enter transaction hash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Upload Payment Screenshot
                </label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
                    imagePreview
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => document.getElementById("proof-image")?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Proof preview"
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
                        Click to upload payment proof
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="proof-image"
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
                Submit Transaction
              </Button>
            </CardContent>
          </Card>
        </>
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
              Transaction Submitted
            </h3>
            <p className="text-muted-foreground">
              Your crypto transaction is being reviewed. You&apos;ll receive
              payment once confirmed.
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
