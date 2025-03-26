
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
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative overflow-hidden">
        <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm animate-pulse-slow"></div>
        <img
          src="/Logo-Dojo-sem-fundo-hd.png"
          alt="Logo Dó-Heiseikan"
          className={cn("relative z-10 w-12 h-12 object-contain transition-all duration-300 hover:scale-105", sizeClasses[size])}
        />
      </div>
      <div className="flex flex-col">
        <span className="font-medium tracking-wide text-xl text-foreground">DÓ-HEISEIKAN</span>
        <span className="text-xs text-muted-foreground font-light tracking-wider">道平成館</span>
      </div>
    </div>
  );
}
