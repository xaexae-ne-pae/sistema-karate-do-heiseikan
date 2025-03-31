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
import { Pencil, Trash2, Eye } from "lucide-react";
import { AthleteDetails } from "./AthleteDetails";

// Dados fictícios para demonstração
const MOCK_ATHLETES = [
  { id: 1, name: "João Silva", age: 25, weight: 72.5, height: 178, category: "Kumite -75kg", status: true, belt: "black", dojo: "do-heiseikan", notes: "Campeão estadual 2022. Excelente em técnicas de chute." },
  { id: 2, name: "Carla Mendes", age: 23, weight: 58.2, height: 165, category: "Kata Individual", status: true, belt: "brown", dojo: "shotokan", notes: "Competidora nacional. Especialista em kata Kanku Dai." },
  { id: 3, name: "Pedro Santos", age: 19, weight: 65.8, height: 172, category: "Kumite -67kg", status: true, belt: "green", dojo: "goju-ryu" },
  { id: 4, name: "Ana Pereira", age: 21, weight: 55.1, height: 162, category: "Kata Individual", status: false, belt: "blue", dojo: "wado-ryu" },
  { id: 5, name: "Carlos Eduardo", age: 28, weight: 83.4, height: 185, category: "Kumite -84kg", status: true, belt: "black", dojo: "do-heiseikan", notes: "Instrutor assistente. Foco em kumite tradicional." },
  { id: 6, name: "Lúcia Fernandes", age: 20, weight: 54.7, height: 160, category: "Kata Individual", status: true, belt: "brown", dojo: "shito-ryu" },
  { id: 7, name: "Fernando Costa", age: 24, weight: 71.2, height: 175, category: "Kumite -75kg", status: false, belt: "blue", dojo: "kyokushin" },
  { id: 8, name: "Mariana Alves", age: 22, weight: 56.3, height: 168, category: "Kata Individual", status: true, belt: "orange", dojo: "do-heiseikan" },
];

interface Athlete {
  id: number;
  name: string;
  age: number;
  weight: number;
  height?: number;
  category: string;
  status: boolean;
  belt: string;
  dojo?: string;
  notes?: string;
}

interface AthletesListProps {
  onEdit: (athlete: Athlete) => void;
  searchQuery: string;
  activeFilters?: {
    belts: string[];
    status: string[];
  };
  onAthleteUpdated?: () => void;
}

export function AthletesList({ onEdit, searchQuery, activeFilters = { belts: [], status: [] }, onAthleteUpdated }: AthletesListProps) {
  const { toast } = useToast();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<Athlete | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    const storedAthletes = localStorage.getItem('karate_athletes');
    
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (storedAthletes) {
        setAthletes(JSON.parse(storedAthletes));
      } else {
        setAthletes(MOCK_ATHLETES);
        localStorage.setItem('karate_athletes', JSON.stringify(MOCK_ATHLETES));
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [onAthleteUpdated]);

  const filteredAthletes = athletes
    .filter(athlete => {
      const matchesSearch = 
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBelt = activeFilters.belts.length === 0 || 
        activeFilters.belts.includes(athlete.belt);
      
      const matchesStatus = activeFilters.status.length === 0 || 
        (activeFilters.status.includes("active") && athlete.status) ||
        (activeFilters.status.includes("inactive") && !athlete.status);
      
      return matchesSearch && matchesBelt && matchesStatus;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

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

  const handleDeleteClick = (athlete: Athlete) => {
    setAthleteToDelete(athlete);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!athleteToDelete) return;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedAthletes = athletes.filter(a => a.id !== athleteToDelete.id);
    setAthletes(updatedAthletes);
    
    localStorage.setItem('karate_athletes', JSON.stringify(updatedAthletes));
    
    toast({
      title: "Atleta excluído",
      description: `${athleteToDelete.name} foi removido do sistema.`
    });
    
    setAthleteToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleViewDetails = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setDetailsOpen(true);
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
              <TableHead className="w-[80px]">Idade</TableHead>
              <TableHead className="w-[80px]">Peso</TableHead>
              <TableHead className="w-[80px]">Altura</TableHead>
              <TableHead className="w-[180px]">Categoria</TableHead>
              <TableHead className="w-[100px]">Faixa</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAthletes.length > 0 ? (
              filteredAthletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell className="font-medium">{athlete.name}</TableCell>
                  <TableCell>{athlete.age} anos</TableCell>
                  <TableCell>{athlete.weight} kg</TableCell>
                  <TableCell>{athlete.height ? `${athlete.height} cm` : "-"}</TableCell>
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
                        onClick={() => handleViewDetails(athlete)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalhes</span>
                      </Button>
                      
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
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  {searchQuery || activeFilters.belts.length > 0 || activeFilters.status.length > 0
                    ? "Nenhum atleta encontrado com os filtros aplicados"
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
      
      {selectedAthlete && (
        <AthleteDetails 
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          athlete={selectedAthlete}
        />
      )}
    </>
  );
}
