
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className, style }) => {
  return (
    <div className={cn("flex items-center gap-2", className)} style={style}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-karate-red rounded-full opacity-80 animate-pulse-slow"></div>
        <div className="relative z-10 text-karate-white font-bold text-xl">松</div>
      </div>
      <div className="flex flex-col items-start">
        <span className="font-bold text-lg tracking-wider text-karate-white">KARATE</span>
        <span className="text-xs tracking-widest text-karate-white/70">SHOTOKAN</span>
      </div>
    </div>
  );
};

export default Logo;
