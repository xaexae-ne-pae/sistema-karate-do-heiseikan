
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

export function SidebarLink({ icon: Icon, label, to }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-foreground/80 hover:bg-muted"
      )}
    >
      <Icon 
        className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110", 
          isActive ? "text-primary-foreground" : "text-foreground/70"
        )} 
        aria-hidden="true" 
      />
      <span className="truncate transition-all duration-200 group-hover:translate-x-0.5">{label}</span>
    </Link>
  );
}
