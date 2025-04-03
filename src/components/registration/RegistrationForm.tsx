
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DojoType, BeltType } from "@/types/athlete";
import { ArrowRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  categories: string[];
  status: "active" | "upcoming" | "closed";
  participants: number;
}

interface RegistrationFormProps {
  event: Event | null;
  onClose: () => void;
}

const registrationSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  age: z.coerce.number().min(4, { message: "Idade deve ser no mínimo 4 anos" }),
  dojo: z.string().min(1, { message: "Selecione um dojo" }),
  belt: z.string().min(1, { message: "Selecione uma faixa" }),
  height: z.coerce.number().min(0.5, { message: "Altura deve ser maior que 0.5m" }),
  weight: z.coerce.number().min(15, { message: "Peso deve ser maior que 15kg" }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationForm = ({ event, onClose }: RegistrationFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      age: undefined,
      dojo: "",
      belt: "",
      height: undefined,
      weight: undefined,
    },
  });
  
  const onSubmit = (data: RegistrationFormData) => {
    // Store form data in localStorage to access it on the payment page
    localStorage.setItem('registration_data', JSON.stringify({
      ...data,
      event: event ? event.title : 'Evento'
    }));
    
    // Close the modal
    onClose();
    
    // Navigate to the payment page
    navigate("/inscricoes/pagamento");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="exemplo@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Sua idade" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dojo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dojo</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu dojo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DojoType.DO_HEISEIKAN}>Do Heiseikan</SelectItem>
                    <SelectItem value={DojoType.SHOTOKAN}>Shotokan</SelectItem>
                    <SelectItem value={DojoType.GOJU_RYU}>Goju-Ryu</SelectItem>
                    <SelectItem value={DojoType.WADO_RYU}>Wado-Ryu</SelectItem>
                    <SelectItem value={DojoType.SHITO_RYU}>Shito-Ryu</SelectItem>
                    <SelectItem value={DojoType.KYOKUSHIN}>Kyokushin</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="belt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faixa</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua faixa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BeltType.WHITE}>Branca</SelectItem>
                    <SelectItem value={BeltType.YELLOW}>Amarela</SelectItem>
                    <SelectItem value={BeltType.RED}>Vermelha</SelectItem>
                    <SelectItem value={BeltType.ORANGE}>Laranja</SelectItem>
                    <SelectItem value={BeltType.GREEN}>Verde</SelectItem>
                    <SelectItem value={BeltType.PURPLE}>Roxa</SelectItem>
                    <SelectItem value={BeltType.BROWN}>Marrom</SelectItem>
                    <SelectItem value={BeltType.BLACK}>Preta</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (m)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.01" 
                    placeholder="Altura em metros" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="Peso em quilos" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" className="gap-2">
            <span>Avançar</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
