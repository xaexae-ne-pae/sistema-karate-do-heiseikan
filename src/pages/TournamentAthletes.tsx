
import { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Athlete } from "@/types/athlete";
import { useTournamentAthletes } from "@/hooks/useTournamentAthletes";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { SearchBar } from "@/components/tournament/SearchBar";
import { AddAthleteDialog } from "@/components/tournament/AddAthleteDialog";
import { LoadingAthletes } from "@/components/tournament/LoadingAthletes";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { UserPlus, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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

const TournamentAthletes = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<Athlete | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Use custom hook for tournament athletes data
  const { 
    tournamentAthletes, 
    isLoading, 
    addAthlete,
    removeAthlete 
  } = useTournamentAthletes(tournamentId);
  
  // Use custom hook for search filtering
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredItems: filteredAthletes,
    isFiltered 
  } = useSearchFilter<Athlete>(
    tournamentAthletes,
    (athlete, query) => 
      athlete.name.toLowerCase().includes(query) || 
      athlete.category.toLowerCase().includes(query)
  );
  
  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);
  
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);
  
  const handleAthleteClick = useCallback((athlete: Athlete) => {
    console.log("Athlete clicked:", athlete);
    // You can add additional functionality here
  }, []);

  const handleDeleteClick = useCallback((athlete: Athlete) => {
    setAthleteToDelete(athlete);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!athleteToDelete) return;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    removeAthlete(athleteToDelete.id);
    setAthleteToDelete(null);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Atleta removido",
      description: `O atleta foi removido do torneio com sucesso.`
    });
  }, [athleteToDelete, removeAthlete, toast]);

  // Helper functions for belt styling
  const getBeltStyle = (belt: string) => {
    const styles = {
      white: "bg-slate-100 text-slate-800 border-slate-200",
      yellow: "bg-yellow-400 text-yellow-950 border-yellow-500",
      red: "bg-red-600 text-white border-red-700",
      orange: "bg-orange-500 text-white border-orange-600",
      green: "bg-green-500 text-white border-green-600",
      purple: "bg-purple-600 text-white border-purple-700",
      brown: "bg-amber-700 text-white border-amber-800",
      black: "bg-black text-white border-gray-700"
    };
    
    return styles[belt as keyof typeof styles] || "bg-slate-100 text-slate-800";
  };

  const getBeltName = (belt: string) => {
    const names = {
      white: "Branca",
      yellow: "Amarela",
      red: "Vermelha",
      orange: "Laranja",
      green: "Verde",
      purple: "Roxa",
      brown: "Marrom",
      black: "Preta"
    };
    
    return names[belt as keyof typeof names] || belt;
  };

  // Table headers
  const tableHeaders = useMemo(() => [
    { id: 'name', label: 'Nome' },
    { id: 'age', label: 'Idade' },
    { id: 'weight', label: 'Peso' },
    { id: 'height', label: 'Altura' },
    { id: 'category', label: 'Categoria' },
    { id: 'belt', label: 'Faixa' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Ações' },
  ], []);

  // Empty state render
  const renderEmptyState = useCallback(() => {
    const message = isFiltered
      ? `Nenhum atleta encontrado para "${searchQuery}"`
      : "Adicione atletas a este torneio para começar.";

    return (
      <div className="text-center py-16 border rounded-lg">
        <h3 className="font-medium mb-2">
          Nenhum atleta inscrito neste torneio
        </h3>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={handleOpenDialog}
        >
          <UserPlus className="h-4 w-4" />
          <span>Adicionar Atleta</span>
        </Button>
      </div>
    );
  }, [isFiltered, searchQuery, handleOpenDialog]);

  // Mobile-optimized table rendering
  const renderMobileTable = useCallback(() => {
    if (filteredAthletes.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-4">
        {filteredAthletes.map((athlete) => (
          <div key={athlete.id} className="p-4 border rounded-lg bg-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-base">{athlete.name}</h3>
              <Badge variant={athlete.status ? "default" : "secondary"}>
                {athlete.status ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <span className="text-muted-foreground">Idade:</span>{" "}
                <span className="font-medium">{athlete.age}</span>{" "}
                <span className="text-muted-foreground text-xs">anos</span>
              </div>
              <div>
                <span className="text-muted-foreground">Peso:</span>{" "}
                <span className="font-medium">{athlete.weight}</span>{" "}
                <span className="text-muted-foreground text-xs">kg</span>
              </div>
              <div>
                <span className="text-muted-foreground">Altura:</span>{" "}
                <span className="font-medium">{athlete.height || "-"}</span>
                {athlete.height && <span className="text-muted-foreground text-xs"> cm</span>}
              </div>
              <div>
                <span className="text-muted-foreground">Faixa:</span>{" "}
                <Badge className={`ml-1 ${getBeltStyle(athlete.belt)}`}>
                  {getBeltName(athlete.belt)}
                </Badge>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="text-muted-foreground text-sm">Categoria:</span>{" "}
              <span className="text-sm">{athlete.category}</span>
            </div>
            
            <div className="flex justify-end gap-2 mt-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleAthleteClick(athlete)}
              >
                <Eye className="h-4 w-4 mr-1" />
                <span>Detalhes</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost"
              >
                <Pencil className="h-4 w-4 mr-1" />
                <span>Editar</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-destructive hover:text-destructive/90"
                onClick={() => handleDeleteClick(athlete)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Excluir</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [filteredAthletes, handleAthleteClick, handleDeleteClick, renderEmptyState]);

  // Desktop table rendering
  const renderDesktopTable = useCallback(() => {
    if (filteredAthletes.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map(header => (
                <TableHead 
                  key={header.id} 
                  className={header.id === 'actions' ? 'text-right' : ''}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAthletes.map((athlete) => (
              <TableRow key={athlete.id}>
                <TableCell className="font-medium">{athlete.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{athlete.age}</span>
                    <span className="text-muted-foreground text-xs ml-1">anos</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{athlete.weight}</span>
                    <span className="text-muted-foreground text-xs ml-1">kg</span>
                  </div>
                </TableCell>
                <TableCell>
                  {athlete.height ? (
                    <div className="flex items-center">
                      <span className="font-medium">{athlete.height}</span>
                      <span className="text-muted-foreground text-xs ml-1">cm</span>
                    </div>
                  ) : (
                    <span>-</span>
                  )}
                </TableCell>
                <TableCell>{athlete.category}</TableCell>
                <TableCell>
                  <Badge className={getBeltStyle(athlete.belt)}>
                    {getBeltName(athlete.belt)}
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
                      onClick={() => handleAthleteClick(athlete)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalhes</span>
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="ghost"
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
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }, [filteredAthletes, handleAthleteClick, handleDeleteClick, renderEmptyState, tableHeaders]);
  
  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <TournamentHeader 
          title="Atletas do Torneio"
          description="Gerenciar atletas inscritos neste torneio"
        >
          <Button onClick={handleOpenDialog} className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Atleta</span>
          </Button>
        </TournamentHeader>
        
        <main className="px-8 py-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar atletas..."
            />
          </div>
          
          {isLoading ? (
            <LoadingAthletes />
          ) : (
            isMobile ? renderMobileTable() : renderDesktopTable()
          )}
        </main>
      </div>
      
      <AddAthleteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={(athlete) => {
          addAthlete(athlete);
          setIsDialogOpen(false);
        }} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o atleta
              {athleteToDelete && <strong> {athleteToDelete.name} </strong>}
              deste torneio.
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
    </div>
  );
};

export default TournamentAthletes;
