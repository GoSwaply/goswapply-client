"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Loader2, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { giftcardsAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type BuyOffer = {
  rateId: string;
  brand: string;
  countryName: string;
  currency: string;
  format: string;
  minAmount: number;
  maxAmount: number;
  buyRatePerUnit: number;
};
type CommerceRecord = {
  id: string;
  brand?: string;
  currency?: string;
  cardAmount?: number;
  amount?: number;
  totalNaira?: number;
  status: string;
  reference: string;
  fulfillmentNote?: string | null;
  createdAt: string;
};

export default function GiftCardCommercePanel({
  mode,
}: {
  mode: "buy" | "withdraw";
}) {
  const [offers, setOffers] = useState<BuyOffer[]>([]);
  const [orders, setOrders] = useState<CommerceRecord[]>([]);
  const [withdrawals, setWithdrawals] = useState<CommerceRecord[]>([]);
  const [rateId, setRateId] = useState("");
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.rateId === rateId),
    [offers, rateId],
  );
  const cost = selectedOffer ? Number(amount || 0) * selectedOffer.buyRatePerUnit : 0;

  const refresh = async () => {
    const [offerResponse, orderResponse, withdrawalResponse] = await Promise.all([
      giftcardsAPI.getBuyOffers(),
      giftcardsAPI.getPurchases(),
      giftcardsAPI.getWithdrawals(),
    ]);
    setOffers(offerResponse.data);
    setOrders(orderResponse.data);
    setWithdrawals(withdrawalResponse.data);
  };

  useEffect(() => {
    refresh()
      .catch(() => toast.error("Could not load gift-card account details"))
      .finally(() => setLoading(false));
  }, []);

  const submitBuy = async () => {
    if (!selectedOffer || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      toast.error("Choose a card option and enter a valid amount");
      return;
    }
    if (Number(amount) < selectedOffer.minAmount || Number(amount) > selectedOffer.maxAmount) {
      toast.error(`Enter between ${selectedOffer.minAmount} and ${selectedOffer.maxAmount} ${selectedOffer.currency}`);
      return;
    }
    setBusy(true);
    try {
      await giftcardsAPI.buy({ rateId, amount: Number(amount) });
      toast.success("Order placed. Your wallet was debited and the order is queued for fulfillment.");
      setAmount("");
      await refresh();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Could not place gift-card order");
    } finally {
      setBusy(false);
    }
  };

  const submitWithdrawal = async () => {
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 || !accountName.trim() || !accountNumber.trim() || !bankName.trim()) {
      toast.error("Enter a valid amount and complete bank details");
      return;
    }
    setBusy(true);
    try {
      await giftcardsAPI.requestWithdrawal({
        amount: Number(amount),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim(),
      });
      toast.success("Withdrawal request submitted for admin payout");
      setAmount("");
      await refresh();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Could not request withdrawal");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {mode === "buy" ? (
        <>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Buy a gift card</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {offers.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {offers.map((offer) => (
                    <button
                      type="button"
                      key={offer.rateId}
                      onClick={() => setRateId(offer.rateId)}
                      className={`rounded-xl border-2 p-4 text-left transition-colors ${rateId === offer.rateId ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                    >
                      <p className="font-bold">{offer.brand} · {offer.countryName}</p>
                      <p className="text-sm text-muted-foreground">{offer.currency} · {offer.format}</p>
                      <p className="mt-2 text-sm font-semibold text-primary">
                        {formatCurrency(offer.buyRatePerUnit)} / {offer.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {offer.minAmount}–{offer.maxAmount} {offer.currency}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">Gift-card buying is not available yet. Check back after the desk publishes an offer.</p>
              )}
              {selectedOffer && (
                <>
                  <Input
                    label={`Amount (${selectedOffer.currency})`}
                    type="number"
                    min={selectedOffer.minAmount}
                    max={selectedOffer.maxAmount}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <span className="text-sm text-muted-foreground">Wallet debit</span>
                    <strong>{formatCurrency(cost)}</strong>
                  </div>
                  <Button className="w-full" onClick={submitBuy} isLoading={busy} disabled={busy}>Place order</Button>
                </>
              )}
            </CardContent>
          </Card>
          <History title="My gift-card orders" rows={orders} />
        </>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />Withdraw gift-card proceeds</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Only wallet funds credited from approved gift-card sales can be withdrawn here. Other wallet funds are not eligible.
              </p>
              <Input label="Amount (₦)" type="number" min={1} value={amount} onChange={(event) => setAmount(event.target.value)} />
              <Input label="Account name" value={accountName} onChange={(event) => setAccountName(event.target.value)} />
              <Input label="Account number" inputMode="numeric" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))} />
              <Input label="Bank name" value={bankName} onChange={(event) => setBankName(event.target.value)} />
              <Button className="w-full" onClick={submitWithdrawal} isLoading={busy} disabled={busy}>Request payout</Button>
            </CardContent>
          </Card>
          <History title="My withdrawal requests" rows={withdrawals} />
        </>
      )}
    </div>
  );
}

function History({ title, rows }: { title: string; rows: CommerceRecord[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
            <div>
              <p className="font-semibold">{row.brand ? `${row.brand} · ${row.cardAmount} ${row.currency}` : formatCurrency(row.amount ?? 0)}</p>
              <p className="text-xs text-muted-foreground">{row.reference} · {new Date(row.createdAt).toLocaleString()}</p>
              {row.fulfillmentNote && <p className="mt-1 break-all text-sm">{row.fulfillmentNote}</p>}
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{row.status}</span>
          </div>
        ))}
        {!rows.length && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
      </CardContent>
    </Card>
  );
}
