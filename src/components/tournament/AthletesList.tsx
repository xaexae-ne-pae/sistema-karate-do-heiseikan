
import { Athlete } from "@/types/athlete";
import { AthleteCard } from "./AthleteCard";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface AthletesListProps {
  athletes: Athlete[];
  isFiltered: boolean;
  searchQuery: string;
  onAddClick: () => void;
}

export const AthletesList = ({ 
  athletes, 
  isFiltered, 
  searchQuery, 
  onAddClick 
}: AthletesListProps) => {
  if (athletes.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <h3 className="font-medium mb-2">
          Nenhum atleta inscrito neste torneio
        </h3>
        <p className="text-muted-foreground mb-6">
          {isFiltered 
            ? `Nenhum atleta encontrado para "${searchQuery}"`
            : "Adicione atletas a este torneio para começar."
          }
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
        <AthleteCard key={athlete.id} athlete={athlete} />
      ))}
    </div>
  );
};
