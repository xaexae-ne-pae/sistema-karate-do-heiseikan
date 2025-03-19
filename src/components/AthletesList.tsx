
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

// Dados fictícios para demonstração
const MOCK_ATHLETES = [
  { id: 1, name: "João Silva", age: 25, weight: 72.5, category: "Kumite -75kg", status: true, belt: "black" },
  { id: 2, name: "Carla Mendes", age: 23, weight: 58.2, category: "Kata Individual", status: true, belt: "brown" },
  { id: 3, name: "Pedro Santos", age: 19, weight: 65.8, category: "Kumite -67kg", status: true, belt: "green" },
  { id: 4, name: "Ana Pereira", age: 21, weight: 55.1, category: "Kata Individual", status: false, belt: "blue" },
  { id: 5, name: "Carlos Eduardo", age: 28, weight: 83.4, category: "Kumite -84kg", status: true, belt: "black" },
  { id: 6, name: "Lúcia Fernandes", age: 20, weight: 54.7, category: "Kata Individual", status: true, belt: "brown" },
  { id: 7, name: "Fernando Costa", age: 24, weight: 71.2, category: "Kumite -75kg", status: false, belt: "blue" },
  { id: 8, name: "Mariana Alves", age: 22, weight: 56.3, category: "Kata Individual", status: true, belt: "orange" },
];

interface AthletesListProps {
  onEdit: (athlete: any) => void;
  searchQuery: string;
}

export function AthletesList({ onEdit, searchQuery }: AthletesListProps) {
  const { toast } = useToast();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<any | null>(null);

  // Simulando carregamento de dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAthletes(MOCK_ATHLETES);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleDeleteClick = (athlete: any) => {
    setAthleteToDelete(athlete);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!athleteToDelete) return;
    
    // Simulando chamada à API para excluir atleta
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAthletes(athletes.filter(a => a.id !== athleteToDelete.id));
    
    toast({
      title: "Atleta excluído",
      description: `${athleteToDelete.name} foi removido do sistema.`
    });
    
    setAthleteToDelete(null);
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">Carregando atletas...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[100px]">Idade</TableHead>
              <TableHead className="w-[100px]">Peso</TableHead>
              <TableHead className="w-[180px]">Categoria</TableHead>
              <TableHead className="w-[100px]">Faixa</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAthletes.length > 0 ? (
              filteredAthletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell className="font-medium">{athlete.name}</TableCell>
                  <TableCell>{athlete.age} anos</TableCell>
                  <TableCell>{athlete.weight} kg</TableCell>
                  <TableCell>{athlete.category}</TableCell>
                  <TableCell>
                    <Badge className={getBeltStyle(athlete.belt)}>
                      {athlete.belt === "white" && "Branca"}
                      {athlete.belt === "yellow" && "Amarela"}
                      {athlete.belt === "orange" && "Laranja"}
                      {athlete.belt === "green" && "Verde"}
                      {athlete.belt === "blue" && "Azul"}
                      {athlete.belt === "brown" && "Marrom"}
                      {athlete.belt === "black" && "Preta"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={athlete.status ? "default" : "secondary"}>
                      {athlete.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onEdit(athlete)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteClick(athlete)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  {searchQuery 
                    ? `Nenhum atleta encontrado para "${searchQuery}"`
                    : "Nenhum atleta cadastrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o atleta
              {athleteToDelete && <strong> {athleteToDelete.name} </strong>}
              do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
