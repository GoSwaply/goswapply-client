"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { accountAPI, authAPI } from "@/lib/api";

type Step = "form" | "success";

export default function DeleteAccountPage() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmed) {
      setError("Please tick the confirmation checkbox to proceed.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Authenticate to get a short-lived access token
      const loginRes = await authAPI.login({ email, password });
      const { accessToken } = loginRes.data;

      // Delete the account using that token
      await accountAPI.deleteAccount(accessToken);
      setStep("success");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message ?? err.response?.data?.error ?? err.message;
        setError(Array.isArray(msg) ? msg.join(", ") : msg);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal nav */}
      <nav className="border-b border-border px-6 py-4">
        <Link href="/" className="inline-flex">
          <Image
            src="https://res.cloudinary.com/deioo5lrm/image/upload/v1782721221/logo_wwjh5o.jpg"
            alt="Swaply"
            width={100}
            height={34}
            className="h-9 w-auto object-contain"
          />
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {step === "form" ? (
            <div className="glass-card rounded-3xl p-8">
              {/* Warning header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Delete Account</h1>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>

              {/* Consequences list */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-red-400 mb-1">Deleting your account will:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Permanently remove your profile and personal data</li>
                  <li>Cancel any pending transactions or bookings</li>
                  <li>Forfeit any wallet balance (ensure you withdraw first)</li>
                  <li>Revoke access to all Swaply services</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your account password"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-red-500 flex-shrink-0"
                  />
                  <span className="text-sm text-muted-foreground">
                    I understand that deleting my account is permanent and all my data will be lost.
                  </span>
                </label>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
                >
                  {loading ? "Deleting account…" : "Delete my account"}
                </button>

                <Link
                  href="/"
                  className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Cancel — go back home
                </Link>
              </form>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Account Deleted</h2>
              <p className="text-muted-foreground mb-8">
                Your Swaply account has been successfully deleted. We&apos;re sorry to see you go.
                If you ever change your mind, you can always create a new account on the app.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Swaply. All rights reserved.
      </footer>
    </div>
  );
}
