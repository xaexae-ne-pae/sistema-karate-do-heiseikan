
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, iconColor, className }: StatCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-lg p-5 mb-3 transition-all duration-700 ease hover:scale-105 hover:ring-1 hover:ring-primary/30 hover:outline hover:outline-2 hover:outline-primary/50",
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium text-muted-foreground">{title}</p>
        <div className={cn(
          "rounded-full p-2", 
          iconColor || "bg-primary/10 text-primary"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-2 text-4xl font-bold leading-tight">{value}</p>
    </div>
  );
}
