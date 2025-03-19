
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Tag, Pencil, Trash2, X } from "lucide-react";
import { CategoriesList } from "@/components/CategoriesList";
import { CategoryForm } from "@/components/CategoryForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Categories = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Categorias</h1>
            <p className="text-muted-foreground">Gerenciar divisões de peso e idade</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Tag className="h-4 w-4" />
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
          
          <CategoriesList 
            onEdit={handleOpenDialog} 
            searchQuery={searchQuery} 
          />
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Edite as informações da categoria nos campos abaixo.'
                : 'Defina os critérios para a nova categoria nos campos abaixo.'}
            </DialogDescription>
          </DialogHeader>
          
          <CategoryForm 
            initialData={editingCategory} 
            onSuccess={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
