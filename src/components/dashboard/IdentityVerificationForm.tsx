"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { walletAPI } from "@/lib/api";
import { normalizeError, toToastMessage } from "@/lib/errors";
import type { Bank } from "@/types";

interface IdentityVerificationFormProps {
  /** Called once the provider has accepted the details for checking. */
  onSubmitted: () => void;
}

/**
 * Collects the BVN and bank account Paystack requires before it will assign a
 * dedicated account to a customer of a financial-services business.
 *
 * Nothing entered here is stored by us — it goes to the provider and is
 * discarded. The copy says so, because asking for a BVN without explaining why
 * is how you lose the user at this step.
 */
export default function IdentityVerificationForm({
  onSubmitted,
}: IdentityVerificationFormProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [bvn, setBvn] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    walletAPI
      .getBanks()
      .then((response) => {
        if (cancelled) return;
        setBanks(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        if (cancelled) return;
        toast.error(
          toToastMessage(normalizeError(error, { resource: "bank list" }))
        );
      })
      .finally(() => {
        if (!cancelled) setBanksLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const bankOptions = useMemo(
    () => banks.map((b) => ({ value: b.code, label: b.name })),
    [banks]
  );

  // Mirrors the API's DTO so the user is corrected before a round trip.
  const bvnValid = /^\d{11}$/.test(bvn);
  const accountValid = /^\d{10}$/.test(accountNumber);
  const canSubmit = bvnValid && accountValid && Boolean(bankCode) && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await walletAPI.verifyIdentity({ bvn, bankCode, accountNumber });
      toast.success("Details submitted. We are verifying them now.");
      onSubmitted();
    } catch (error: unknown) {
      toast.error(
        toToastMessage(
          normalizeError(error, { isWrite: true, resource: "verification" })
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex gap-3 p-4 rounded-xl glass">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="text-foreground font-medium mb-1">
            One-time verification
          </p>
          <p>
            Our payment partner is required by law to verify your identity
            before issuing a bank account in your name. These details are sent
            straight to them and are never stored by Swaply.
          </p>
        </div>
      </div>

      <Input
        label="Bank Verification Number (BVN)"
        inputMode="numeric"
        maxLength={11}
        placeholder="22212345678"
        value={bvn}
        onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
        error={bvn && !bvnValid ? "BVN must be exactly 11 digits" : undefined}
      />

      <Select
        label="Your bank"
        options={bankOptions}
        placeholder={banksLoading ? "Loading banks…" : "Select your bank"}
        value={bankCode}
        disabled={banksLoading || bankOptions.length === 0}
        onChange={(e) => setBankCode(e.target.value)}
      />

      <Input
        label="Account number"
        inputMode="numeric"
        maxLength={10}
        placeholder="0123456789"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
        error={
          accountNumber && !accountValid
            ? "Account number must be exactly 10 digits"
            : undefined
        }
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={submitting}
        disabled={!canSubmit}
      >
        Verify and create my account
      </Button>
    </form>
  );
}
