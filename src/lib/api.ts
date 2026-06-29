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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
const API_ROOT_URL = API_BASE_URL.replace(/\/api\/v1$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send httpOnly refresh_token cookie automatically
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
        // refresh_token lives in httpOnly cookie — server reads it automatically
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        Cookies.set("access_token", accessToken, { sameSite: "strict" });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        Cookies.remove("access_token");
        if (typeof window !== "undefined") window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// PUBLIC API (no auth required)
// ==========================================
export const publicAPI = {
  health: () => axios.get(`${API_ROOT_URL}/health`),
  exchangeRates: () => axios.get(`${API_BASE_URL}/exchange/rates`),
};

// ==========================================
// AUTHENTICATION API
// ==========================================
export const authAPI = {
  register: (data: RegisterRequest) => api.post("/auth/register", data),
  verifyOtp: (data: OTPVerifyRequest) => api.post("/auth/verify-otp", data),
  resendOtp: (data: OTPRequest) => api.post("/auth/resend-otp", data),
  login: (data: LoginRequest) => api.post("/auth/login", data),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/users/me"),
  updateProfile: (data: ProfileUpdateRequest) => api.patch("/users/me", data),
  setPin: (data: SetPinRequest) => api.post("/auth/set-pin", data),
  verifyPin: (data: VerifyPinRequest) => api.post("/auth/verify-pin", data),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post("/auth/change-password", data),
  requestPasswordReset: (data: { email: string }) =>
    api.post("/auth/request-password-reset", data),
  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post("/auth/reset-password", data),
};

// ==========================================
// VAS (AIRTIME, DATA, ELECTRICITY, TV, BETTING) API
// ==========================================
export const vasAPI = {
  // Airtime
  buyAirtime: (data: BuyAirtimeRequest) => api.post("/vas/airtime", data),

  // Data
  getDataPlans: (network?: NetworkProvider) => api.get("/vas/data/plans", { params: { network } }),
  buyData: (data: BuyDataRequest) => api.post("/vas/data", data),

  // Electricity
  getElectricityProviders: () => api.get("/vas/electricity/providers"),
  validateMeter: (data: { providerId: string; meterNumber: string; meterType: "prepaid" | "postpaid" }) =>
    api.post("/vas/electricity/validate", data),
  buyElectricity: (data: BuyElectricityRequest) => api.post("/vas/electricity", data),

  // Cable TV
  getTVProviders: () => api.get("/vas/tv/providers"),
  getTVPlans: (providerId: string) => api.get("/vas/tv/plans", { params: { providerId } }),
  validateSmartcard: (data: { providerId: string; smartcardNumber: string }) =>
    api.post("/vas/tv/validate", data),
  buyTV: (data: BuyTVRequest) => api.post("/vas/tv", data),

  // Betting
  getBettingProviders: () => api.get("/vas/betting/providers"),
  validateBetting: (data: { providerId: string; customerId: string }) =>
    api.post("/vas/betting/validate", data),
  fundBetting: (data: FundBettingRequest) => api.post("/vas/betting", data),
};

// ==========================================
// FLIGHTS API
// ==========================================
export const flightsAPI = {
  search: (data: FlightSearchRequest) => api.post("/flights/search", data),
  book: (data: FlightBookingRequest) => api.post("/flights/book", data),
  getBooking: (reference: string) => api.get(`/flights/bookings/${reference}`),
  getBookings: (params?: TransactionFilter) => api.get("/flights/bookings", { params }),
};

// ==========================================
// EXCHANGE (CRYPTO & GIFT CARDS) API
// ==========================================
export const exchangeAPI = {
  getRates: () => api.get("/exchange/rates"),
  submitSell: (data: FormData) =>
    api.post("/exchange/sell", data, { headers: { "Content-Type": "multipart/form-data" } }),
  getTransaction: (reference: string) => api.get(`/exchange/transactions/${reference}`),
  getHistory: (params?: TransactionFilter) => api.get("/exchange/transactions", { params }),
};

// ==========================================
// KYC API
// ==========================================
export const kycAPI = {
  getStatus: () => api.get("/kyc/status"),
  submit: (data: FormData) =>
    api.post("/kyc/submit", data, { headers: { "Content-Type": "multipart/form-data" } }),
};

// ==========================================
// LEGACY ALIASES — kept for dashboard pages
// ==========================================
export const walletAPI = {
  getWallet: () => api.get("/wallet/balance"),
  getBalance: () => api.get("/wallet/balance"),
  getSummary: () => api.get("/wallet/balance"),
  getTransactions: (params?: TransactionFilter) => api.get("/wallet/transactions", { params }),
  getTransaction: (reference: string) => api.get(`/wallet/transactions/${reference}`),
  getFundingAccounts: () => api.get("/wallet/funding-accounts"),
  withdraw: (data: WithdrawRequest) => api.post("/wallet/withdraw", data),
  transfer: (data: TransferRequest) => api.post("/wallet/transfer", data),
  fund: (data: { amount: number }) => api.post("/wallet/fund", data),
  getBanks: () => api.get("/wallet/banks"),
  verifyBankAccount: (data: { bank_code: string; account_number: string }) =>
    api.post("/wallet/verify-account", data),
};

export const vtuAPI = {
  getNetworks: () => api.get("/vas/networks"),
  getNetworkDiscounts: () => api.get("/vas/discounts"),
  buyAirtime: (data: BuyAirtimeRequest) => api.post("/vas/airtime", data),
  getAirtimeHistory: (params?: TransactionFilter) => api.get("/vas/airtime/history", { params }),
  getDataPlans: (network?: NetworkProvider) => api.get("/vas/data/plans", { params: { network } }),
  buyData: (data: BuyDataRequest) => api.post("/vas/data", data),
  getDataHistory: (params?: TransactionFilter) => api.get("/vas/data/history", { params }),
};

export const utilitiesAPI = {
  getElectricityProviders: () => api.get("/vas/electricity/providers"),
  verifyMeter: (data: { provider_code: string; meter_number: string; meter_type: "prepaid" | "postpaid" }) =>
    api.post("/vas/electricity/validate", data),
  buyElectricity: (data: BuyElectricityRequest) => api.post("/vas/electricity", data),
  getElectricityHistory: (params?: TransactionFilter) => api.get("/vas/electricity/history", { params }),
  getTVProviders: () => api.get("/vas/tv/providers"),
  getTVPlans: (provider_code: string) => api.get("/vas/tv/plans", { params: { provider_code } }),
  verifySmartcard: (data: { provider_code: string; smartcard_number: string }) =>
    api.post("/vas/tv/validate", data),
  buyTV: (data: BuyTVRequest) => api.post("/vas/tv", data),
  getTVHistory: (params?: TransactionFilter) => api.get("/vas/tv/history", { params }),
};

export const bettingAPI = {
  getProviders: () => api.get("/vas/betting/providers"),
  verifyCustomer: (data: { provider_code: string; customer_id: string }) =>
    api.post("/vas/betting/validate", data),
  fundAccount: (data: FundBettingRequest) => api.post("/vas/betting", data),
  getBettingHistory: (params?: TransactionFilter) => api.get("/vas/betting/history", { params }),
};

export const cryptoAPI = {
  getCurrencies: () => api.get("/exchange/crypto/currencies"),
  getRates: () => api.get("/exchange/rates"),
  calculateRate: (data: { currency_symbol: string; crypto_amount: number }) =>
    api.post("/exchange/calculate", data),
  sell: (data: FormData) =>
    api.post("/exchange/sell", data, { headers: { "Content-Type": "multipart/form-data" } }),
  uploadProof: (reference: string, data: FormData) =>
    api.post(`/exchange/transactions/${reference}/upload-proof`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getHistory: (params?: TransactionFilter) => api.get("/exchange/transactions", { params }),
  getTransaction: (reference: string) => api.get(`/exchange/transactions/${reference}`),
};

export const giftcardsAPI = {
  getTypes: () => api.get("/exchange/giftcards/types"),
  getRates: (typeCode: string, country?: string) =>
    api.get("/exchange/giftcards/rates", { params: { card_type: typeCode, country } }),
  calculateRate: (data: { card_type_code: string; card_country: string; card_value_usd: number }) =>
    api.post("/exchange/giftcards/calculate", data),
  sell: (data: FormData) =>
    api.post("/exchange/giftcards/sell", data, { headers: { "Content-Type": "multipart/form-data" } }),
  getHistory: (params?: TransactionFilter) => api.get("/exchange/giftcards/history", { params }),
  getTransaction: (reference: string) => api.get(`/exchange/giftcards/transactions/${reference}`),
};

export const notificationsAPI = {
  getNotifications: (params?: { is_read?: boolean; page?: number; page_size?: number }) =>
    api.get("/notifications", { params }),
  markAsRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post("/notifications/read-all"),
  getUnreadCount: () => api.get("/notifications/unread-count"),
};

export default api;
