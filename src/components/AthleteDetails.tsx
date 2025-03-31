
import { X, User, Medal, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AthleteDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: {
    id: number;
    name: string;
    age: number;
    weight: number;
    height?: number;
    category: string;
    belt: string;
    status: boolean;
    dojo?: string;
    notes?: string;
  };
}

export function AthleteDetails({ isOpen, onClose, athlete }: AthleteDetailsProps) {
  const getBeltStyle = (belt: string) => {
    const styles = {
      white: "bg-slate-100 text-slate-700",
      yellow: "bg-yellow-100 text-yellow-800",
      orange: "bg-orange-100 text-orange-800",
      green: "bg-green-100 text-green-800",
      blue: "bg-blue-100 text-blue-800",
      brown: "bg-amber-800 text-white",
      black: "bg-black text-white"
    };
    
    return styles[belt as keyof typeof styles] || "bg-slate-100 text-slate-800";
  };

  const getBeltName = (belt: string) => {
    const names = {
      white: "Branca",
      yellow: "Amarela",
      orange: "Laranja",
      green: "Verde",
      blue: "Azul",
      brown: "Marrom",
      black: "Preta"
    };
    
    return names[belt as keyof typeof names] || belt;
  };

  const getDojoName = (dojo?: string) => {
    if (!dojo) return "Não informado";
    
    const dojos = {
      "do-heiseikan": "DÓ-HEISEIKAN",
      "shotokan": "Shotokan Karate",
      "goju-ryu": "Goju-Ryu",
      "wado-ryu": "Wado-Ryu",
      "shito-ryu": "Shito-Ryu",
      "kyokushin": "Kyokushin"
    };
    
    return dojos[dojo as keyof typeof dojos] || dojo;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Atleta</DialogTitle>
          <DialogDescription>
            Informações detalhadas do atleta.
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="py-2">
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">{athlete.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getBeltStyle(athlete.belt)}>
                    {getBeltName(athlete.belt)}
                  </Badge>
                  
                  <Badge variant={athlete.status ? "default" : "secondary"}>
                    {athlete.status ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Idade</span>
              <p className="font-medium">{athlete.age} anos</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Categoria</span>
              <p className="font-medium">{athlete.category}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Peso</span>
              <p className="font-medium">{athlete.weight} kg</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Altura</span>
              <p className="font-medium">{athlete.height || "Não informada"} {athlete.height ? "cm" : ""}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Medal className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Dojo</h4>
              </div>
              <p className="text-sm ml-6">{getDojoName(athlete.dojo)}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Info className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Observações</h4>
              </div>
              <p className="text-sm ml-6 text-muted-foreground">
                {athlete.notes || "Não há observações adicionais para este atleta."}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
