
import { Card, CardContent } from "@/components/ui/card";
import { Athlete } from "@/types/athlete";

interface AthleteCardProps {
  athlete: Athlete;
}

export const AthleteCard = ({ athlete }: AthleteCardProps) => {
  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <h3 className="font-medium">{athlete.name}</h3>
        <div className="mt-2 text-sm text-muted-foreground">
          <p>Categoria: {athlete.category}</p>
          <p>Idade: {athlete.age} anos</p>
          <p>Peso: {athlete.weight} kg</p>
        </div>
      </CardContent>
    </Card>
  );
};
