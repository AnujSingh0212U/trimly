import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <div className="relative">
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-105"
        >
          <defs>
            <linearGradient id="trimly-grad" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="url(#trimly-grad)" />
          <path
            d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="3" fill="white" />
          <path
            d="M14 26L18 22M26 26L22 22"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 28L14 24"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight gradient-text", s.text)}>Trimly</span>
      )}
    </Link>
  );
}
