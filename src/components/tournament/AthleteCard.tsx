
import { Card, CardContent } from "@/components/ui/card";
import { Athlete } from "@/types/athlete";
import { Badge } from "@/components/ui/badge";

interface AthleteCardProps {
  athlete: Athlete;
  onClick?: (athlete: Athlete) => void;
}

export const AthleteCard = ({ athlete, onClick }: AthleteCardProps) => {
  const isActive = athlete.status;
  
  return (
    <Card 
      className="bg-card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(athlete)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{athlete.name}</h3>
          {isActive ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
              Inativo
            </Badge>
          )}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Categoria: {athlete.category}</p>
          <p>Idade: {athlete.age} anos</p>
          <p>Peso: {athlete.weight} kg</p>
          <p>Faixa: {athlete.belt}</p>
          {athlete.dojo && <p>Dojo: {athlete.dojo}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
