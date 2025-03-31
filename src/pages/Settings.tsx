
import React, { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Lock, 
  Trophy, 
  Clock, 
  Users, 
  FileText, 
  Palette, 
  BarChart2
} from "lucide-react";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const scoreForm = useForm({
    defaultValues: {
      maxPoints: "8",
      timeLimit: 3,
      rounds: "1",
      tiebreaker: "first-point",
      tournamentFormat: "single-elimination",
      maxParticipants: "16",
      minAthletes: "4",
      refereesCount: "3",
      videoReview: true,
      warningsBeforeDQ: "3",
      darkMode: false,
      exportFormat: "pdf"
    }
  });

  const handleSaveSettings = () => {
    // In a real app, this would save settings to a backend
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de torneio foram atualizadas com sucesso",
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">Personalize as regras e a estrutura do torneio</p>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <Card className="p-6">
            <Tabs defaultValue="scoring">
              <TabsList className="mb-6">
                <TabsTrigger value="scoring" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Pontuação e Regras</span>
                </TabsTrigger>
                <TabsTrigger value="structure" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Estrutura do Torneio</span>
                </TabsTrigger>
                <TabsTrigger value="referees" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span>Arbitragem</span>
                </TabsTrigger>
                <TabsTrigger value="visual" className="gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Visual</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Relatórios</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>Conta</span>
                </TabsTrigger>
              </TabsList>
              
              <Form {...scoreForm}>
                <form onSubmit={scoreForm.handleSubmit(handleSaveSettings)}>
                  {/* Pontuação e Regras Tab */}
                  <TabsContent value="scoring" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Pontuação do Kumite</FormLabel>
                          <FormDescription>
                            Defina o número máximo de pontos para uma vitória
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="maxPoints"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pontos para vencer</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a pontuação máxima" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="4">4 pontos</SelectItem>
                                  <SelectItem value="6">6 pontos</SelectItem>
                                  <SelectItem value="8">8 pontos</SelectItem>
                                  <SelectItem value="10">10 pontos</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={scoreForm.control}
                          name="timeLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tempo de luta</FormLabel>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{field.value} minutos</span>
                                </div>
                                <FormControl>
                                  <Slider 
                                    min={1} 
                                    max={5} 
                                    step={1} 
                                    defaultValue={[field.value]} 
                                    onValueChange={(vals) => field.onChange(vals[0])} 
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={scoreForm.control}
                          name="rounds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de rodadas</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o número de rodadas" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 rodada</SelectItem>
                                  <SelectItem value="2">2 rodadas</SelectItem>
                                  <SelectItem value="3">3 rodadas</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Critérios de Desempate</FormLabel>
                          <FormDescription>
                            Defina como resolver empates durante as lutas
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="tiebreaker"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Método de desempate</FormLabel>
                              <FormControl>
                                <RadioGroup 
                                  className="mt-2"
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value="first-point" id="first-point" />
                                    <label htmlFor="first-point" className="text-sm font-medium leading-none">
                                      Primeiro ponto marcado
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value="referee-decision" id="referee-decision" />
                                    <label htmlFor="referee-decision" className="text-sm font-medium leading-none">
                                      Decisão do árbitro
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value="extra-time" id="extra-time" />
                                    <label htmlFor="extra-time" className="text-sm font-medium leading-none">
                                      Tempo extra
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Estrutura do Torneio Tab */}
                  <TabsContent value="structure" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Formato do Torneio</FormLabel>
                          <FormDescription>
                            Selecione o tipo de chaveamento e formato competitivo
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="tournamentFormat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de chaveamento</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o formato do torneio" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="single-elimination">Chaveamento simples (Eliminação única)</SelectItem>
                                  <SelectItem value="double-elimination">Dupla eliminação</SelectItem>
                                  <SelectItem value="round-robin">Todos contra todos (Pontos corridos)</SelectItem>
                                  <SelectItem value="swiss-system">Sistema suíço</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={scoreForm.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Máximo de participantes por categoria</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o máximo de participantes" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="8">8 participantes</SelectItem>
                                  <SelectItem value="16">16 participantes</SelectItem>
                                  <SelectItem value="32">32 participantes</SelectItem>
                                  <SelectItem value="64">64 participantes</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Validação de Categorias</FormLabel>
                          <FormDescription>
                            Defina o mínimo de atletas para validar uma categoria
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="minAthletes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mínimo de atletas</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o mínimo de atletas" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="2">2 atletas</SelectItem>
                                  <SelectItem value="3">3 atletas</SelectItem>
                                  <SelectItem value="4">4 atletas</SelectItem>
                                  <SelectItem value="6">6 atletas</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <Collapsible 
                          open={!isCollapsed} 
                          onOpenChange={() => setIsCollapsed(!isCollapsed)}
                          className="space-y-2"
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              Opções avançadas de estrutura
                              <span>{isCollapsed ? "+" : "-"}</span>
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-4 mt-4">
                            <FormItem>
                              <FormLabel>Combinar categorias com poucos atletas</FormLabel>
                              <div className="flex items-center space-x-2 mt-2">
                                <Checkbox id="combine-categories" />
                                <label
                                  htmlFor="combine-categories"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Ativar combinação automática
                                </label>
                              </div>
                            </FormItem>
                            
                            <FormItem>
                              <FormLabel>Repescagem para terceiro lugar</FormLabel>
                              <div className="flex items-center space-x-2 mt-2">
                                <Checkbox id="third-place-playoff" defaultChecked />
                                <label
                                  htmlFor="third-place-playoff"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Habilitar disputa pelo terceiro lugar
                                </label>
                              </div>
                            </FormItem>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Arbitragem Tab */}
                  <TabsContent value="referees" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Configuração de Arbitragem</FormLabel>
                          <FormDescription>
                            Defina o número de árbitros e as regras de revisão
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="refereesCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de árbitros por luta</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o número de árbitros" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 árbitro</SelectItem>
                                  <SelectItem value="3">3 árbitros</SelectItem>
                                  <SelectItem value="5">5 árbitros</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={scoreForm.control}
                          name="videoReview"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base font-medium">
                                  Revisão por vídeo
                                </FormLabel>
                                <FormDescription>
                                  Permitir revisão por vídeo de situações controversas
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Sistema de Penalizações</FormLabel>
                          <FormDescription>
                            Configure as regras de advertências e penalidades
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="warningsBeforeDQ"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Avisos antes da desclassificação</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione número de avisos" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="2">2 avisos</SelectItem>
                                  <SelectItem value="3">3 avisos</SelectItem>
                                  <SelectItem value="4">4 avisos</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormItem>
                          <FormLabel>Tipos de faltas</FormLabel>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="contact-foul" defaultChecked />
                              <label htmlFor="contact-foul" className="text-sm font-medium leading-none">Contato excessivo</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="area-violation" defaultChecked />
                              <label htmlFor="area-violation" className="text-sm font-medium leading-none">Saída da área</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="passive-behavior" defaultChecked />
                              <label htmlFor="passive-behavior" className="text-sm font-medium leading-none">Comportamento passivo</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="prohibited-behavior" defaultChecked />
                              <label htmlFor="prohibited-behavior" className="text-sm font-medium leading-none">Comportamento proibido</label>
                            </div>
                          </div>
                        </FormItem>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Visual Tab */}
                  <TabsContent value="visual" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Personalização Visual</FormLabel>
                          <FormDescription>
                            Personalize a aparência do sistema
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="darkMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base font-medium">
                                  Modo Escuro
                                </FormLabel>
                                <FormDescription>
                                  Alternar entre tema claro e escuro
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormItem>
                          <FormLabel>Esquema de Cores</FormLabel>
                          <div className="mt-3">
                            <ToggleGroup type="single" className="flex flex-wrap gap-2">
                              <ToggleGroupItem value="red" className="h-10 w-10 bg-red-500 rounded-md" aria-label="Vermelho" />
                              <ToggleGroupItem value="blue" className="h-10 w-10 bg-blue-500 rounded-md" aria-label="Azul" />
                              <ToggleGroupItem value="green" className="h-10 w-10 bg-green-500 rounded-md" aria-label="Verde" />
                              <ToggleGroupItem value="purple" className="h-10 w-10 bg-purple-500 rounded-md" aria-label="Roxo" />
                              <ToggleGroupItem value="orange" className="h-10 w-10 bg-orange-500 rounded-md" aria-label="Laranja" />
                            </ToggleGroup>
                          </div>
                        </FormItem>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Logotipo e Branding</FormLabel>
                          <FormDescription>
                            Faça upload do seu logotipo e personalize o branding
                          </FormDescription>
                        </div>
                        
                        <FormItem>
                          <FormLabel>Logotipo do Torneio</FormLabel>
                          <FormControl>
                            <div className="mt-2 flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FileText className="w-8 h-8 mb-3 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para upload</span> ou arraste e solte</p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG ou SVG (MAX. 800x400px)</p>
                                </div>
                                <input type="file" className="hidden" />
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Relatórios Tab */}
                  <TabsContent value="reports" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Relatórios do Torneio</FormLabel>
                          <FormDescription>
                            Configure as opções de exportação de dados
                          </FormDescription>
                        </div>
                        
                        <FormField
                          control={scoreForm.control}
                          name="exportFormat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Formato de Exportação</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o formato de exportação" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                  <SelectItem value="csv">CSV</SelectItem>
                                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormItem>
                          <FormLabel>Dados a incluir nos relatórios</FormLabel>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-athletes" defaultChecked />
                              <label htmlFor="include-athletes" className="text-sm font-medium leading-none">Lista de atletas</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-results" defaultChecked />
                              <label htmlFor="include-results" className="text-sm font-medium leading-none">Resultados das lutas</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-categories" defaultChecked />
                              <label htmlFor="include-categories" className="text-sm font-medium leading-none">Categorias</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-statistics" defaultChecked />
                              <label htmlFor="include-statistics" className="text-sm font-medium leading-none">Estatísticas</label>
                            </div>
                          </div>
                        </FormItem>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <FormLabel className="text-lg font-medium">Estatísticas Avançadas</FormLabel>
                          <FormDescription>
                            Configure as métricas para análise de desempenho
                          </FormDescription>
                        </div>
                        
                        <FormItem>
                          <FormLabel>Métricas a monitorar</FormLabel>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="points-per-match" defaultChecked />
                              <label htmlFor="points-per-match" className="text-sm font-medium leading-none">Pontos por luta</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="win-rate" defaultChecked />
                              <label htmlFor="win-rate" className="text-sm font-medium leading-none">Taxa de vitória</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="technique-efficiency" defaultChecked />
                              <label htmlFor="technique-efficiency" className="text-sm font-medium leading-none">Eficiência de técnicas</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="warnings-received" defaultChecked />
                              <label htmlFor="warnings-received" className="text-sm font-medium leading-none">Advertências recebidas</label>
                            </div>
                          </div>
                        </FormItem>
                        
                        <Button variant="outline" className="w-full">
                          Gerar Relatório de Exemplo
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Conta Tab */}
                  <TabsContent value="account" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium mb-4">Informações da Conta</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <FormLabel>Nome</FormLabel>
                          <Input type="text" className="w-full" defaultValue="Administrador" />
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Email</FormLabel>
                          <Input type="email" className="w-full" defaultValue="admin@karate-dojo.com" />
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Cargo</FormLabel>
                          <Input type="text" className="w-full" defaultValue="Administrador" disabled />
                        </div>
                        <div className="space-y-2">
                          <FormLabel>Academia</FormLabel>
                          <Input type="text" className="w-full" defaultValue="DÓ-HEISEIKAN" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-medium">Segurança</h3>
                      <div className="space-y-2">
                        <FormLabel>Senha Atual</FormLabel>
                        <Input type="password" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Nova Senha</FormLabel>
                        <Input type="password" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Confirmar Nova Senha</FormLabel>
                        <Input type="password" className="w-full" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="button" variant="outline" className="mr-2">Cancelar</Button>
                    <Button type="submit">Salvar Alterações</Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
