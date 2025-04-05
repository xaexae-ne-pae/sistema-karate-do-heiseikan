import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus, Search, Filter, X, BarChart2 } from "lucide-react";
import { AthleteForm } from "@/components/AthleteForm";
import { AthletesList } from "@/components/AthletesList";

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

const Athletes = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    belts: string[];
    status: string[];
  }>({
    belts: [],
    status: [],
  });
  const [athletesUpdated, setAthletesUpdated] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("newAthlete") === "true") {
      handleOpenDialog();
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  const handleOpenDialog = (athlete: Athlete | null = null) => {
    setEditingAthlete(athlete);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAthlete(null);
  };

  const handleAthleteUpdated = () => {
    setAthletesUpdated(prev => prev + 1);
  };

  const goToTournaments = () => {
    navigate('/torneios');
  };

  const toggleBeltFilter = (belt: string) => {
    setActiveFilters(prev => {
      const belts = prev.belts.includes(belt)
        ? prev.belts.filter(b => b !== belt)
        : [...prev.belts, belt];
      return { ...prev, belts };
    });
  };

  const toggleStatusFilter = (status: string) => {
    setActiveFilters(prev => {
      const statuses = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      return { ...prev, status: statuses };
    });
  };

  const clearFilters = () => {
    setActiveFilters({ belts: [], status: [] });
  };

  const getActiveFiltersCount = () => {
    return activeFilters.belts.length + activeFilters.status.length;
  };

  const beltDefinitions = [
    { value: "white", color: "bg-slate-100", name: "Branca" },
    { value: "yellow", color: "bg-yellow-400", name: "Amarela" },
    { value: "red", color: "bg-red-600", name: "Vermelha" },
    { value: "orange", color: "bg-orange-500", name: "Laranja" },
    { value: "green", color: "bg-green-500", name: "Verde" },
    { value: "purple", color: "bg-purple-600", name: "Roxa" },
    { value: "brown", color: "bg-amber-700", name: "Marrom" },
    { value: "black", color: "bg-black", name: "Preta" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Atletas</h1>
            <p className="text-muted-foreground">Gerenciar cadastro de atletas</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={goToTournaments}>
              <BarChart2 className="h-4 w-4" />
              <span>Pontuação</span>
            </Button>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Novo Atleta</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar atletas..."
                className="w-full pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <X
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 relative">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filtrar</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filtrar por Faixa</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {beltDefinitions.map((belt) => (
                    <DropdownMenuCheckboxItem
                      key={belt.value}
                      checked={activeFilters.belts.includes(belt.value)}
                      onSelect={(e) => {
                        e.preventDefault();
                        toggleBeltFilter(belt.value);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${belt.color}`}></div>
                        <span>{belt.name}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.status.includes("active")}
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleStatusFilter("active");
                    }}
                  >
                    Ativo
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.status.includes("inactive")}
                    onSelect={(e) => {
                      e.preventDefault();
                      toggleStatusFilter("inactive");
                    }}
                  >
                    Inativo
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs h-8 justify-start pl-2" 
                    onClick={clearFilters}
                    disabled={getActiveFiltersCount() === 0}
                  >
                    Limpar filtros
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <AthletesList 
            onEdit={handleOpenDialog} 
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            onAthleteUpdated={athletesUpdated}
          />
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}</DialogTitle>
            <DialogDescription>
              {editingAthlete 
                ? 'Edite as informações do atleta nos campos abaixo.' 
                : 'Preencha as informações do novo atleta nos campos abaixo.'}
            </DialogDescription>
          </DialogHeader>
          
          <AthleteForm 
            initialData={editingAthlete} 
            onSuccess={handleCloseDialog}
            onAthleteUpdated={handleAthleteUpdated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Athletes;
