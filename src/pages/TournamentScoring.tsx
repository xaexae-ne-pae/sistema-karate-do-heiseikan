
import { TournamentSidebar } from "@/components/TournamentSidebar";
import { Button } from "@/components/ui/button";
import { Award, Download, Filter, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const MOCK_SCORING_DATA = [
  { id: 1, athlete: "João Silva", category: "Kata Masculino", score: 8.5, round: "Eliminatória" },
  { id: 2, athlete: "Maria Oliveira", category: "Kata Feminino", score: 9.2, round: "Final" },
  { id: 3, athlete: "Pedro Santos", category: "Kumite -75kg", score: 7.8, round: "Semifinal" },
  { id: 4, athlete: "Ana Costa", category: "Kata Feminino", score: 8.7, round: "Eliminatória" },
  { id: 5, athlete: "Carlos Ferreira", category: "Kumite -60kg", score: 8.9, round: "Final" },
];

const TournamentScoring = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen bg-background">
      <TournamentSidebar />
      
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pontuação do Torneio</h1>
            <p className="text-muted-foreground">Gerenciar pontuações e avaliações</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Nova Pontuação</span>
            </Button>
          </div>
        </header>
        
        <main className="px-8 py-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todas Pontuações</TabsTrigger>
              <TabsTrigger value="kata">Kata</TabsTrigger>
              <TabsTrigger value="kumite">Kumite</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Resumo de Pontuações</CardTitle>
                    <CardDescription>Estatísticas gerais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total de avaliações</span>
                        <span className="font-medium">{MOCK_SCORING_DATA.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Maior pontuação</span>
                        <span className="font-medium">9.2</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Média geral</span>
                        <span className="font-medium">8.6</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Pontuações Recentes</CardTitle>
                        <CardDescription>Últimas pontuações registradas</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">Ver todas</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {MOCK_SCORING_DATA.slice(0, 3).map((score) => (
                        <div key={score.id} className="flex items-center justify-between border-b pb-3">
                          <div>
                            <p className="font-medium">{score.athlete}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{score.category}</Badge>
                              <span className="text-xs text-muted-foreground">{score.round}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <span className="font-semibold text-primary">{score.score}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Todas as Pontuações</CardTitle>
                  <CardDescription>Lista completa de pontuações do torneio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-muted/50 border-b">
                      <div>Atleta</div>
                      <div>Categoria</div>
                      <div>Fase</div>
                      <div className="text-right">Pontuação</div>
                    </div>
                    
                    <div className="divide-y">
                      {MOCK_SCORING_DATA.map((score) => (
                        <div key={score.id} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
                          <div>{score.athlete}</div>
                          <div>{score.category}</div>
                          <div>{score.round}</div>
                          <div className="text-right">
                            <Badge className="bg-primary/90">{score.score}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="kata" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pontuações de Kata</CardTitle>
                  <CardDescription>Apenas pontuações de competições de Kata</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Em desenvolvimento</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Essa visualização será implementada em breve.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="kumite" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pontuações de Kumite</CardTitle>
                  <CardDescription>Apenas pontuações de competições de Kumite</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Em desenvolvimento</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Essa visualização será implementada em breve.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default TournamentScoring;
