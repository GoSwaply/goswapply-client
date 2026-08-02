import { create } from "zustand";
import { Wallet, Transaction, FundingAccount } from "@/types";
import { walletAPI } from "@/lib/api";
import { normalizeError, type AppError } from "@/lib/errors";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface ResourceState {
  status: AsyncStatus;
  error: AppError | null;
}

const IDLE: ResourceState = { status: "idle", error: null };
const LOADING: ResourceState = { status: "loading", error: null };
const LOADED: ResourceState = { status: "success", error: null };

/**
 * The API returns a bare array; older/other endpoints wrap in `results` or
 * `data`. Anything unrecognised becomes an empty list rather than a crash.
 */
function toList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.results)) return obj.results as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
  }
  return [];
}

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  fundingAccounts: FundingAccount[];

  /**
   * Per-resource state. `status: "success"` with an empty list means "there is
   * genuinely nothing here" — which is NOT an error and must render an empty
   * state. Only `status: "error"` means we failed to load.
   */
  walletState: ResourceState;
  transactionsState: ResourceState;
  fundingAccountsState: ResourceState;

  fetchWallet: () => Promise<void>;
  fetchTransactions: (params?: Record<string, unknown>) => Promise<void>;
  fetchFundingAccounts: () => Promise<void>;
  /** Claims a dedicated account. Only called on an explicit funding attempt. */
  provisionFundingAccount: () => Promise<void>;
  clearErrors: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  transactions: [],
  fundingAccounts: [],

  walletState: IDLE,
  transactionsState: IDLE,
  fundingAccountsState: IDLE,

  fetchWallet: async () => {
    set({ walletState: LOADING });
    try {
      const response = await walletAPI.getWallet();
      set({ wallet: response.data ?? null, walletState: LOADED });
    } catch (error: unknown) {
      // Balance is money-critical: never blank it out on a refresh failure.
      // Stale-with-a-warning beats showing nothing or, worse, zero.
      set({
        walletState: {
          status: "error",
          error: normalizeError(error, { resource: "wallet balance" }),
        },
      });
    }
  },

  fetchTransactions: async (params) => {
    set({ transactionsState: LOADING });
    try {
      const response = await walletAPI.getTransactions(params);
      // An empty array is a perfectly good result — success, not an error.
      set({
        transactions: toList<Transaction>(response.data),
        transactionsState: LOADED,
      });
    } catch (error: unknown) {
      set({
        transactionsState: {
          status: "error",
          error: normalizeError(error, { resource: "transactions" }),
        },
      });
    }
  },

  fetchFundingAccounts: async () => {
    set({ fundingAccountsState: LOADING });
    try {
      const response = await walletAPI.getFundingAccounts();
      set({
        fundingAccounts: toList<FundingAccount>(response.data),
        fundingAccountsState: LOADED,
      });
    } catch (error: unknown) {
      set({
        fundingAccountsState: {
          status: "error",
          error: normalizeError(error, { resource: "funding accounts" }),
        },
      });
    }
  },

  provisionFundingAccount: async () => {
    set({ fundingAccountsState: LOADING });
    try {
      const response = await walletAPI.provisionFundingAccount();
      set({
        fundingAccounts: toList<FundingAccount>(response.data),
        fundingAccountsState: LOADED,
      });
    } catch (error: unknown) {
      set({
        fundingAccountsState: {
          status: "error",
          error: normalizeError(error, { resource: "funding account" }),
        },
      });
    }
  },

  clearErrors: () =>
    set({
      walletState: IDLE,
      transactionsState: IDLE,
      fundingAccountsState: IDLE,
    }),
}));
