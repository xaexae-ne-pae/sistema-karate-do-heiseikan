
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface CategoryFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "kumite",
    gender: initialData?.gender || "male",
    minAge: initialData?.minAge || 18,
    maxAge: initialData?.maxAge || 40,
    minWeight: initialData?.minWeight || "",
    maxWeight: initialData?.maxWeight || "",
    active: initialData?.active !== false,
    description: initialData?.description || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      active: value
    }));
  };

  const handleAgeRangeChange = (values: number[]) => {
    setFormData(prev => ({
      ...prev,
      minAge: values[0],
      maxAge: values[1]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: initialData ? "Categoria atualizada" : "Categoria criada",
        description: initialData 
          ? `As informações da categoria ${formData.name} foram atualizadas com sucesso.`
          : `A categoria ${formData.name} foi adicionada com sucesso.`
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as informações da categoria.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Categoria</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Kumite Masculino -75kg"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kata">Kata</SelectItem>
                <SelectItem value="kumite">Kumite</SelectItem>
                <SelectItem value="kata-team">Kata Equipe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gênero</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="mixed">Misto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Faixa Etária</Label>
              <span className="text-sm text-muted-foreground">
                {formData.minAge} - {formData.maxAge === 99 ? '+' : formData.maxAge} anos
              </span>
            </div>
            <Slider 
              defaultValue={[formData.minAge, formData.maxAge]}
              min={6}
              max={99}
              step={1}
              onValueChange={handleAgeRangeChange}
              className="py-4"
            />
          </div>
        </div>
        
        {formData.type === "kumite" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minWeight">Peso Mínimo (kg)</Label>
              <Input
                id="minWeight"
                name="minWeight"
                type="number"
                step="0.1"
                value={formData.minWeight}
                onChange={handleChange}
                placeholder="0 para sem limite"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxWeight">Peso Máximo (kg)</Label>
              <Input
                id="maxWeight"
                name="maxWeight"
                type="number"
                step="0.1"
                value={formData.maxWeight}
                onChange={handleChange}
                placeholder="0 para sem limite"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="active">Categoria Ativa</Label>
        </div>
        
        <Separator className="my-1" />
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Informações adicionais sobre a categoria..."
            value={formData.description}
            onChange={handleChange}
            className="min-h-[80px]"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Salvando...' 
            : initialData ? 'Salvar alterações' : 'Criar categoria'}
        </Button>
      </DialogFooter>
    </form>
  );
}
