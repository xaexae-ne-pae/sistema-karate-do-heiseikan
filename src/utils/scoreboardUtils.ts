
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
  
  const newKumiteScore = { ...kumiteScore };
  
  // Reset senshu if both scores are 0
  if (athlete1Points === 0 && athlete2Points === 0) {
    newKumiteScore.athlete1.senshu = false;
    newKumiteScore.athlete2.senshu = false;
    newKumiteScore.senshuTime = undefined;
    return newKumiteScore;
  }

  // Se houver uma virada, remove o senshu anterior
  if (athlete1Points > athlete2Points && kumiteScore.athlete2.senshu) {
    newKumiteScore.athlete2.senshu = false;
    newKumiteScore.athlete1.senshu = false;
  } else if (athlete2Points > athlete1Points && kumiteScore.athlete1.senshu) {
    newKumiteScore.athlete1.senshu = false;
    newKumiteScore.athlete2.senshu = false;
  }

  // Atribui o senshu ao primeiro que pontuar
  if (!kumiteScore.athlete1.senshu && !kumiteScore.athlete2.senshu) {
    if (athlete1Points > 0 && athlete1Points > athlete2Points) {
      newKumiteScore.athlete1.senshu = true;
      newKumiteScore.senshuTime = Date.now();
    } else if (athlete2Points > 0 && athlete2Points > athlete1Points) {
      newKumiteScore.athlete2.senshu = true;
      newKumiteScore.senshuTime = Date.now();
    }
  }

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

  return null;
};
