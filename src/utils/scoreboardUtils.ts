
import { KataScore, KumiteScore, MatchData, ScoreboardData } from "@/types";

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Calculate total kata score from all judges
export const calculateKataTotal = (kataScore: KataScore): number => {
  return kataScore.judge1 + kataScore.judge2 + kataScore.judge3;
};

// Calculate kumite points for an athlete
export const calculateKumitePoints = (
  athlete: "athlete1" | "athlete2", 
  kumiteScore: KumiteScore
): number => {
  const scores = kumiteScore[athlete];
  return scores.yuko + scores.wazari * 2 + scores.ippon * 3 - scores.penalties;
};

// Determine winner in kumite match
export const determineWinner = (
  match: MatchData, 
  kumiteScore: KumiteScore, 
  senshu: "athlete1" | "athlete2" | null
): string | null => {
  if (!match || match.type !== "kumite") return null;

  const athlete1 = kumiteScore.athlete1;
  const athlete2 = kumiteScore.athlete2;

  if (athlete1.hansoku > 0 || athlete1.shikkaku > 0)
    return match.athlete2 || null;
  if (athlete2.hansoku > 0 || athlete2.shikkaku > 0)
    return match.athlete1;

  const athlete1Score = calculateKumitePoints("athlete1", kumiteScore);
  const athlete2Score = calculateKumitePoints("athlete2", kumiteScore);

  if (athlete1Score > athlete2Score) return match.athlete1;
  if (athlete2Score > athlete1Score) return match.athlete2;
  
  // In case of a tie, the athlete with Senshu wins
  if (athlete1Score === athlete2Score) {
    if (senshu === "athlete1") return match.athlete1;
    if (senshu === "athlete2") return match.athlete2;
  }

  return null;
};

// Check if match is tied
export const isTie = (kumiteScore: KumiteScore): boolean => {
  const athlete1Points = calculateKumitePoints("athlete1", kumiteScore);
  const athlete2Points = calculateKumitePoints("athlete2", kumiteScore);
  return athlete1Points === athlete2Points;
};

// Update Senshu based on score changes - FIXED to maintain Senshu once assigned
export const updateSenshu = (
  kumiteScore: KumiteScore,
  currentSenshu: "athlete1" | "athlete2" | null,
  firstPointScored: boolean
): "athlete1" | "athlete2" | null => {
  const athlete1Points = calculateKumitePoints("athlete1", kumiteScore);
  const athlete2Points = calculateKumitePoints("athlete2", kumiteScore);
  
  // If first point hasn't been scored yet and one athlete scores
  if (!firstPointScored) {
    if (athlete1Points > 0 && athlete2Points === 0) {
      return "athlete1";
    }
    if (athlete2Points > 0 && athlete1Points === 0) {
      return "athlete2";
    }
  }
  
  // Once Senshu is assigned, it should be maintained even if the score changes
  // Unless explicitly removed by a referee decision (handled elsewhere)
  return currentSenshu;
};
