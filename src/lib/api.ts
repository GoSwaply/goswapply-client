import axios from "axios";
import Cookies from "js-cookie";

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

export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login/", data),
  register: (data: { email: string; phone: string; password: string; first_name: string; last_name: string }) =>
    api.post("/auth/register/", data),
  logout: () => api.post("/auth/logout/"),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (data: Record<string, unknown>) => api.put("/auth/profile/", data),
  setPin: (data: { pin: string }) => api.post("/auth/set-pin/", data),
  verifyPin: (data: { pin: string }) => api.post("/auth/verify-pin/", data),
  requestOtp: (data: { phone?: string; email?: string; purpose: string }) => api.post("/auth/request-otp/", data),
  verifyOtp: (data: { otp: string; purpose: string }) => api.post("/auth/verify-otp/", data),
};

export const walletAPI = {
  getWallet: () => api.get("/wallet/"),
  getSummary: () => api.get("/wallet/summary/"),
  getTransactions: (params?: Record<string, unknown>) => api.get("/wallet/transactions/", { params }),
  getTransaction: (reference: string) => api.get(`/wallet/transactions/${reference}/`),
  getFundingAccounts: () => api.get("/wallet/funding-accounts/"),
  withdraw: (data: { amount: number; bank_code: string; account_number: string; pin: string }) =>
    api.post("/wallet/withdraw/", data),
  transfer: (data: { amount: number; recipient_email: string; pin: string }) => api.post("/wallet/transfer/", data),
};

export const vtuAPI = {
  getNetworks: () => api.get("/vtu/networks/"),
  buyAirtime: (data: { phone: string; network: string; amount: number; pin: string }) =>
    api.post("/vtu/airtime/buy/", data),
  getDataPlans: (network?: string) => api.get("/vtu/data/plans/", { params: { network } }),
  buyData: (data: { phone: string; network: string; plan_id: string; pin: string }) =>
    api.post("/vtu/data/buy/", data),
};

export const utilitiesAPI = {
  getElectricityProviders: () => api.get("/utilities/electricity/providers/"),
  verifyMeter: (data: { provider: string; meter_number: string; meter_type: string }) =>
    api.post("/utilities/electricity/verify/", data),
  payElectricity: (data: { provider: string; meter_number: string; meter_type: string; amount: number; pin: string }) =>
    api.post("/utilities/electricity/pay/", data),
  getTVProviders: () => api.get("/utilities/tv/providers/"),
  getTVPlans: (provider: string) => api.get(`/utilities/tv/plans/${provider}/`),
  verifySmartcard: (data: { provider: string; smartcard_number: string }) =>
    api.post("/utilities/tv/verify/", data),
  payTV: (data: { provider: string; smartcard_number: string; plan_id: string; pin: string }) =>
    api.post("/utilities/tv/pay/", data),
};

export const bettingAPI = {
  getProviders: () => api.get("/betting/providers/"),
  verifyCustomer: (data: { provider: string; customer_id: string }) => api.post("/betting/verify/", data),
  fundAccount: (data: { provider: string; customer_id: string; amount: number; pin: string }) =>
    api.post("/betting/fund/", data),
};

export const flightsAPI = {
  search: (data: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    adults: number;
    children?: number;
    infants?: number;
    travel_class?: string;
  }) => api.get("/flights/search/", { params: data }),
  book: (data: { search_id: string; offer_id: string; passengers: unknown[]; contact: unknown; pin: string }) =>
    api.post("/flights/book/", data),
  getBooking: (reference: string) => api.get(`/flights/bookings/${reference}/`),
};

export const giftcardsAPI = {
  getTypes: () => api.get("/giftcards/types/"),
  getRates: (typeCode: string) => api.get(`/giftcards/rates/${typeCode}/`),
  sell: (data: FormData) => api.post("/giftcards/sell/", data, { headers: { "Content-Type": "multipart/form-data" } }),
};

export const cryptoAPI = {
  getCurrencies: () => api.get("/crypto/currencies/"),
  getRates: () => api.get("/crypto/rates/"),
  sell: (data: FormData) => api.post("/crypto/sell/", data, { headers: { "Content-Type": "multipart/form-data" } }),
};

export default api;
