import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, X, Plus } from "lucide-react";
import { CategoryForm } from "@/components/CategoryForm";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
  type: string;
  ageMin: number;
  ageMax: number;
  weightMin?: number;
  weightMax?: number;
  gender: string;
  beltRangeMin: string;
  beltRangeMax: string;
}

const TournamentCategories = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTournamentCategories = async () => {
      setIsLoading(true);
      
      try {
        // For now, we'll just simulate fetching categories for a specific tournament
        // In a real app, you would fetch this data from your API
        
        // For demo, let's check if there are any saved tournament categories in localStorage
        const key = `tournament_${tournamentId}_categories`;
        const savedCategories = localStorage.getItem(key);
        
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else {
          // No categories for this tournament yet
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching tournament categories:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias deste torneio.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTournamentCategories();
  }, [tournamentId, toast]);
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddCategory = (category: Category) => {
    // Add category to this tournament
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    
    // Save to localStorage for demo purposes
    const key = `tournament_${tournamentId}_categories`;
    localStorage.setItem(key, JSON.stringify(updatedCategories));
    
    toast({
      title: "Categoria adicionada",
      description: `${category.name} foi adicionada ao torneio com sucesso.`
    });
    
    setIsDialogOpen(false);
  };
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      kata: "Kata",
      kumite: "Kumite",
      team_kata: "Kata em Equipe",
      team_kumite: "Kumite em Equipe",
    };
    return types[type] || type;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Categorias do Torneio</h1>
            <p className="text-muted-foreground">
              Gerenciar categorias deste torneio
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleOpenDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Nova Categoria</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar categorias..."
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
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Carregando categorias...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium">{category.name}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Tipo: {getCategoryTypeLabel(category.type)}</p>
                    <p>Idade: {category.ageMin} - {category.ageMax} anos</p>
                    <p>Faixa: {category.beltRangeMin} - {category.beltRangeMax}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg">
              <h3 className="font-medium mb-2">
                Nenhuma categoria criada para este torneio
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `Nenhuma categoria encontrada para "${searchQuery}"`
                  : "Adicione categorias a este torneio para começar."
                }
              </p>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleOpenDialog}
              >
                <Plus className="h-4 w-4" />
                <span>Nova Categoria</span>
              </Button>
            </div>
          )}
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Categoria</DialogTitle>
            <DialogDescription>
              Crie uma nova categoria para este torneio.
            </DialogDescription>
          </DialogHeader>
          
          <CategoryForm onSuccess={handleAddCategory} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentCategories;
