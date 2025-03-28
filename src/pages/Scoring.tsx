import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Trophy,
  Timer,
  Flag,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Minus,
} from "lucide-react";
import { ScoringPanel } from "@/components/ScoringPanel";

interface Athlete {
  name: string;
  color: string;
}

interface Match {
  id: number;
  category: string;
  athlete1: Athlete;
  athlete2: Athlete;
}

const Scoring = () => {
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchPaused, setMatchPaused] = useState(false);
  const [time, setTime] = useState(120); // 2 minutes in seconds
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Dados fictícios para demonstração
  const upcomingMatches: Match[] = [
    {
      id: 1,
      category: "Kumite Masculino -75kg",
      athlete1: { name: "João Silva", color: "red" },
      athlete2: { name: "Carlos Eduardo", color: "blue" },
    },
    {
      id: 2,
      category: "Kata Feminino",
      athlete1: { name: "Ana Pereira", color: "red" },
      athlete2: { name: "Lúcia Fernandes", color: "blue" },
    },
    {
      id: 3,
      category: "Kumite Masculino -67kg",
      athlete1: { name: "Pedro Santos", color: "red" },
      athlete2: { name: "Fernando Costa", color: "blue" },
    },
  ];

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    resetMatch();
  };

  const startMatch = () => {
    setMatchStarted(true);
    setMatchPaused(false);
  };

  const pauseMatch = () => {
    setMatchPaused(true);
  };

  const resumeMatch = () => {
    setMatchPaused(false);
  };

  const resetMatch = () => {
    setMatchStarted(false);
    setMatchPaused(false);
    setTime(120);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pontuação</h1>
            <p className="text-muted-foreground">Gerenciar pontuação das lutas</p>
          </div>

          <div className="flex items-center gap-3">
            {selectedMatch ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-medium">{selectedMatch.category}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMatch.athlete1.name} vs {selectedMatch.athlete2.name}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 px-4 py-2 bg-muted rounded-lg font-mono text-lg w-20">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(time)}</span>
                </div>

                <div className="flex items-center gap-1">
                  {!matchStarted ? (
                    <Button
                      onClick={startMatch}
                      size="icon"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : matchPaused ? (
                    <Button
                      onClick={resumeMatch}
                      size="icon"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseMatch}
                      size="icon"
                      variant="default"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}

                  <Button onClick={resetMatch} size="icon" variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span>Selecione uma luta</span>
              </Button>
            )}
          </div>
        </header>

        <main className="p-6">
          {selectedMatch ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ScoringPanel
                  match={selectedMatch}
                  isActive={matchStarted && !matchPaused}
                />
              </div>

              <div className="space-y-6">
                <div className="glass-card rounded-lg p-5">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Penalidades
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="font-medium">{selectedMatch.athlete1.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Jogai</span>
                            <Flag className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Chukoku</span>
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Keikoku</span>
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-1">
                        <Badge count={0} />
                        <Badge count={0} />
                        <Badge count={0} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="font-medium">{selectedMatch.athlete2.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Jogai</span>
                            <Flag className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Chukoku</span>
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Keikoku</span>
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-1">
                        <Badge count={0} />
                        <Badge count={0} />
                        <Badge count={0} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg p-5">
                  <h2 className="text-lg font-semibold mb-4">Próximas Lutas</h2>

                  <div className="space-y-3">
                    {upcomingMatches
                      .filter((match) => match.id !== selectedMatch?.id)
                      .map((match) => (
                        <button
                          key={match.id}
                          onClick={() => handleSelectMatch(match)}
                          className="w-full p-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                          <p className="font-medium">{match.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.athlete1.name} vs {match.athlete2.name}
                          </p>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg border-dashed">
              <div className="mx-auto flex flex-col items-center">
                <Trophy className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">Selecione uma luta para pontuar</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Escolha uma das lutas abaixo para começar a registrar pontuações e penalidades.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {upcomingMatches.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => handleSelectMatch(match)}
                      className="p-4 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    >
                      <p className="font-medium">{match.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {match.athlete1.name} vs {match.athlete2.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function Badge({ count }: { count: number }) {
  return (
    <div
      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${
        count > 0 ? "bg-primary/20 text-primary" : "bg-muted"
      }`}
    >
      {count}
    </div>
  );
}

export default Scoring;
