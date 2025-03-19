
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DashboardLogo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="text-primary relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("transition-all", sizeClasses[size])}
        >
          <path d="M8 19c-1.7-.1-3-1.4-3-3.1V5h0s2 1 5.1 1c2.5 0 3.9-1 3.9-1v2" />
          <path d="M12 19.8C13.5 19.3 18 18.4 18 13V5s-2.5 2-8 2H8" />
          <path d="m7.5 13.5 2.5-2.5 2 2 5-5" />
        </svg>
      </div>
      <span className="font-bold tracking-tight text-xl">Karate Manager</span>
    </div>
  );
}
