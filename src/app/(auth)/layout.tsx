import Link from "next/link";
import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900/40 via-background to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/30 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient-gold">Swaply</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Financial Freedom Starts Here
            </h1>
            <p className="text-lg text-muted-foreground">
              Join thousands of Nigerians who trust Swaply for their daily financial transactions. Fast, secure, and reliable.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <div className="text-3xl font-bold text-gradient-gold">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-gold">1M+</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-gold">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient-gold">Swaply</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
