
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Buscar...",
  className = "w-full sm:w-72",
  onClear
}: SearchBarProps) => {
  const handleClear = useCallback(() => {
    onChange("");
    onClear?.();
  }, [onChange, onClear]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full pl-9 bg-background"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <X
          className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          onClick={handleClear}
          aria-label="Clear search"
        />
      )}
    </div>
  );
};
