// ==========================================
// USER MANAGEMENT TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  date_of_birth?: string;
  address?: string;
  state?: string;
  city?: string;
  is_active: boolean;
  is_verified: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  bvn?: string;
  nin?: string;
  kyc_level: number;
  kyc_verified_at?: string;
  referral_code?: string;
  referred_by?: string;
  has_pin: boolean;
  last_login_ip?: string;
  device_token?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user: string;
  token: string;
  device_type: "mobile" | "web" | "api";
  device_info?: Record<string, unknown>;
  ip_address?: string;
  location?: string;
  is_active: boolean;
  expires_at: string;
  last_activity: string;
  created_at: string;
}

export interface OTPVerification {
  id: string;
  phone_number?: string;
  email?: string;
  purpose: "registration" | "login" | "transaction" | "password_reset";
  is_used: boolean;
  expires_at: string;
  attempts: number;
  created_at: string;
}

// ==========================================
// WALLET & TRANSACTION TYPES
// ==========================================

export interface Wallet {
  id: string;
  balance: number;
  bonus_balance: number;
  total_balance: number;
  is_active: boolean;
  daily_limit: number;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet: string;
  transaction_type: TransactionType;
  amount: number;
  fee: number;
  balance_before: number;
  balance_after: number;
  reference: string;
  external_reference?: string;
  description: string;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  provider?: string;
  provider_response?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
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

export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export interface FundingAccount {
  id: string;
  wallet: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  provider: string;
  provider_reference?: string;
  is_active: boolean;
  created_at: string;
}

export interface PaystackDVA {
  id: string;
  wallet: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
  paystack_customer_id: string;
  paystack_customer_code: string;
  paystack_dva_id: string;
  paystack_integration: string;
  is_active: boolean;
  assigned_at: string;
  last_funded_at?: string;
  total_funded: number;
  funding_count: number;
  created_at: string;
}

export interface WalletFundingTransaction {
  id: string;
  wallet: string;
  dva?: string;
  amount: number;
  fee: number;
  net_amount: number;
  paystack_reference: string;
  paystack_transfer_code?: string;
  sender_bank?: string;
  sender_account_number?: string;
  sender_account_name?: string;
  reference: string;
  status: TransactionStatus;
  wallet_transaction?: string;
  created_at: string;
}

export interface WalletWithdrawal {
  id: string;
  wallet: string;
  amount: number;
  fee: number;
  net_amount: number;
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  paystack_transfer_code?: string;
  paystack_recipient_code?: string;
  paystack_reference?: string;
  reference: string;
  status: TransactionStatus;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  wallet_transaction?: string;
  failure_reason?: string;
  failure_code?: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  wallet: string;
  amount: number;
  fee: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  reference: string;
  status: TransactionStatus;
  processed_at?: string;
  processed_by?: string;
  notes?: string;
  created_at: string;
}

// ==========================================
// VTU (AIRTIME & DATA) TYPES
// ==========================================

export type NetworkProvider = "mtn" | "glo" | "airtel" | "9mobile";

export interface Network {
  name: string;
  code: NetworkProvider;
  logo?: string;
  airtime_discount_percent?: number;
  data_discount_percent?: number;
  is_airtime_active?: boolean;
  is_data_active?: boolean;
}

export interface NetworkDiscount {
  id: string;
  network: NetworkProvider;
  airtime_discount_percent: number;
  data_discount_percent: number;
  is_airtime_active: boolean;
  is_data_active: boolean;
  min_airtime_amount: number;
  max_airtime_amount: number;
  created_at: string;
}

export interface DataPlan {
  id: string;
  network: NetworkProvider;
  name: string;
  plan_code: string;
  data_amount: string;
  validity: string;
  price: number;
  provider_price: number;
  provider: string;
  is_active: boolean;
  priority: number;
  profit_margin?: number;
  created_at: string;
}

export interface AirtimeTransaction {
  id: string;
  user: string;
  wallet_transaction?: string;
  phone_number: string;
  network: NetworkProvider;
  amount: number;
  discount: number;
  amount_charged: number;
  reference: string;
  provider_reference?: string;
  status: TransactionStatus;
  provider: string;
  provider_response?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface DataTransaction {
  id: string;
  user: string;
  wallet_transaction?: string;
  phone_number: string;
  network: NetworkProvider;
  data_plan?: string;
  plan_name: string;
  plan_code: string;
  amount: number;
  discount: number;
  amount_charged: number;
  reference: string;
  provider_reference?: string;
  status: TransactionStatus;
  provider: string;
  provider_response?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// UTILITIES (ELECTRICITY & TV) TYPES
// ==========================================

export interface ElectricityProvider {
  id: string;
  name: string;
  code: string;
  service_type: "prepaid" | "postpaid";
  is_active: boolean;
  min_amount: number;
  max_amount: number;
  commission_percent: number;
  created_at: string;
}

export interface ElectricityTransaction {
  id: string;
  user: string;
  wallet_transaction?: string;
  provider?: string;
  provider_code: string;
  meter_number: string;
  customer_name?: string;
  customer_address?: string;
  amount: number;
  commission: number;
  amount_charged: number;
  token?: string;
  units?: string;
  reference: string;
  provider_reference?: string;
  status: TransactionStatus;
  api_provider: string;
  provider_response?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface MeterVerification {
  customer_name: string;
  customer_address?: string;
  meter_number: string;
  provider_code: string;
  meter_type: "prepaid" | "postpaid";
}

export interface TVProvider {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  commission_percent: number;
  created_at: string;
}

export interface TVPlan {
  id: string;
  provider: string;
  name: string;
  plan_code: string;
  price: number;
  provider_price: number;
  validity: string;
  is_active: boolean;
  created_at: string;
}

export interface TVTransaction {
  id: string;
  user: string;
  wallet_transaction?: string;
  provider?: string;
  plan?: string;
  smartcard_number: string;
  customer_name?: string;
  plan_name: string;
  amount: number;
  commission: number;
  amount_charged: number;
  reference: string;
  provider_reference?: string;
  status: TransactionStatus;
  api_provider: string;
  provider_response?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface SmartcardVerification {
  customer_name: string;
  smartcard_number: string;
  provider_code: string;
  current_bouquet?: string;
  due_date?: string;
}

// ==========================================
// BETTING TYPES
// ==========================================

export interface BettingProvider {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  min_amount: number;
  max_amount: number;
  commission_percent: number;
  created_at: string;
}

export interface BettingTransaction {
  id: string;
  user: string;
  wallet_transaction?: string;
  provider?: string;
  customer_id: string;
  customer_name?: string;
  amount: number;
  commission: number;
  amount_charged: number;
  reference: string;
  provider_reference?: string;
  status: TransactionStatus;
  api_provider: string;
  provider_response?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface BettingAccountVerification {
  customer_name: string;
  customer_id: string;
  provider_code: string;
}

// ==========================================
// GIFT CARDS TYPES
// ==========================================

export interface GiftCardType {
  id: string;
  name: string;
  code: string;
  image?: string;
  description?: string;
  is_active: boolean;
  min_amount_usd: number;
  max_amount_usd: number;
  created_at: string;
}

export interface GiftCardRate {
  id: string;
  card_type: string;
  country: string;
  currency: string;
  min_amount: number;
  max_amount: number;
  rate_per_dollar: number;
  is_active: boolean;
  created_at: string;
}

export interface GiftCardTransaction {
  id: string;
  user: string;
  wallet_transaction?: string;
  card_type?: string;
  card_type_name: string;
  card_country: string;
  card_image?: string;
  card_last_four?: string;
  card_value_usd: number;
  rate_applied: number;
  amount_ngn: number;
  fee_percent: number;
  fee_amount: number;
  final_amount: number;
  reference: string;
  status: TransactionStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  rejection_reason?: string;
  whatsapp_notified: boolean;
  whatsapp_notified_at?: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// CRYPTOCURRENCY TYPES
// ==========================================

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  network: string;
  image?: string;
  is_active: boolean;
  min_amount: number;
  max_amount: number;
  wallet_address: string;
  created_at: string;
}

export interface CryptoExchangeRate {
  id: string;
  currency: string;
  usdt_rate: number;
  ngn_rate: number;
  is_current: boolean;
  source: string;
  created_at: string;
}

export interface CryptoTransaction {
  id: string;
  user: string;
  wallet_transaction?: string;
  currency?: string;
  currency_symbol: string;
  network: string;
  crypto_amount: number;
  usdt_equivalent: number;
  exchange_rate: number;
  ngn_rate: number;
  fee_percent: number;
  fee_amount_ngn: number;
  amount_ngn: number;
  final_amount_ngn: number;
  receiving_wallet: string;
  payment_screenshot?: string;
  transaction_hash?: string;
  reference: string;
  status: TransactionStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  whatsapp_notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CryptoRateCalculation {
  currency_symbol: string;
  crypto_amount: number;
  usdt_equivalent: number;
  exchange_rate: number;
  ngn_rate: number;
  amount_ngn: number;
  fee_percent: number;
  fee_amount_ngn: number;
  final_amount_ngn: number;
}

// ==========================================
// FLIGHTS TYPES
// ==========================================

export interface Airport {
  id: string;
  iata_code: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

export interface Airline {
  id: string;
  iata_code: string;
  name: string;
  logo_url?: string;
  is_active: boolean;
}

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  adults: number;
  children?: number;
  infants?: number;
  travel_class?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
}

export interface FlightSearch {
  id: string;
  user: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  adults: number;
  children: number;
  infants: number;
  travel_class: string;
  is_round_trip: boolean;
  search_results: FlightOffer[];
  expires_at: string;
  created_at: string;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airline_code: string;
  airline_logo?: string;
  flight_number: string;
  origin: string;
  origin_name?: string;
  destination: string;
  destination_name?: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  currency: string;
  travel_class: string;
  stops: number;
  segments?: FlightSegment[];
}

export interface FlightSegment {
  departure_airport: string;
  departure_time: string;
  arrival_airport: string;
  arrival_time: string;
  flight_number: string;
  airline_code: string;
  duration: string;
  aircraft?: string;
}

export interface FlightPassenger {
  type: "adult" | "child" | "infant";
  title: "MR" | "MRS" | "MS" | "MSTR" | "MISS";
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "M" | "F";
  nationality?: string;
  passport_number?: string;
  passport_expiry?: string;
  passport_country?: string;
}

export interface FlightContact {
  email: string;
  phone: string;
}

export interface FlightBooking {
  id: string;
  user: string;
  wallet_transaction?: string;
  flight_search?: string;
  pnr: string;
  booking_reference: string;
  origin: string;
  destination: string;
  origin_name?: string;
  destination_name?: string;
  departure_datetime: string;
  arrival_datetime: string;
  airline_code: string;
  airline_name?: string;
  flight_number: string;
  return_departure_datetime?: string;
  return_arrival_datetime?: string;
  return_flight_number?: string;
  passengers: FlightPassenger[];
  contact_email: string;
  contact_phone: string;
  base_fare: number;
  taxes: number;
  total_amount: number;
  currency: string;
  markup: number;
  amount_charged: number;
  status: TransactionStatus;
  booking_status: "pending" | "confirmed" | "ticketed" | "cancelled";
  provider: string;
  provider_booking_id?: string;
  provider_response?: Record<string, unknown>;
  error_message?: string;
  ticket_numbers?: string[];
  is_ticketed: boolean;
  ticketed_at?: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// NOTIFICATIONS TYPES
// ==========================================

export type NotificationStatus = "pending" | "queued" | "sending" | "sent" | "failed" | "bounced";
export type NotificationPriority = "low" | "normal" | "high" | "critical";

export interface Notification {
  id: string;
  user: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  to_email: string;
  to_name?: string;
  subject: string;
  template_name: string;
  context?: Record<string, unknown>;
  status: NotificationStatus;
  priority: NotificationPriority;
  message_id?: string;
  request_id?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  queued_at?: string;
  sent_at?: string;
  failed_at?: string;
  user?: string;
  related_reference?: string;
  created_at: string;
}

// ==========================================
// CORE & SYSTEM TYPES
// ==========================================

export type ServiceProvider = "baxi" | "vtu_ng" | "ebills" | "amadeus";

export interface APIProvider {
  id: string;
  name: string;
  provider_type: ServiceProvider;
  base_url: string;
  is_active: boolean;
  priority: number;
  balance: number;
  last_synced?: string;
  webhook_url?: string;
}

export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  value_type: "string" | "integer" | "float" | "boolean" | "json";
  description?: string;
  is_editable: boolean;
  category: string;
}

export interface AuditLog {
  id: string;
  user?: string;
  action: string;
  model_name: string;
  object_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export type RefundStatus = "pending" | "approved" | "processing" | "completed" | "rejected" | "failed";
export type RefundType = "auto" | "manual" | "partial";

export interface RefundRequest {
  id: string;
  source_transaction: string;
  service_transaction_type: string;
  service_transaction_id: string;
  amount: number;
  reason: string;
  refund_type: RefundType;
  status: RefundStatus;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  rejection_reason?: string;
  processed_at?: string;
  refund_transaction?: string;
  retry_count: number;
  max_retries: number;
  last_retry_at?: string;
  error_message?: string;
  idempotency_key: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ==========================================
// FORM/REQUEST TYPES
// ==========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone_number: string;
  password: string;
  first_name: string;
  last_name: string;
  referral_code?: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  address?: string;
  state?: string;
  city?: string;
  profile_picture?: File;
}

export interface SetPinRequest {
  pin: string;
  confirm_pin: string;
}

export interface VerifyPinRequest {
  pin: string;
}

export interface OTPRequest {
  phone_number?: string;
  email?: string;
  purpose: "registration" | "login" | "transaction" | "password_reset";
}

export interface OTPVerifyRequest {
  otp: string;
  purpose: string;
  phone_number?: string;
  email?: string;
}

export interface BuyAirtimeRequest {
  phone_number: string;
  network: NetworkProvider;
  amount: number;
  pin: string;
}

export interface BuyDataRequest {
  phone_number: string;
  network: NetworkProvider;
  plan_id: string;
  pin: string;
}

export interface BuyElectricityRequest {
  provider_code: string;
  meter_number: string;
  meter_type: "prepaid" | "postpaid";
  amount: number;
  pin: string;
}

export interface BuyTVRequest {
  provider_code: string;
  smartcard_number: string;
  plan_id: string;
  pin: string;
}

export interface FundBettingRequest {
  provider_code: string;
  customer_id: string;
  amount: number;
  pin: string;
}

export interface WithdrawRequest {
  amount: number;
  bank_code: string;
  account_number: string;
  pin: string;
}

export interface TransferRequest {
  amount: number;
  recipient_email: string;
  description?: string;
  pin: string;
}

export interface FlightBookingRequest {
  search_id: string;
  offer_id: string;
  passengers: FlightPassenger[];
  contact: FlightContact;
  pin: string;
}

export interface SellGiftCardRequest {
  card_type_code: string;
  card_country: string;
  card_value_usd: number;
  card_image: File;
  pin: string;
}

export interface SellCryptoRequest {
  currency_symbol: string;
  crypto_amount: number;
  payment_screenshot: File;
  transaction_hash?: string;
  pin: string;
}

// ==========================================
// TRANSACTION FILTER TYPES
// ==========================================

export interface TransactionFilter {
  transaction_type?: TransactionType;
  status?: TransactionStatus;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  reference?: string;
  page?: number;
  page_size?: number;
}

// ==========================================
// DASHBOARD/ANALYTICS TYPES
// ==========================================

export interface WalletSummary {
  balance: number;
  bonus_balance: number;
  total_balance: number;
  total_transactions: number;
  total_spent: number;
  total_received: number;
  pending_transactions: number;
}

export interface DailyReport {
  id: string;
  report_date: string;
  total_transactions: number;
  total_revenue: number;
  total_airtime: number;
  total_data: number;
  total_electricity: number;
  total_tv: number;
  total_betting: number;
  total_flights: number;
  total_giftcards: number;
  total_crypto: number;
  new_users: number;
  active_users: number;
  report_data?: Record<string, unknown>;
  created_at: string;
}

// ==========================================
// BANK TYPES
// ==========================================

export interface Bank {
  name: string;
  code: string;
  slug?: string;
  logo?: string;
}

export interface BankAccountVerification {
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
}
