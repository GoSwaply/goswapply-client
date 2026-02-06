import axios from "axios";
import Cookies from "js-cookie";
import type {
  LoginRequest,
  RegisterRequest,
  ProfileUpdateRequest,
  SetPinRequest,
  VerifyPinRequest,
  OTPRequest,
  OTPVerifyRequest,
  WithdrawRequest,
  TransferRequest,
  BuyAirtimeRequest,
  BuyDataRequest,
  BuyElectricityRequest,
  BuyTVRequest,
  FundBettingRequest,
  FlightSearchRequest,
  FlightBookingRequest,
  TransactionFilter,
  NetworkProvider,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          Cookies.set("access_token", access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTHENTICATION API
// ==========================================
export const authAPI = {
  login: (data: LoginRequest) => api.post("/auth/login/", data),
  register: (data: RegisterRequest) => api.post("/auth/register/", data),
  logout: () => api.post("/auth/logout/"),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (data: ProfileUpdateRequest) => {
    if (data.profile_picture) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });
      return api.put("/auth/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put("/auth/profile/", data);
  },
  setPin: (data: SetPinRequest) => api.post("/auth/set-pin/", data),
  verifyPin: (data: VerifyPinRequest) => api.post("/auth/verify-pin/", data),
  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post("/auth/change-password/", data),
  requestOtp: (data: OTPRequest) => api.post("/auth/request-otp/", data),
  verifyOtp: (data: OTPVerifyRequest) => api.post("/auth/verify-otp/", data),
  resetPassword: (data: { email: string }) => api.post("/auth/reset-password/", data),
  confirmResetPassword: (data: { token: string; new_password: string }) =>
    api.post("/auth/reset-password/confirm/", data),
};

// ==========================================
// WALLET API
// ==========================================
export const walletAPI = {
  getWallet: () => api.get("/wallet/"),
  getSummary: () => api.get("/wallet/summary/"),
  getTransactions: (params?: TransactionFilter) => api.get("/wallet/transactions/", { params }),
  getTransaction: (reference: string) => api.get(`/wallet/transactions/${reference}/`),
  getFundingAccounts: () => api.get("/wallet/funding-accounts/"),
  getDVA: () => api.get("/wallet/dva/"),
  createDVA: () => api.post("/wallet/dva/create/"),
  withdraw: (data: WithdrawRequest) => api.post("/wallet/withdraw/", data),
  transfer: (data: TransferRequest) => api.post("/wallet/transfer/", data),
  getBanks: () => api.get("/wallet/banks/"),
  verifyBankAccount: (data: { bank_code: string; account_number: string }) =>
    api.post("/wallet/verify-account/", data),
};

// ==========================================
// VTU (AIRTIME & DATA) API
// ==========================================
export const vtuAPI = {
  getNetworks: () => api.get("/vtu/networks/"),
  getNetworkDiscounts: () => api.get("/vtu/discounts/"),

  // Airtime
  buyAirtime: (data: BuyAirtimeRequest) => api.post("/vtu/airtime/buy/", data),
  getAirtimeHistory: (params?: TransactionFilter) => api.get("/vtu/airtime/history/", { params }),

  // Data
  getDataPlans: (network?: NetworkProvider) => api.get("/vtu/data/plans/", { params: { network } }),
  buyData: (data: BuyDataRequest) => api.post("/vtu/data/buy/", data),
  getDataHistory: (params?: TransactionFilter) => api.get("/vtu/data/history/", { params }),
};

// ==========================================
// UTILITIES API (ELECTRICITY & TV)
// ==========================================
export const utilitiesAPI = {
  // Electricity
  getElectricityProviders: () => api.get("/utilities/electricity/providers/"),
  verifyMeter: (data: { provider_code: string; meter_number: string; meter_type: "prepaid" | "postpaid" }) =>
    api.post("/utilities/electricity/verify/", data),
  buyElectricity: (data: BuyElectricityRequest) => api.post("/utilities/electricity/buy/", data),
  getElectricityHistory: (params?: TransactionFilter) =>
    api.get("/utilities/electricity/history/", { params }),

  // TV/Cable
  getTVProviders: () => api.get("/utilities/tv/providers/"),
  getTVPlans: (provider_code: string) => api.get("/utilities/tv/plans/", { params: { provider: provider_code } }),
  verifySmartcard: (data: { provider_code: string; smartcard_number: string }) =>
    api.post("/utilities/tv/verify/", data),
  buyTV: (data: BuyTVRequest) => api.post("/utilities/tv/buy/", data),
  getTVHistory: (params?: TransactionFilter) => api.get("/utilities/tv/history/", { params }),
};

// ==========================================
// BETTING API
// ==========================================
export const bettingAPI = {
  getProviders: () => api.get("/betting/providers/"),
  verifyCustomer: (data: { provider_code: string; customer_id: string }) =>
    api.post("/betting/verify/", data),
  fundAccount: (data: FundBettingRequest) => api.post("/betting/fund/", data),
  getBettingHistory: (params?: TransactionFilter) => api.get("/betting/history/", { params }),
};

// ==========================================
// FLIGHTS API
// ==========================================
export const flightsAPI = {
  getAirports: (query?: string) => api.get("/flights/airports/", { params: { q: query } }),
  getAirlines: () => api.get("/flights/airlines/"),
  search: (data: FlightSearchRequest) => api.post("/flights/search/", data),
  getSearchResults: (searchId: string) => api.get(`/flights/search/${searchId}/`),
  book: (data: FlightBookingRequest) => api.post("/flights/book/", data),
  getBooking: (reference: string) => api.get(`/flights/bookings/${reference}/`),
  getBookings: (params?: TransactionFilter) => api.get("/flights/bookings/", { params }),
  cancelBooking: (reference: string) => api.post(`/flights/bookings/${reference}/cancel/`),
};

// ==========================================
// GIFT CARDS API
// ==========================================
export const giftcardsAPI = {
  getTypes: () => api.get("/giftcards/types/"),
  getRates: (typeCode: string, country?: string) =>
    api.get("/giftcards/rates/", { params: { card_type: typeCode, country } }),
  calculateRate: (data: { card_type_code: string; card_country: string; card_value_usd: number }) =>
    api.post("/giftcards/calculate/", data),
  sell: (data: FormData) =>
    api.post("/giftcards/sell/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  getHistory: (params?: TransactionFilter) => api.get("/giftcards/history/", { params }),
  getTransaction: (reference: string) => api.get(`/giftcards/transactions/${reference}/`),
};

// ==========================================
// CRYPTOCURRENCY API
// ==========================================
export const cryptoAPI = {
  getCurrencies: () => api.get("/crypto/currencies/"),
  getRates: () => api.get("/crypto/rates/"),
  calculateRate: (data: { currency_symbol: string; crypto_amount: number }) =>
    api.post("/crypto/calculate/", data),
  sell: (data: FormData) =>
    api.post("/crypto/sell/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  uploadProof: (reference: string, data: FormData) =>
    api.post(`/crypto/transactions/${reference}/upload-proof/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getHistory: (params?: TransactionFilter) => api.get("/crypto/history/", { params }),
  getTransaction: (reference: string) => api.get(`/crypto/transactions/${reference}/`),
};

// ==========================================
// NOTIFICATIONS API
// ==========================================
export const notificationsAPI = {
  getNotifications: (params?: { is_read?: boolean; page?: number; page_size?: number }) =>
    api.get("/notifications/", { params }),
  markAsRead: (id: string) => api.post(`/notifications/${id}/read/`),
  markAllAsRead: () => api.post("/notifications/read-all/"),
  getUnreadCount: () => api.get("/notifications/unread-count/"),
};

export default api;
