
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface ThemeToggleProps {
  className?: string;
  iconOnly?: boolean;
}

export function ThemeToggle({ className, iconOnly = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Sempre usar dark, removendo a opção de tema claro
    setTheme("dark");
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  // Manter o botão apenas para consistência da UI, mas ele não muda mais o tema
  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon" : "default"}
      className={`rounded-full transition-all duration-300 ${className}`}
      aria-label="Theme"
    >
      <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 transition-all duration-300" />
      {!iconOnly && <span className="ml-2">Modo Escuro</span>}
    </Button>
  );
}
