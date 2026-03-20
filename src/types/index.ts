export interface BaseCost {
  name: string;
  amount: number;
  isMonthly: boolean;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  minCapital: number;
  baseCosts: BaseCost[];
  benchmarkMultipliers: {
    traffic: number;
    competition: number;
  };
}

export interface SimulationInput {
  capital: number;
  city: string;
  locationType: 'high_traffic' | 'residential' | 'office' | 'school';
  avgTicketPrice: number;
  [key: string]: any; // Specific category fields
}

export interface SimulationResult {
  daily: {
    revenue: number;
    profit: number;
    breakEvenUnits: number;
  };
  monthly: {
    revenue: number;
    profit: number;
    roi: number;
  };
  riskScore: number; // 0-100
  aiAdvice?: string;
}
