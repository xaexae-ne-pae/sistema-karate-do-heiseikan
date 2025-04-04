
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
    // Usar dark como padrão ao invés de confiar na preferência do sistema
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    // Se não houver tema armazenado, usar dark como padrão
    const initialTheme = storedTheme || "dark";
    setTheme(initialTheme);
    
    // Aplicar classe dark por padrão ao documento
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon" : "default"}
      onClick={toggleTheme}
      className={`rounded-full transition-all duration-300 ${className} ${theme === 'light' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : ''}`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-[1.15rem] w-[1.15rem] rotate-90 transition-all duration-300 dark:rotate-0" />
          {!iconOnly && <span className="ml-2">Modo Escuro</span>}
        </>
      ) : (
        <>
          <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 transition-all duration-300 dark:-rotate-90" />
          {!iconOnly && <span className="ml-2">Modo Claro</span>}
        </>
      )}
    </Button>
  );
}
