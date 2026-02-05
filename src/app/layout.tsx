import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swaply - Nigeria's Premier Payment Platform",
  description:
    "Pay bills, buy airtime & data, trade crypto, sell gift cards, and book flights. Your all-in-one financial hub with the best rates in Nigeria.",
  keywords: [
    "airtime",
    "data",
    "bills payment",
    "crypto exchange",
    "gift cards",
    "flights",
    "Nigeria",
    "fintech",
  ],
  authors: [{ name: "Swaply" }],
  openGraph: {
    title: "Swaply - Nigeria's Premier Payment Platform",
    description:
      "Pay bills, buy airtime & data, trade crypto, sell gift cards, and book flights. Your all-in-one financial hub.",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(30, 41, 59, 0.9)",
              color: "#f9fafb",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              backdropFilter: "blur(10px)",
            },
            success: {
              iconTheme: {
                primary: "#d4af37",
                secondary: "#030712",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
