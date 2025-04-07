
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ThemeToggleProps {
  className?: string;
  iconOnly?: boolean;
}

export function ThemeToggle({ className, iconOnly = false }: ThemeToggleProps) {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('karate-theme', 'dark');
  const [mounted, setMounted] = useState(false);

  // Update the theme attribute on the HTML element
  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Only render the toggle after mounting to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon" : "default"}
      onClick={toggleTheme}
      className={`rounded-full transition-all duration-300 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Moon className="h-[1.15rem] w-[1.15rem] transition-all duration-300" />
          {!iconOnly && <span className="ml-2">Modo Claro</span>}
        </>
      ) : (
        <>
          <Sun className="h-[1.15rem] w-[1.15rem] transition-all duration-300" />
          {!iconOnly && <span className="ml-2">Modo Escuro</span>}
        </>
      )}
    </Button>
  );
}
