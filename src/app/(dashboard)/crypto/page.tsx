"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Upload, ArrowRight, CheckCircle, Loader2, Copy, Clock, ShieldCheck, RefreshCw } from "lucide-react";
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

  // Financial Rate Lock Timer (5 Minutes countdown)
  const [rateLockTimeLeft, setRateLockTimeLeft] = useState(300);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRateLockTimeLeft((prev) => {
        if (prev <= 1) {
          fetchData();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedCurrency && amount && rates.length > 0) {
      const rate = rates.find((r) => r.currency === selectedCurrency.symbol);
      if (rate) {
        const amountNum = parseFloat(amount);
        if (amountNum > 0) {
          const usdtValue = amountNum * rate.usdt_rate;
          const ngnValue = usdtValue * rate.ngn_rate;
          setCalculatedAmount(ngnValue);
        } else {
          setCalculatedAmount(0);
        }
      }
    } else {
      setCalculatedAmount(0);
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
      setRateLockTimeLeft(300);
    } catch {
      toast.error("Failed to load crypto data");
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

  // 2% Exchange Platform Fee calculations
  const platformFee = calculatedAmount * 0.02;
  const netPayout = calculatedAmount - platformFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Sell Crypto
          </h1>
          <p className="text-muted-foreground">
            Exchange your cryptocurrency with instant rate locking & atomic wallet settlement
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-mono text-primary">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>Rate Lock: {formatTime(rateLockTimeLeft)}</span>
          <button onClick={fetchData} title="Refresh rates" className="hover:rotate-180 transition-transform">
            <RefreshCw className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
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
                    "p-4 rounded-xl border-2 transition-all text-left",
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
                    <code className="flex-1 text-sm text-foreground break-all font-mono">
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
                <p className="text-xs text-yellow-500 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 inline" />
                  Only send {selectedCurrency.symbol} on {selectedCurrency.network}{" "}
                  network. Atomic ledger verification applies upon receipt.
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
                <div className="glass-card rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gross Value</span>
                    <span className="text-foreground font-mono">{formatCurrency(calculatedAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Platform Exchange Margin (2%)</span>
                    <span className="text-muted-foreground font-mono">-{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <span className="font-medium text-foreground">Net Credit to Wallet</span>
                    <span className="text-2xl font-bold text-gradient-gold font-mono">
                      {formatCurrency(netPayout)}
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
                Submit Exchange Order
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <Modal
        isOpen={showSuccessModal}
        onClose={resetForm}
        title="Exchange Order Submitted"
        showClose={false}
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Order Submitted
            </h3>
            <p className="text-sm text-muted-foreground">
              Your exchange submission has been logged into the transaction processing queue.
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 text-left space-y-3 text-sm">
            <div className="flex items-center gap-2 text-green-500 font-medium">
              <CheckCircle className="w-4 h-4" /> 1. Order Logged & Reference Generated
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <Loader2 className="w-4 h-4 animate-spin" /> 2. Blockchain & Screenshot Verification
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4" /> 3. Atomic Wallet Settlement & Credit
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Transaction Reference</p>
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
