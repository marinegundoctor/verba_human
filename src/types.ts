export interface AnalysisResult {
  text: string;
  probability: number;
  perplexityRisk: string;
  perplexityRiskDetail: string;
  burstinessScore: number;
  burstinessScoreDetail: string;
  identifiedPatterns: string[];
  targetProbability: string;
  perplexityVariance: string;
  lengthDiversity: number[];
}

export interface HumanizeResult {
  originalText: string;
  humanizedText: string;
  beforeAnalysis: AnalysisResult;
  afterAnalysis: AnalysisResult;
}

export interface SavedItem {
  id: string;
  timestamp: string;
  title: string;
  originalText: string;
  humanizedText: string;
  beforeProbability: number;
  afterProbability: number;
}
