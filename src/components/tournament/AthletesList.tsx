
import { Athlete } from "@/types/athlete";
import { AthleteCard } from "./AthleteCard";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useMemo } from "react";

interface AthletesListProps {
  athletes: Athlete[];
  isFiltered: boolean;
  searchQuery: string;
  onAddClick: () => void;
  onAthleteClick?: (athlete: Athlete) => void;
  emptyStateMessage?: string;
}

export const AthletesList = ({ 
  athletes, 
  isFiltered, 
  searchQuery, 
  onAddClick,
  onAthleteClick,
  emptyStateMessage = "Nenhum atleta inscrito neste torneio" 
}: AthletesListProps) => {
  
  const message = useMemo(() => {
    if (isFiltered) {
      return `Nenhum atleta encontrado para "${searchQuery}"`;
    }
    return "Adicione atletas a este torneio para começar.";
  }, [isFiltered, searchQuery]);

  if (athletes.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <h3 className="font-medium mb-2">
          {emptyStateMessage}
        </h3>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={onAddClick}
        >
          <UserPlus className="h-4 w-4" />
          <span>Adicionar Atleta</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {athletes.map((athlete) => (
        <AthleteCard 
          key={athlete.id} 
          athlete={athlete} 
          onClick={onAthleteClick} 
        />
      ))}
    </div>
  );
};
