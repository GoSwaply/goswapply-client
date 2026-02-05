import { create } from "zustand";
import { Wallet, Transaction, FundingAccount } from "@/types";
import { walletAPI } from "@/lib/api";

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  fundingAccounts: FundingAccount[];
  isLoading: boolean;
  error: string | null;
  fetchWallet: () => Promise<void>;
  fetchTransactions: (params?: Record<string, unknown>) => Promise<void>;
  fetchFundingAccounts: () => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  transactions: [],
  fundingAccounts: [],
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletAPI.getWallet();
      set({ wallet: response.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({
        error: err.response?.data?.message || "Failed to fetch wallet",
        isLoading: false,
      });
    }
  },

  fetchTransactions: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletAPI.getTransactions(params);
      set({ transactions: response.data.results || response.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({
        error: err.response?.data?.message || "Failed to fetch transactions",
        isLoading: false,
      });
    }
  },

  fetchFundingAccounts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await walletAPI.getFundingAccounts();
      set({ fundingAccounts: response.data, isLoading: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      set({
        error: err.response?.data?.message || "Failed to fetch funding accounts",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
