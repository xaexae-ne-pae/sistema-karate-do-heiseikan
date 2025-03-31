
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "login" | "dashboard";
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className, style, variant = "login", size = "md" }) => {
  // Size classes for dashboard variant
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  if (variant === "dashboard") {
    return (
      <div className={cn("flex items-center gap-3", className)} style={style}>
        <div className="relative overflow-hidden">
          <div className="absolute rounded-full blur-sm animate-pulse-slow"></div>
          <img
            src="/Logo-Dojo-sem-fundo-hd.png"
            alt="Logo Dó-Heiseikan"
            className={cn("relative z-10 w-12 h-16 object-contain")}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-medium tracking-wide text-xl text-foreground">DÓ-HEISEIKAN</span>
          <span className="text-xs text-muted-foreground font-light tracking-wider">道平成館</span>
        </div>
      </div>
    );
  }

  // Default login variant
  return (
    <div className={cn("flex items-center gap-3", className)} style={style}>
      <div className="relative overflow-hidden">
        <div className="absolute -inset-1 bg-karate-red/30 rounded-full blur-sm animate-pulse-slow"></div>
        <div className="relative z-10 w-14 h-14">
          <img 
            src="/Logo-Dojo-sem-fundo-hd.png" 
            alt="Logo Dó-Heiseikan" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-light tracking-wider text-xl text-karate-white">道平成館</span>
      </div>
    </div>
  );
};

export default Logo;
