/**
 * Base calculation for daily profit based on granular inputs.
 * This is a deterministic mathematical model (Algorithm-First).
 */
export interface ProfitInput {
  traffic: number;       // People passing by
  captureRate: number;   // Percentage of people who stop (0-1)
  conversionRate: number; // Percentage of people who buy (0-1)
  avgTicketPrice: number; // Average price per sale
  unitCost: number;      // Cost of goods sold (COGS) per unit
  dailyFixedCost: number; // Stall rent, gas, etc.
}

export interface SimulationResult {
  revenue: number;
  cogs: number;
  grossProfit: number;
  netProfit: number;
  roi: number; // Return on Investment (Daily)
}

/**
 * Calculates a single day's profit prediction.
 */
export const calculateDailyProfit = (input: ProfitInput): SimulationResult => {
  const customers = input.traffic * input.captureRate * input.conversionRate;
  const revenue = customers * input.avgTicketPrice;
  const cogs = customers * input.unitCost;
  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - input.dailyFixedCost;
  const roi = netProfit / (cogs + input.dailyFixedCost);

  return {
    revenue: Math.max(0, revenue),
    cogs: Math.max(0, cogs),
    grossProfit,
    netProfit,
    roi: isFinite(roi) ? roi : 0,
  };
};

/**
 * Simulates a month (30 days) with random variability (Monte Carlo Lite).
 */
export const simulateMonth = (input: ProfitInput, variability: number = 0.2): SimulationResult => {
  let totalRevenue = 0;
  let totalCogs = 0;
  let totalNetProfit = 0;

  for (let i = 0; i < 30; i++) {
    // Introduce random fluctuation in traffic and conversion
    const fluctuate = () => 1 + (Math.random() * variability * 2 - variability);
    const dayInput = {
      ...input,
      traffic: input.traffic * fluctuate(),
      conversionRate: input.conversionRate * fluctuate(),
    };
    
    const dayResult = calculateDailyProfit(dayInput);
    totalRevenue += dayResult.revenue;
    totalCogs += dayResult.cogs;
    totalNetProfit += dayResult.netProfit;
  }

  return {
    revenue: totalRevenue,
    cogs: totalCogs,
    grossProfit: totalRevenue - totalCogs,
    netProfit: totalNetProfit,
    roi: totalNetProfit / (totalCogs + (input.dailyFixedCost * 30)),
  };
};
