
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Buscar..." 
}: SearchBarProps) => {
  return (
    <div className="relative w-full sm:w-72">
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
          className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
};
