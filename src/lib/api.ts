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

const PRODUCTION_API_URL = "https://api.goswaply.com/api/v1";
const LOCAL_API_URL = "http://localhost:3000/api/v1";

/**
 * Resolves the API origin.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so a production build made
 * without NEXT_PUBLIC_API_URL set previously shipped the localhost default —
 * every request from the live site then failed with ERR_CONNECTION_REFUSED.
 * When we are demonstrably not on a developer machine, fall back to the
 * production API rather than to localhost.
 */
function resolveApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host === "[::1]";
    if (!isLocal) return PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
}

const API_BASE_URL = resolveApiBaseUrl();
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

/**
 * A dashboard mount fires several requests at once. If the access token has
 * expired they all 401 together, and refreshing once per failure both wastes
 * the server's rate-limit budget and races to write the same cookie. Every
 * caller therefore awaits one shared in-flight refresh.
 */
let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = axios
      // refresh_token lives in an httpOnly cookie — the server reads it itself
      .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((response) => {
        const accessToken: string | undefined = response.data?.accessToken;
        if (!accessToken) throw new Error("Refresh response had no accessToken");
        Cookies.set("access_token", accessToken, {
          expires: 1,
          sameSite: "Lax",
        });
        return accessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

/** Clears local session state and sends the user to sign in. */
function endSession() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth-storage");
  // Public pages must not bounce — only pull the user out of a guarded view.
  const publicPaths = ["/", "/login", "/register", "/privacy", "/delete-account"];
  if (!publicPaths.includes(window.location.pathname)) {
    window.location.href = "/login";
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }
    // Never try to refresh a failed refresh — that is the terminal case.
    if (String(originalRequest.url ?? "").includes("/auth/refresh")) {
      endSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError: unknown) {
      const refreshStatus = (
        refreshError as { response?: { status?: number } }
      )?.response?.status;

      // Only a definitive rejection means the session is really gone. A 429,
      // a 5xx or a dropped connection is transient — destroying the session
      // there logs out a user who is still perfectly valid.
      if (refreshStatus === 401 || refreshStatus === 403) {
        endSession();
      }
      return Promise.reject(error);
    }
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
  register: (data: any) =>
    api.post("/auth/register", {
      firstName: data.firstName || data.first_name,
      lastName: data.lastName || data.last_name,
      email: data.email,
      phoneNumber: data.phoneNumber || data.phone_number,
      password: data.password,
    }),
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
  // Both paths were wrong: the API mounts these under /auth/password-reset/*,
  // so every call 404'd. The reset also sent {token} where the code-based
  // route expects {email, code}.
  requestPasswordReset: (data: { email: string }) =>
    api.post("/auth/password-reset/request", data),
  /** Completes a reset from the emailed link. */
  resetPasswordByToken: (data: { token: string; newPassword: string }) =>
    api.post("/auth/password-reset/confirm-token", data),
  /** Completes a reset from the emailed 6-digit code. */
  resetPasswordByCode: (data: {
    email: string;
    code: string;
    newPassword: string;
  }) => api.post("/auth/password-reset/confirm", data),
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
// ACCOUNT DELETION
// ==========================================
export const accountAPI = {
  deleteAccount: (accessToken: string) =>
    axios.delete(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    }),
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
  // The API mounts TransactionsController at /api/v1/transactions.
  // "/wallet/transactions" exists server-side but only WITHOUT the /api/v1 prefix,
  // so calling it through this client's baseURL 404s.
  getTransactions: (params?: TransactionFilter) => api.get("/transactions", { params }),
  getTransaction: (reference: string) => api.get(`/transactions/${reference}`),
  getFundingAccounts: () => api.get("/wallet/funding-accounts"),
  /** Claims a dedicated account. Idempotent — the first funding attempt. */
  provisionFundingAccount: () => api.post("/wallet/funding-accounts"),
  /** BVN + bank details the provider needs before it will assign an account. */
  verifyIdentity: (data: {
    bvn: string;
    bankCode: string;
    accountNumber: string;
  }) => api.post("/wallet/funding-accounts/verify-identity", data),
  withdraw: (data: WithdrawRequest) => api.post("/wallet/withdraw", data),
  transfer: (data: TransferRequest) => api.post("/wallet/transfer", data),
  fund: (data: { amount: number }) => api.post("/wallet/fund", data),
  getBanks: () => api.get("/wallet/banks"),
  verifyBankAccount: (data: { bank_code: string; account_number: string }) =>
    api.post("/wallet/verify-account", data),
};

export const vtuAPI = {
  getNetworks: () => api.get("/services/meta"),
  getNetworkDiscounts: () => api.get("/services/meta"),
  buyAirtime: (data: any) =>
    api.post("/services/airtime", {
      phoneNumber: data.phoneNumber || data.phone_number,
      network: data.network,
      amount: Number(data.amount),
    }),
  getAirtimeHistory: (params?: TransactionFilter) => api.get("/wallet/transactions", { params }),
  getDataPlans: (network?: NetworkProvider) =>
    api.get(`/services/data-bundles/${network || "mtn"}`),
  buyData: (data: any) =>
    api.post("/services/data", {
      phoneNumber: data.phoneNumber || data.phone_number,
      planCode: data.planCode || data.plan_id || "1GB",
      network: data.network,
      amount: Number(data.amount || 500),
    }),
  getDataHistory: (params?: TransactionFilter) => api.get("/wallet/transactions", { params }),
};

export const utilitiesAPI = {
  getElectricityProviders: () => api.get("/services/meta"),
  verifyMeter: (data: any) =>
    api.post("/services/electricity/validate", {
      meterNumber: data.meterNumber || data.meter_number,
      disco: data.disco || data.provider_code || "eedc",
      meterType: data.meterType || data.meter_type || "prepaid",
    }),
  buyElectricity: (data: any) =>
    api.post("/services/electricity", {
      meterNumber: data.meterNumber || data.meter_number,
      disco: data.disco || data.provider_code || "eedc",
      meterType: data.meterType || data.meter_type || "prepaid",
      amount: Number(data.amount),
    }),
  getElectricityHistory: (params?: TransactionFilter) => api.get("/wallet/transactions", { params }),
  getTVProviders: () => api.get("/services/meta"),
  getTVPlans: (provider_code: string) =>
    api.get(`/services/tv-plans/${provider_code || "dstv"}`),
  verifySmartcard: (data: any) =>
    api.post("/services/tv/validate", {
      providerId: data.providerId || data.provider_code || "dstv",
      smartcardNumber: data.smartcardNumber || data.smartcard_number,
    }),
  buyTV: (data: any) =>
    api.post("/services/tv", {
      smartcardNumber: data.smartcardNumber || data.smartcard_number,
      planCode: data.planCode || data.plan_id || "dstv-padi",
      provider: data.provider || data.provider_code || "dstv",
      amount: Number(data.amount || 3600),
    }),
  getTVHistory: (params?: TransactionFilter) => api.get("/wallet/transactions", { params }),
};

export const bettingAPI = {
  getProviders: () => api.get("/services/meta"),
  verifyCustomer: (data: { provider_code: string; customer_id: string }) =>
    api.post("/services/meta"),
  fundAccount: (data: FundBettingRequest) => api.post("/services/airtime", data),
  getBettingHistory: (params?: TransactionFilter) => api.get("/wallet/transactions", { params }),
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
