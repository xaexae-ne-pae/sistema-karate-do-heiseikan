
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { UserPlus, Search, Filter, X, Check } from "lucide-react";
import { AthleteForm } from "@/components/AthleteForm";
import { AthletesList } from "@/components/AthletesList";

// Interface para tipar corretamente o Atleta
interface Athlete {
  id: number;
  name: string;
  age: number;
  weight: number;
  category: string;
  belt: string;
  status: boolean;
  notes?: string;
  height?: number;
}

const Athletes = () => {
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
  const location = useLocation();

  // Verificar se há um parâmetro na URL para abrir o diálogo
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("newAthlete") === "true") {
      handleOpenDialog();
      
      // Opcional: Limpar o parâmetro da URL para evitar que o diálogo abra novamente 
      // após fechar e recarregar a página
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
                  {["white", "yellow", "orange", "green", "blue", "brown", "black"].map((belt) => (
                    <DropdownMenuCheckboxItem
                      key={belt}
                      checked={activeFilters.belts.includes(belt)}
                      onSelect={(e) => {
                        e.preventDefault();
                        toggleBeltFilter(belt);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full 
                          ${belt === "white" ? "bg-slate-100" : ""}
                          ${belt === "yellow" ? "bg-yellow-400" : ""}
                          ${belt === "orange" ? "bg-orange-500" : ""}
                          ${belt === "green" ? "bg-green-500" : ""}
                          ${belt === "blue" ? "bg-blue-500" : ""}
                          ${belt === "brown" ? "bg-amber-800" : ""}
                          ${belt === "black" ? "bg-black" : ""}
                        `}></div>
                        <span>
                          {belt === "white" && "Branca"}
                          {belt === "yellow" && "Amarela"}
                          {belt === "orange" && "Laranja"}
                          {belt === "green" && "Verde"}
                          {belt === "blue" && "Azul"}
                          {belt === "brown" && "Marrom"}
                          {belt === "black" && "Preta"}
                        </span>
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Athletes;
