export interface ScreeningResult {
  candidateId: number;
  candidateEmail: string;
  score: number;
  matchedKeywords: string[];
}

export interface SimpleJob {
  id: number;
  title: string;
}