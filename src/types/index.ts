export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  address?: string;
  state?: string;
  city?: string;
  kyc_level: number;
  has_pin: boolean;
  referral_code: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  balance: number;
  bonus_balance: number;
  is_active: boolean;
  daily_limit: number;
  monthly_limit: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  amount: number;
  fee: number;
  balance_before: number;
  balance_after: number;
  status: TransactionStatus;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "airtime"
  | "data"
  | "electricity"
  | "tv"
  | "betting"
  | "flight"
  | "giftcard"
  | "crypto"
  | "transfer"
  | "refund"
  | "bonus"
  | "commission";

export type TransactionStatus = "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";

export interface FundingAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_active: boolean;
}

export interface Network {
  name: string;
  code: string;
  logo?: string;
}

export interface DataPlan {
  id: string;
  network: string;
  name: string;
  data_amount: string;
  validity: string;
  price: number;
}

export interface ElectricityProvider {
  id: string;
  name: string;
  code: string;
  service_type: "prepaid" | "postpaid";
}

export interface TVProvider {
  id: string;
  name: string;
  code: string;
}

export interface TVPlan {
  id: string;
  provider: string;
  name: string;
  price: number;
  validity: string;
}

export interface BettingProvider {
  id: string;
  name: string;
  code: string;
  min_amount: number;
  max_amount: number;
}

export interface GiftCardType {
  id: string;
  name: string;
  code: string;
  image?: string;
  min_usd: number;
  max_usd: number;
}

export interface GiftCardRate {
  id: string;
  card_type: string;
  country: string;
  currency: string;
  min_amount: number;
  max_amount: number;
  rate: number;
}

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  network: string;
  image?: string;
  wallet_address: string;
  min_amount: number;
  max_amount: number;
}

export interface CryptoRate {
  currency: string;
  usdt_rate: number;
  ngn_rate: number;
}

export interface Flight {
  id: string;
  airline: string;
  airline_logo?: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  currency: string;
  travel_class: string;
  stops: number;
}

export interface FlightBooking {
  id: string;
  reference: string;
  pnr: string;
  status: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers: unknown[];
  total_amount: number;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
