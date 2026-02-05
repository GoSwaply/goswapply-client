"use client";

import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Airtime Icon - Realistic phone with signal
export function AirtimeIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="12" y="4" width="24" height="40" rx="4" fill="#1E3A8A" />
      <rect x="14" y="8" width="20" height="28" rx="2" fill="#60A5FA" />
      <circle cx="24" cy="40" r="2" fill="#93C5FD" />
      <path d="M32 16C32 16 34 18 34 21C34 24 32 26 32 26" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 13C35 13 38 16.5 38 21C38 25.5 35 29 35 29" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 10C38 10 42 15 42 21C42 27 38 32 38 32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Data Icon - WiFi signal
export function DataIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 36C25.6569 36 27 34.6569 27 33C27 31.3431 25.6569 30 24 30C22.3431 30 21 31.3431 21 33C21 34.6569 22.3431 36 24 36Z" fill="#3B82F6" />
      <path d="M16 28C18.1217 25.8783 21.0044 24.6715 24 24.6715C26.9956 24.6715 29.8783 25.8783 32 28" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
      <path d="M10 22C13.713 18.287 18.7391 16.1973 24 16.1973C29.2609 16.1973 34.287 18.287 38 22" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
      <path d="M4 16C9.09035 10.9096 16.3696 8.05176 24 8.05176C31.6304 8.05176 38.9096 10.9096 44 16" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Electricity Icon - Lightning bolt
export function ElectricityIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M26 4L10 28H22L18 44L38 18H26L30 4H26Z" fill="url(#electricity-gradient)" />
      <defs>
        <linearGradient id="electricity-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Cable TV Icon - TV with antenna
export function CableTVIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="4" y="12" width="40" height="28" rx="3" fill="#7C3AED" />
      <rect x="7" y="15" width="34" height="22" rx="2" fill="#A78BFA" />
      <path d="M17 40H31V44H17V40Z" fill="#6D28D9" />
      <path d="M14 40H34" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 8L24 12L32 8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="4" r="2" fill="#A78BFA" />
    </svg>
  );
}

// Betting Icon - Trophy/Cup
export function BettingIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M14 8H34V20C34 25.5228 29.5228 30 24 30C18.4772 30 14 25.5228 14 20V8Z" fill="url(#trophy-gradient)" />
      <path d="M14 12H8C8 12 6 12 6 14V16C6 20.4183 9.58172 24 14 24V12Z" fill="#F59E0B" />
      <path d="M34 12H40C40 12 42 12 42 14V16C42 20.4183 38.4183 24 34 24V12Z" fill="#F59E0B" />
      <rect x="20" y="30" width="8" height="6" fill="#D97706" />
      <rect x="16" y="36" width="16" height="4" rx="1" fill="#B45309" />
      <rect x="14" y="40" width="20" height="4" rx="1" fill="#92400E" />
      <defs>
        <linearGradient id="trophy-gradient" x1="24" y1="8" x2="24" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Flights Icon - Airplane
export function FlightsIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M42 22L28 26L24 44L20 26L6 22L20 18L24 4L28 18L42 22Z" fill="url(#plane-gradient)" />
      <circle cx="24" cy="22" r="4" fill="#1E40AF" />
      <defs>
        <linearGradient id="plane-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Gift Cards Icon - Gift box
export function GiftCardIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="6" y="18" width="36" height="26" rx="3" fill="#EC4899" />
      <rect x="6" y="12" width="36" height="8" rx="2" fill="#F472B6" />
      <rect x="22" y="12" width="4" height="32" fill="#BE185D" />
      <path d="M24 12C24 12 18 12 14 8C10 4 14 0 18 4C22 8 24 12 24 12Z" fill="#FBBF24" />
      <path d="M24 12C24 12 30 12 34 8C38 4 34 0 30 4C26 8 24 12 24 12Z" fill="#FBBF24" />
      <circle cx="24" cy="12" r="3" fill="#F59E0B" />
    </svg>
  );
}

// Crypto Icon - Bitcoin style
export function CryptoIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="20" fill="url(#crypto-gradient)" />
      <path d="M20 12V14H18V12H20ZM28 12V14H26V12H28ZM20 34V36H18V34H20ZM28 34V36H26V34H28Z" fill="#92400E" />
      <path d="M20 14H28C31.3137 14 34 16.6863 34 20C34 22.2091 32.7616 24.1274 30.9178 25.0557C32.7616 25.984 34 27.9023 34 30.1111C34 33.425 31.3137 36.1111 28 36.1111H20V14Z" fill="#FDE047" />
      <path d="M24 14V36" stroke="#D97706" strokeWidth="2" />
      <path d="M20 20H28" stroke="#D97706" strokeWidth="2" />
      <path d="M20 28H28" stroke="#D97706" strokeWidth="2" />
      <defs>
        <linearGradient id="crypto-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Wallet Icon
export function WalletIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="4" y="12" width="40" height="28" rx="4" fill="url(#wallet-gradient)" />
      <rect x="4" y="12" width="40" height="8" fill="#B8860B" />
      <circle cx="36" cy="26" r="4" fill="#FDE047" />
      <circle cx="36" cy="26" r="2" fill="#D4AF37" />
      <path d="M8 8H36C36 8 40 8 40 12H4C4 8 8 8 8 8Z" fill="#8B6914" />
      <defs>
        <linearGradient id="wallet-gradient" x1="24" y1="12" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4AF37" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// User Icon
export function UserIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="16" r="10" fill="url(#user-gradient)" />
      <path d="M6 44C6 34.0589 14.0589 26 24 26C33.9411 26 42 34.0589 42 44" fill="url(#user-body-gradient)" />
      <defs>
        <linearGradient id="user-gradient" x1="24" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="user-body-gradient" x1="24" y1="26" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Email Icon
export function EmailIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="4" y="10" width="40" height="28" rx="3" fill="#3B82F6" />
      <path d="M4 14L24 26L44 14" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14L24 26L44 14" fill="#1E40AF" />
    </svg>
  );
}

// Lock Icon
export function LockIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="10" y="20" width="28" height="24" rx="4" fill="url(#lock-gradient)" />
      <path d="M16 20V14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14V20" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="32" r="4" fill="#1E3A8A" />
      <path d="M24 34V38" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="lock-gradient" x1="24" y1="20" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Phone Icon
export function PhoneIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="12" y="4" width="24" height="40" rx="4" fill="url(#phone-gradient)" />
      <rect x="14" y="8" width="20" height="28" rx="2" fill="#1E3A8A" />
      <circle cx="24" cy="40" r="2" fill="#60A5FA" />
      <rect x="20" y="5" width="8" height="2" rx="1" fill="#60A5FA" />
      <defs>
        <linearGradient id="phone-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Shield/Security Icon
export function ShieldIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 4L6 12V22C6 33.0457 14.4021 42.4671 24 44C33.5979 42.4671 42 33.0457 42 22V12L24 4Z" fill="url(#shield-gradient)" />
      <path d="M20 24L23 27L28 20" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="shield-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Clock Icon
export function ClockIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="20" fill="url(#clock-gradient)" />
      <circle cx="24" cy="24" r="16" fill="#1E3A8A" />
      <path d="M24 14V24L30 30" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="2" fill="#FDE047" />
      <defs>
        <linearGradient id="clock-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Support/Headphones Icon
export function SupportIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M8 26C8 17.1634 15.1634 10 24 10C32.8366 10 40 17.1634 40 26V34" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
      <rect x="4" y="26" width="8" height="14" rx="4" fill="url(#headphone-gradient)" />
      <rect x="36" y="26" width="8" height="14" rx="4" fill="url(#headphone-gradient)" />
      <path d="M40 38C40 40.2091 38.2091 42 36 42H28" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="headphone-gradient" x1="8" y1="26" x2="8" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Credit Card Icon
export function CreditCardIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="4" y="10" width="40" height="28" rx="4" fill="url(#card-gradient)" />
      <rect x="4" y="16" width="40" height="8" fill="#1E3A8A" />
      <rect x="8" y="30" width="12" height="4" rx="1" fill="#60A5FA" />
      <rect x="32" y="30" width="8" height="4" rx="1" fill="#FDE047" />
      <defs>
        <linearGradient id="card-gradient" x1="24" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Arrow Right
export function ArrowRightIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// Arrow Left
export function ArrowLeftIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

// Trending Up
export function TrendingUpIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M4 36L18 22L26 30L44 12" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 12H44V24" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Check Circle
export function CheckCircleIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="20" fill="#10B981" />
      <path d="M16 24L22 30L34 18" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Star Icon
export function StarIcon({ size = 24, filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M24 4L29.5 17.5L44 19L33 29L36 44L24 36L12 44L15 29L4 19L18.5 17.5L24 4Z"
        fill={filled ? "#FDE047" : "none"}
        stroke="#FDE047"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Menu Icon
export function MenuIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

// Close/X Icon
export function CloseIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// Bell/Notification Icon
export function BellIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 4C17.3726 4 12 9.37258 12 16V26L8 32V34H40V32L36 26V16C36 9.37258 30.6274 4 24 4Z" fill="url(#bell-gradient)" />
      <path d="M20 34C20 36.2091 21.7909 38 24 38C26.2091 38 28 36.2091 28 34" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="bell-gradient" x1="24" y1="4" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Copy Icon
export function CopyIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

// Search Icon
export function SearchIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// Chevron Down
export function ChevronDownIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// Chevron Left
export function ChevronLeftIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// Eye Icon
export function EyeIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Eye Off Icon
export function EyeOffIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// Gift Icon (for referral)
export function GiftIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="6" y="18" width="36" height="26" rx="3" fill="#D4AF37" />
      <rect x="6" y="12" width="36" height="8" rx="2" fill="#FDE047" />
      <rect x="22" y="12" width="4" height="32" fill="#B8860B" />
      <path d="M24 12C24 12 18 12 14 8C10 4 14 0 18 4C22 8 24 12 24 12Z" fill="#EC4899" />
      <path d="M24 12C24 12 30 12 34 8C38 4 34 0 30 4C26 8 24 12 24 12Z" fill="#EC4899" />
      <circle cx="24" cy="12" r="3" fill="#BE185D" />
    </svg>
  );
}

// Upload Icon
export function UploadIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </svg>
  );
}

// Loader Icon
export function LoaderIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props} className="animate-spin">
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );
}

// Map Pin Icon
export function MapPinIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 4C15.1634 4 8 11.1634 8 20C8 32 24 44 24 44C24 44 40 32 40 20C40 11.1634 32.8366 4 24 4Z" fill="url(#pin-gradient)" />
      <circle cx="24" cy="20" r="6" fill="white" />
      <defs>
        <linearGradient id="pin-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Calendar Icon
export function CalendarIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="6" y="10" width="36" height="34" rx="4" fill="#3B82F6" />
      <rect x="6" y="10" width="36" height="10" fill="#1E40AF" />
      <rect x="14" y="6" width="4" height="8" rx="2" fill="#60A5FA" />
      <rect x="30" y="6" width="4" height="8" rx="2" fill="#60A5FA" />
      <rect x="12" y="26" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="21" y="26" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="30" y="26" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="12" y="34" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="21" y="34" width="6" height="6" rx="1" fill="#BFDBFE" />
    </svg>
  );
}

// Settings/Gear Icon
export function SettingsIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z" fill="#60A5FA" />
      <path d="M38.28 26.16C38.16 25.44 38.04 24.72 38.04 24C38.04 23.28 38.16 22.56 38.28 21.84L42.48 18.6C42.84 18.36 42.96 17.88 42.72 17.52L38.76 10.68C38.52 10.32 38.04 10.2 37.68 10.32L32.76 12.36C31.56 11.4 30.24 10.68 28.8 10.08L28.08 4.8C28.08 4.32 27.6 4 27.12 4H19.08C18.6 4 18.12 4.32 18.12 4.8L17.4 10.08C15.96 10.68 14.64 11.4 13.44 12.36L8.52 10.32C8.04 10.08 7.56 10.32 7.32 10.68L3.36 17.52C3.12 17.88 3.24 18.36 3.6 18.6L7.8 21.84C7.68 22.56 7.56 23.28 7.56 24C7.56 24.72 7.68 25.44 7.8 26.16L3.6 29.4C3.24 29.64 3.12 30.12 3.36 30.48L7.32 37.32C7.56 37.68 8.04 37.8 8.4 37.68L13.32 35.64C14.52 36.6 15.84 37.32 17.28 37.92L18 43.2C18.12 43.68 18.6 44 19.08 44H27.12C27.6 44 28.08 43.68 28.08 43.2L28.8 37.92C30.24 37.32 31.56 36.6 32.76 35.64L37.68 37.68C38.16 37.8 38.64 37.56 38.88 37.2L42.84 30.36C43.08 30 42.96 29.52 42.6 29.28L38.28 26.16Z" fill="url(#settings-gradient)" />
      <defs>
        <linearGradient id="settings-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94A3B8" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Logout Icon
export function LogoutIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

// Dashboard Icon
export function DashboardIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="4" y="4" width="18" height="18" rx="3" fill="url(#dash-gradient-1)" />
      <rect x="26" y="4" width="18" height="10" rx="3" fill="url(#dash-gradient-2)" />
      <rect x="26" y="18" width="18" height="26" rx="3" fill="url(#dash-gradient-3)" />
      <rect x="4" y="26" width="18" height="18" rx="3" fill="url(#dash-gradient-4)" />
      <defs>
        <linearGradient id="dash-gradient-1" x1="13" y1="4" x2="13" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4AF37" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="dash-gradient-2" x1="35" y1="4" x2="35" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="dash-gradient-3" x1="35" y1="18" x2="35" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="dash-gradient-4" x1="13" y1="26" x2="13" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Quote Icon
export function QuoteIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M20 12H8C6.89543 12 6 12.8954 6 14V26C6 27.1046 6.89543 28 8 28H14L10 36H16L20 28V14C20 12.8954 19.1046 12 18 12H20Z" fill="url(#quote-gradient)" />
      <path d="M42 12H30C28.8954 12 28 12.8954 28 14V26C28 27.1046 28.8954 28 30 28H36L32 36H38L42 28V14C42 12.8954 41.1046 12 40 12H42Z" fill="url(#quote-gradient)" />
      <defs>
        <linearGradient id="quote-gradient" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4AF37" />
          <stop offset="1" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// User Plus Icon (for sign up)
export function UserPlusIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="20" cy="14" r="8" fill="url(#userplus-gradient)" />
      <path d="M6 40C6 31.1634 13.1634 24 22 24C25.5 24 28.7 25.2 31.3 27.2" stroke="url(#userplus-body-gradient)" strokeWidth="4" strokeLinecap="round" />
      <path d="M38 28V40M32 34H44" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      <defs>
        <linearGradient id="userplus-gradient" x1="20" y1="6" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="userplus-body-gradient" x1="18" y1="24" x2="18" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Smartphone Icon
export function SmartphoneIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="12" y="4" width="24" height="40" rx="4" fill="url(#smartphone-gradient)" />
      <rect x="14" y="8" width="20" height="28" rx="2" fill="#1E3A8A" />
      <circle cx="24" cy="40" r="2" fill="#60A5FA" />
      <rect x="20" y="5" width="8" height="2" rx="1" fill="#60A5FA" />
      <defs>
        <linearGradient id="smartphone-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// X/Close Icon with color
export function XIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// Sparkles Icon
export function SparklesIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 4L26 16L38 18L26 20L24 32L22 20L10 18L22 16L24 4Z" fill="url(#sparkle-gradient-1)" />
      <path d="M38 28L39 34L45 35L39 36L38 42L37 36L31 35L37 34L38 28Z" fill="url(#sparkle-gradient-2)" />
      <path d="M12 30L13 36L19 37L13 38L12 44L11 38L5 37L11 36L12 30Z" fill="url(#sparkle-gradient-3)" />
      <defs>
        <linearGradient id="sparkle-gradient-1" x1="24" y1="4" x2="24" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="sparkle-gradient-2" x1="38" y1="28" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="sparkle-gradient-3" x1="12" y1="30" x2="12" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Facebook Icon
export function FacebookIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="20" fill="#1877F2" />
      <path d="M32 24H27V20C27 18.3431 28.3431 17 30 17H32V12H28C24.134 12 21 15.134 21 19V24H17V30H21V42H27V30H31L32 24Z" fill="white" />
    </svg>
  );
}

// Twitter/X Icon
export function TwitterIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="20" fill="#000000" />
      <path d="M27.2 20.8L34.6 12H32.4L26.2 19.3L21.2 12H14L21.8 25.3L14 35H16.2L22.8 26.8L28.2 35H35.4L27.2 20.8ZM17 14H20L31.4 33H28.4L17 14Z" fill="white" />
    </svg>
  );
}

// Instagram Icon
export function InstagramIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#instagram-gradient)" />
      <circle cx="24" cy="24" r="8" stroke="white" strokeWidth="3" />
      <circle cx="35" cy="13" r="2.5" fill="white" />
      <rect x="8" y="8" width="32" height="32" rx="8" stroke="white" strokeWidth="3" fill="none" />
      <defs>
        <linearGradient id="instagram-gradient" x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FED373" />
          <stop offset="0.3" stopColor="#F15245" />
          <stop offset="0.6" stopColor="#D92E7F" />
          <stop offset="1" stopColor="#515BD4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// LinkedIn Icon
export function LinkedinIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="4" y="4" width="40" height="40" rx="4" fill="#0A66C2" />
      <path d="M16 20V34H12V20H16ZM14 18C12.9 18 12 17.1 12 16C12 14.9 12.9 14 14 14C15.1 14 16 14.9 16 16C16 17.1 15.1 18 14 18ZM36 34H32V27C32 25.3 31.7 24 29.5 24C27.5 24 27 25.5 27 27V34H23V20H27V22C27.5 21 29 20 31 20C34.5 20 36 22 36 26V34Z" fill="white" />
    </svg>
  );
}

// Sun Icon
export function SunIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="24" r="10" fill="url(#sun-gradient)" />
      <path d="M24 4V8M24 40V44M4 24H8M40 24H44M10 10L13 13M35 35L38 38M10 38L13 35M35 13L38 10" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="sun-gradient" x1="24" y1="14" x2="24" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Moon Icon
export function MoonIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 4C14.06 4 6 12.06 6 22C6 31.94 14.06 40 24 40C28.22 40 32.1 38.54 35.14 36.1C28.54 35.46 23.4 29.98 23.4 23.2C23.4 16.42 28.54 10.94 35.14 10.3C32.1 7.86 28.22 6.4 24 4Z" fill="url(#moon-gradient)" />
      <circle cx="36" cy="12" r="2" fill="#60A5FA" />
      <circle cx="40" cy="20" r="1.5" fill="#60A5FA" />
      <circle cx="38" cy="28" r="1" fill="#60A5FA" />
      <defs>
        <linearGradient id="moon-gradient" x1="20" y1="4" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94A3B8" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
