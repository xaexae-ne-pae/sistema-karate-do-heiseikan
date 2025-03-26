
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
        <img
          src="/Logo-Dojo-sem-fundo-hd.png"
          alt="Logo Dó-Heiseikan"
          className="w-11"
        />
      </div>
      <span className="font-nomal tracking-tight text-xl">DÓ-HEISEIKAN</span>
    </div>
  );
}
