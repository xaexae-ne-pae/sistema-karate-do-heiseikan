
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
      "glass-card rounded-lg p-5 animate-scale-in hover-scale hover-glow",
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn(
          "rounded-full p-2", 
          iconColor || "bg-primary/10 text-primary"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-4xl font-bold leading-tight">{value}</p>
    </div>
  );
}
