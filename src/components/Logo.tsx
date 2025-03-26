
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className, style }) => {
  return (
    <div className={cn("flex items-center gap-3", className)} style={style}>
      <div className="relative overflow-hidden">
        <div className="absolute -inset-1 bg-karate-red/30 rounded-full blur-sm animate-pulse-slow"></div>
        <div className="relative z-10 w-12 h-12">
          <img 
            src="/Logo-Dojo-sem-fundo-hd.png" 
            alt="Logo Dó-Heiseikan" 
            className="w-full h-full object-contain transition-all duration-300 hover:scale-105"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-medium tracking-wide text-xl text-karate-white">DÓ-HEISEIKAN</span>
        <span className="text-xs text-karate-white/70 font-light tracking-wider">道平成館</span>
      </div>
    </div>
  );
};

export default Logo;
