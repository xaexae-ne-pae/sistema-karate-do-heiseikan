
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  ArrowLeft, 
  CreditCard, 
  Zap,
  FileText,
  ArrowRight 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RegistrationData {
  name: string;
  email: string;
  age: number;
  dojo: string;
  belt: string;
  height: number;
  weight: number;
  event: string;
}

// Mapping for belt types to display in Portuguese
const beltTypeMap: Record<string, string> = {
  "white": "Branca",
  "yellow": "Amarela",
  "red": "Vermelha",
  "orange": "Laranja",
  "green": "Verde",
  "purple": "Roxa",
  "brown": "Marrom",
  "black": "Preta"
};

// Mapping for dojo types to display in Portuguese
const dojoTypeMap: Record<string, string> = {
  "do-heiseikan": "Do Heiseikan",
  "shotokan": "Shotokan",
  "goju-ryu": "Goju-Ryu",
  "wado-ryu": "Wado-Ryu",
  "shito-ryu": "Shito-Ryu",
  "kyokushin": "Kyokushin"
};

const creditCardSchema = z.object({
  cardName: z.string().min(3, "Nome no cartão é obrigatório"),
  cardNumber: z.string().min(16, "Número do cartão inválido").max(19),
  expiryDate: z.string().min(5, "Data de validade inválida"),
  cvv: z.string().min(3, "CVV inválido").max(4),
});

type CreditCardFormData = z.infer<typeof creditCardSchema>;

const PaymentPage = () => {
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Credit card form
  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });
  
  useEffect(() => {
    // Retrieve registration data from localStorage
    const storedData = localStorage.getItem('registration_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setRegistrationData(data);
      } catch (error) {
        console.error("Error parsing registration data:", error);
        // If there's an error, redirect back to inscriptions
        navigate("/inscricoes");
      }
    } else {
      // If no data, redirect back to inscriptions
      navigate("/inscricoes");
    }
  }, [navigate]);
  
  const handlePayment = () => {
    if (paymentMethod === "card") {
      form.handleSubmit(onSubmitCreditCard)();
    } else {
      // For PIX and Boleto, just show confirmation
      setIsConfirmationOpen(true);
    }
  };
  
  const onSubmitCreditCard = (data: CreditCardFormData) => {
    // Process credit card data (in a real app, you'd send this to a payment processor)
    console.log("Credit card data:", data);
    setIsConfirmationOpen(true);
  };
  
  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    
    // Show success toast
    toast({
      title: "Inscrição confirmada!",
      description: "Sua inscrição foi realizada com sucesso.",
      variant: "default",
    });
    
    // Clear registration data
    localStorage.removeItem('registration_data');
    
    // Redirect to inscriptions page
    navigate("/inscricoes");
  };
  
  if (!registrationData) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex justify-center items-center">
          <p>Carregando dados da inscrição...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/inscricoes")}
              className="rounded-full" 
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Finalizar Inscrição</h1>
              <p className="text-muted-foreground">Complete o pagamento para confirmar sua inscrição</p>
            </div>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                  <CardDescription>Escolha como deseja pagar por sua inscrição</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Cartão</span>
                      </TabsTrigger>
                      <TabsTrigger value="pix" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>PIX</span>
                      </TabsTrigger>
                      <TabsTrigger value="boleto" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Boleto</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card" className="mt-6">
                      <Form {...form}>
                        <form className="space-y-4">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome no cartão</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome impresso no cartão" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número do cartão</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="0000 0000 0000 0000" 
                                    {...field} 
                                    maxLength={19}
                                    onChange={(e) => {
                                      // Format card number with spaces
                                      let value = e.target.value.replace(/\s/g, '');
                                      if (value.length > 0) {
                                        value = value.match(/.{1,4}/g)?.join(' ') || '';
                                      }
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Validade</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="MM/AA" 
                                      {...field} 
                                      maxLength={5}
                                      onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 3) {
                                          value = `${value.slice(0, 2)}/${value.slice(2)}`;
                                        }
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="123" 
                                      {...field} 
                                      maxLength={4}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="pix" className="mt-6">
                      <div className="rounded-lg border p-8 text-center">
                        <div className="mx-auto mb-4 h-32 w-32 bg-gray-200 flex items-center justify-center rounded">
                          <p className="text-xs text-muted-foreground">QR Code PIX</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Escaneie o QR Code acima ou copie a chave PIX abaixo
                        </p>
                        <div className="mt-4 p-2 bg-muted rounded flex items-center justify-between">
                          <span className="text-sm truncate">pix@doheiseikan.com.br</span>
                          <Button variant="ghost" size="sm">Copiar</Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="boleto" className="mt-6">
                      <div className="rounded-lg border p-8 text-center">
                        <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Gere o boleto e realize o pagamento em qualquer banco ou casa lotérica
                        </p>
                        <Button>Gerar Boleto</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handlePayment} 
                    className="w-full gap-2"
                  >
                    <span>Confirmar Pagamento</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Inscrição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Evento</h3>
                    <p>{registrationData.event}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Participante</h3>
                    <p>{registrationData.name}</p>
                    <p className="text-sm text-muted-foreground">{registrationData.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Idade</h4>
                      <p>{registrationData.age} anos</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Faixa</h4>
                      <p>{beltTypeMap[registrationData.belt] || registrationData.belt}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Dojo</h4>
                      <p>{dojoTypeMap[registrationData.dojo] || registrationData.dojo}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Peso</h4>
                      <p>{registrationData.weight} kg</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Altura</h4>
                      <p>{registrationData.height} m</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Taxa de inscrição</span>
                      <span>R$ 80,00</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Taxa de processamento</span>
                      <span>R$ 5,00</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t">
                      <span>Total</span>
                      <span>R$ 85,00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pagamento confirmado!</AlertDialogTitle>
            <AlertDialogDescription>
              Sua inscrição para {registrationData.event} foi realizada com sucesso.
              Você receberá um e-mail com os detalhes e instruções para o evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmationClose} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Confirmar</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentPage;
