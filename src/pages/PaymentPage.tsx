
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  ArrowRight,
  Shield,
  Receipt
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
import { Badge } from "@/components/ui/badge";

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

// Belt color styles for badges
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
          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT COLUMN - Registration Data Summary */}
            <div>
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-border/30 overflow-hidden">
                <CardHeader className="bg-primary/10 border-b">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Resumo da Inscrição
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="glass-morphism rounded-lg p-4">
                      <h3 className="font-semibold text-lg">{registrationData.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{registrationData.email}</p>
                    </div>
                    
                    <div className="glass-morphism rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-primary">Evento</h4>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {registrationData.event}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-4 mt-4">
                        <div>
                          <h4 className="text-xs text-muted-foreground">Idade</h4>
                          <p className="font-medium">{registrationData.age} anos</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Faixa</h4>
                          <Badge className={`mt-1 ${getBeltStyle(registrationData.belt)}`}>
                            {beltTypeMap[registrationData.belt] || registrationData.belt}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Dojo</h4>
                          <p className="font-medium">{dojoTypeMap[registrationData.dojo] || registrationData.dojo}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Peso</h4>
                          <p className="font-medium">{registrationData.weight} kg</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Altura</h4>
                          <p className="font-medium">{registrationData.height} m</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxa de inscrição</span>
                      <span className="font-medium">R$ 80,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxa de processamento</span>
                      <span className="font-medium">R$ 5,00</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-border/30">
                      <span>Total</span>
                      <span className="text-primary">R$ 85,00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 p-4 glass-morphism rounded-lg flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Pagamento seguro</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seus dados estão protegidos e sua inscrição será confirmada imediatamente após o pagamento.
                  </p>
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMNS - Payment Methods */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-border/30 overflow-hidden">
                <CardHeader className="bg-primary/10 border-b">
                  <CardTitle className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2 text-primary" />
                    Método de Pagamento
                  </CardTitle>
                  <CardDescription>Escolha como deseja pagar por sua inscrição</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="mt-2">
                    <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
                      <TabsTrigger value="card" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <CreditCard className="h-4 w-4" />
                        <span>Cartão</span>
                      </TabsTrigger>
                      <TabsTrigger value="pix" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Zap className="h-4 w-4" />
                        <span>PIX</span>
                      </TabsTrigger>
                      <TabsTrigger value="boleto" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Boleto</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card">
                      <Form {...form}>
                        <form className="space-y-5">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome no cartão</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Nome impresso no cartão" 
                                    className="bg-muted/30 border-border/30 focus:border-primary"
                                    {...field} 
                                  />
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
                                    className="bg-muted/30 border-border/30 focus:border-primary"
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
                          
                          <div className="grid grid-cols-2 gap-5">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Validade</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="MM/AA" 
                                      className="bg-muted/30 border-border/30 focus:border-primary"
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
                                      className="bg-muted/30 border-border/30 focus:border-primary"
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
                    
                    <TabsContent value="pix">
                      <div className="glass-morphism rounded-lg p-8 text-center">
                        <div className="mx-auto mb-6 h-48 w-48 flex items-center justify-center rounded-lg bg-muted/30 border-border/30 border">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/70">
                            <path d="M25 25H35V35H25V25Z" fill="currentColor"/>
                            <path d="M45 25H55V35H45V25Z" fill="currentColor"/>
                            <path d="M65 25H75V35H65V25Z" fill="currentColor"/>
                            <path d="M25 45H35V55H25V45Z" fill="currentColor"/>
                            <path d="M45 45H55V55H45V45Z" fill="currentColor"/>
                            <path d="M65 45H75V55H65V45Z" fill="currentColor"/>
                            <path d="M25 65H35V75H25V65Z" fill="currentColor"/>
                            <path d="M45 65H55V75H45V65Z" fill="currentColor"/>
                            <path d="M65 65H75V75H65V65Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Escaneie o QR Code acima ou copie a chave PIX abaixo
                        </p>
                        <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between border border-border/20 mb-4">
                          <span className="text-sm truncate font-mono">pix@doheiseikan.com.br</span>
                          <Button variant="outline" size="sm" className="bg-primary/10 hover:bg-primary/20 border-border/30">Copiar</Button>
                        </div>
                        <p className="text-xs text-primary/90">O pagamento via PIX é processado instantaneamente</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="boleto">
                      <div className="glass-morphism rounded-lg p-8 text-center">
                        <FileText className="mx-auto mb-6 h-20 w-20 text-primary/70" />
                        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                          Gere o boleto e realize o pagamento em qualquer banco ou casa lotérica.
                          <br />Vencimento em 3 dias úteis.
                        </p>
                        <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                          <Receipt className="h-4 w-4" />
                          <span>Gerar Boleto</span>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                          O boleto será enviado também para o seu e-mail
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="bg-muted/20 p-6 border-t">
                  <Button 
                    onClick={handlePayment} 
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-white py-6"
                  >
                    <span>Confirmar Pagamento</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <AlertDialogContent className="max-w-md border-border/30 glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              Pagamento confirmado!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2">
              Sua inscrição para <span className="font-medium">{registrationData.event}</span> foi realizada com sucesso.
              <br />Você receberá um e-mail com os detalhes e instruções para o evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center pt-2">
            <AlertDialogAction 
              onClick={handleConfirmationClose} 
              className="gap-2 bg-primary hover:bg-primary/90 text-white"
            >
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
