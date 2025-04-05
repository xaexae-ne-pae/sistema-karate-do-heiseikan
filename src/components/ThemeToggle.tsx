
import { Moon } from "lucide-react";
import { Button } from "./ui/button";

interface ThemeToggleProps {
  className?: string;
  iconOnly?: boolean;
}

export function ThemeToggle({ className, iconOnly = false }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon" : "default"}
      className={`rounded-full transition-all duration-300 ${className}`}
      aria-label="Theme"
    >
      <Moon className="h-[1.15rem] w-[1.15rem] transition-all duration-300" />
      {!iconOnly && <span className="ml-2">Modo Escuro</span>}
    </Button>
  );
}
