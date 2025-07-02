// For the results of the screening
export interface ScreeningResult {
  candidateId: number;
  candidateEmail: string;
  score: number;
  matchedKeywords: string[];
}

// For the job selection dropdown
export interface SimpleJob {
  id: number;
  title: string;
}