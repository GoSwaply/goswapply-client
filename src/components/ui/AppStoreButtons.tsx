"use client";

interface AppStoreButtonsProps {
  className?: string;
  layout?: "row" | "col";
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export default function AppStoreButtons({
  className = "",
  layout = "row",
  appStoreUrl = "#",
  playStoreUrl = "#",
}: AppStoreButtonsProps) {
  const flexDir = layout === "col" ? "flex-col" : "flex-row flex-wrap";

  return (
    <div className={`flex items-center gap-3 ${flexDir} ${className}`}>
      <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-black border border-white/20 hover:border-white/50 rounded-xl px-5 py-3 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-black/40 min-w-[160px]"
        aria-label="Download on the App Store"
      >
        {/* Apple logo */}
        <svg width="22" height="26" viewBox="0 0 22 26" fill="white" className="flex-shrink-0">
          <path d="M18.09 13.77c-.03-3.27 2.67-4.84 2.79-4.92-1.52-2.22-3.89-2.53-4.73-2.56-2.01-.21-3.93 1.19-4.95 1.19-1.02 0-2.59-1.16-4.26-1.13C4.6 6.39 2.4 7.58 1.19 9.53c-2.47 4.28-.63 10.6 1.76 14.07 1.18 1.7 2.58 3.62 4.42 3.55 1.78-.07 2.45-1.14 4.6-1.14 2.15 0 2.76 1.14 4.63 1.11 1.91-.03 3.12-1.74 4.29-3.45 1.35-1.97 1.91-3.88 1.94-3.98-.04-.02-3.71-1.43-3.74-5.92zM14.66 4.6c.98-1.18 1.64-2.83 1.46-4.47-1.41.06-3.12.94-4.13 2.12-.91 1.05-1.7 2.72-1.49 4.33 1.58.12 3.18-.8 4.16-1.98z" />
        </svg>
        <div className="leading-tight">
          <div className="text-white/70 text-[10px] font-medium">Download on the</div>
          <div className="text-white text-sm font-semibold">App Store</div>
        </div>
      </a>

      <a
        href={playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-black border border-white/20 hover:border-white/50 rounded-xl px-5 py-3 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-black/40 min-w-[160px]"
        aria-label="Get it on Google Play"
      >
        {/* Google Play logo */}
        <svg width="22" height="24" viewBox="0 0 22 24" fill="none" className="flex-shrink-0">
          <path d="M0.424 0.34C0.158 0.621 0 1.055 0 1.619v20.762c0 .564.158.998.424 1.279l.067.065 11.627-11.627v-.275L.491.275.424.34z" fill="#4285F4" />
          <path d="M15.943 16.111l-3.875-3.875v-.275l3.875-3.875.087.05 4.592 2.609c1.312.745 1.312 1.961 0 2.707l-4.592 2.609-.087.05z" fill="#FBBC04" />
          <path d="M16.03 16.061L12.068 12.1 .424 23.66c.433.458 1.147.515 1.946.058l13.66-7.657z" fill="#34A853" />
          <path d="M16.03 8.139L2.37.482C1.571.025.857.082.424.54L12.068 12.1l3.962-3.961z" fill="#EA4335" />
        </svg>
        <div className="leading-tight">
          <div className="text-white/70 text-[10px] font-medium">Get it on</div>
          <div className="text-white text-sm font-semibold">Google Play</div>
        </div>
      </a>
    </div>
  );
}
