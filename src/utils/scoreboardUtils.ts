
import { KataScore, KumiteScore, MatchData } from "@/types";

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const calculateKataTotal = (kataScore: KataScore): number => {
  return kataScore.judge1 + kataScore.judge2 + kataScore.judge3;
};

export const calculateKumitePoints = (athlete: "athlete1" | "athlete2", kumiteScore: KumiteScore): number => {
  const scores = kumiteScore[athlete];
  return scores.yuko + scores.wazari * 2 + scores.ippon * 3 - scores.penalties;
};

export const updateSenshu = (kumiteScore: KumiteScore): KumiteScore => {
  const athlete1Points = calculateKumitePoints("athlete1", kumiteScore);
  const athlete2Points = calculateKumitePoints("athlete2", kumiteScore);
  
  // Criamos uma cópia para não modificar o objeto original
  const newKumiteScore = { 
    athlete1: { ...kumiteScore.athlete1 },
    athlete2: { ...kumiteScore.athlete2 },
    senshuTime: kumiteScore.senshuTime
  };
  
  // Se ambos os atletas têm 0 pontos, ninguém tem senshu
  if (athlete1Points === 0 && athlete2Points === 0) {
    newKumiteScore.athlete1.senshu = false;
    newKumiteScore.athlete2.senshu = false;
    newKumiteScore.senshuTime = undefined;
    return newKumiteScore;
  }
  
  // Se o atleta 1 está na frente, ele ganha senshu (se ninguém tiver)
  if (athlete1Points > athlete2Points) {
    // Se o atleta 2 tinha senshu antes, ele perde porque o atleta 1 virou o placar
    if (newKumiteScore.athlete2.senshu) {
      newKumiteScore.athlete2.senshu = false;
      // Importante: não dá senshu para o atleta 1 imediatamente, apenas remove do atleta 2
    } else if (!newKumiteScore.athlete1.senshu && !newKumiteScore.athlete2.senshu) {
      // Se ninguém tem senshu, o atleta 1 ganha
      newKumiteScore.athlete1.senshu = true;
      newKumiteScore.senshuTime = Date.now();
    }
  } 
  // Se o atleta 2 está na frente, ele ganha senshu (se ninguém tiver)
  else if (athlete2Points > athlete1Points) {
    // Se o atleta 1 tinha senshu antes, ele perde porque o atleta 2 virou o placar
    if (newKumiteScore.athlete1.senshu) {
      newKumiteScore.athlete1.senshu = false;
      // Importante: não dá senshu para o atleta 2 imediatamente, apenas remove do atleta 1
    } else if (!newKumiteScore.athlete1.senshu && !newKumiteScore.athlete2.senshu) {
      // Se ninguém tem senshu, o atleta 2 ganha
      newKumiteScore.athlete2.senshu = true;
      newKumiteScore.senshuTime = Date.now();
    }
  }
  // Se for empate, não alteramos o senshu - quem já tinha mantém
  
  return newKumiteScore;
};

export const determineKumiteWinner = (match: MatchData, kumiteScore: KumiteScore): string | null => {
  if (!match || match.type.toString() !== "kumite") return null;

  const athlete1 = kumiteScore.athlete1;
  const athlete2 = kumiteScore.athlete2;

  if (athlete1.hansoku > 0 || athlete1.shikkaku > 0) return match.athlete2;
  if (athlete2.hansoku > 0 || athlete2.shikkaku > 0) return match.athlete1;

  const athlete1Score = calculateKumitePoints("athlete1", kumiteScore);
  const athlete2Score = calculateKumitePoints("athlete2", kumiteScore);

  if (athlete1Score > athlete2Score) return match.athlete1;
  if (athlete2Score > athlete1Score) return match.athlete2;

  // Se chegou aqui é empate, verificar quem tem senshu
  if (kumiteScore.athlete1.senshu) return match.athlete1;
  if (kumiteScore.athlete2.senshu) return match.athlete2;

  return null;
};
