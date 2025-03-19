
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
const MOCK_CATEGORIES = [
  { 
    id: 1, 
    name: "Kumite Masculino -60kg", 
    type: "kumite", 
    gender: "male", 
    minAge: 18, 
    maxAge: 40, 
    minWeight: 0, 
    maxWeight: 60, 
    active: true 
  },
  { 
    id: 2, 
    name: "Kumite Masculino -67kg", 
    type: "kumite", 
    gender: "male", 
    minAge: 18, 
    maxAge: 40, 
    minWeight: 60.1, 
    maxWeight: 67, 
    active: true 
  },
  { 
    id: 3, 
    name: "Kumite Masculino -75kg", 
    type: "kumite", 
    gender: "male", 
    minAge: 18, 
    maxAge: 40, 
    minWeight: 67.1, 
    maxWeight: 75, 
    active: true 
  },
  { 
    id: 4, 
    name: "Kumite Masculino -84kg", 
    type: "kumite", 
    gender: "male", 
    minAge: 18, 
    maxAge: 40, 
    minWeight: 75.1, 
    maxWeight: 84, 
    active: true 
  },
  { 
    id: 5, 
    name: "Kumite Masculino +84kg", 
    type: "kumite", 
    gender: "male", 
    minAge: 18, 
    maxAge: 40, 
    minWeight: 84.1, 
    maxWeight: 0, 
    active: true 
  },
  { 
    id: 6, 
    name: "Kata Masculino", 
    type: "kata", 
    gender: "male", 
    minAge: 18, 
    maxAge: 40, 
    active: true 
  },
  { 
    id: 7, 
    name: "Kata Feminino", 
    type: "kata", 
    gender: "female", 
    minAge: 18, 
    maxAge: 40, 
    active: true 
  },
  { 
    id: 8, 
    name: "Kata Equipe Misto", 
    type: "kata-team", 
    gender: "mixed", 
    minAge: 18, 
    maxAge: 40, 
    active: false 
  },
];

interface CategoriesListProps {
  onEdit: (category: any) => void;
  searchQuery: string;
}

export function CategoriesList({ onEdit, searchQuery }: CategoriesListProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);

  // Simulando carregamento de dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategories(MOCK_CATEGORIES);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.gender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    // Simulando chamada à API para excluir categoria
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCategories(categories.filter(c => c.id !== categoryToDelete.id));
    
    toast({
      title: "Categoria excluída",
      description: `A categoria ${categoryToDelete.name} foi removida do sistema.`
    });
    
    setCategoryToDelete(null);
    setDeleteDialogOpen(false);
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'kumite': 'Kumite',
      'kata': 'Kata',
      'kata-team': 'Kata Equipe'
    };
    
    return types[type as keyof typeof types] || type;
  };

  const getGenderLabel = (gender: string) => {
    const genders = {
      'male': 'Masculino',
      'female': 'Feminino',
      'mixed': 'Misto'
    };
    
    return genders[gender as keyof typeof genders] || gender;
  };

  if (isLoading) {
    return <div className="flex justify-center py-12">Carregando categorias...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[100px]">Tipo</TableHead>
              <TableHead className="w-[100px]">Gênero</TableHead>
              <TableHead className="w-[120px]">Faixa Etária</TableHead>
              <TableHead className="w-[120px]">Peso</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(category.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getGenderLabel(category.gender)}</TableCell>
                  <TableCell>
                    {category.minAge} - {category.maxAge === 99 ? '+' : category.maxAge} anos
                  </TableCell>
                  <TableCell>
                    {category.type === 'kumite' ? (
                      category.minWeight === 0 && category.maxWeight > 0
                        ? `< ${category.maxWeight}kg`
                        : category.maxWeight === 0 && category.minWeight > 0
                          ? `> ${category.minWeight}kg`
                          : `${category.minWeight} - ${category.maxWeight}kg`
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.active ? "default" : "secondary"}>
                      {category.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteClick(category)}
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
                    ? `Nenhuma categoria encontrada para "${searchQuery}"`
                    : "Nenhuma categoria cadastrada"}
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a categoria
              {categoryToDelete && <strong> {categoryToDelete.name} </strong>}
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
