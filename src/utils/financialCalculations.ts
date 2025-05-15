
interface FinancialMetric {
  value: number;
  isHealthy: boolean;
  rule: string;
}

interface FinancialHealth {
  liquidity: FinancialMetric;
  currentRatio: FinancialMetric;
  savingsRatio: FinancialMetric;
  debtRatio: FinancialMetric;
  debtServiceRatio: FinancialMetric;
  solvencyRatio: FinancialMetric;
  investmentRatio: FinancialMetric;
}

export const calculateFinancialHealth = (
  cashEquivalents: number,
  monthlyExpenses: number,
  shortTermDebt: number,
  savings: number,
  totalIncome: number,
  totalDebt: number,
  totalAssets: number,
  debtPayment: number,
  investmentAssets: number
): FinancialHealth => {
  const results = {
    liquidity: {
      value: cashEquivalents / monthlyExpenses,
      isHealthy: false,
      rule: "Kas / Pengeluaran Bulanan ≥ 3 dan ≤ 6"
    },
    currentRatio: {
      value: cashEquivalents / (shortTermDebt || 1),
      isHealthy: false,
      rule: "Kas / Utang Jangka Pendek > 1"
    },
    savingsRatio: {
      value: (savings / totalIncome) * 100,
      isHealthy: false,
      rule: "Tabungan / Total Pendapatan > 10%"
    },
    debtRatio: {
      value: (totalDebt / totalAssets) * 100,
      isHealthy: false,
      rule: "Total Utang / Total Aset < 50%"
    },
    debtServiceRatio: {
      value: (debtPayment / totalIncome) * 100,
      isHealthy: false,
      rule: "Cicilan Utang / Total Pendapatan < 30%"
    },
    solvencyRatio: {
      value: ((totalAssets - totalDebt) / totalAssets) * 100,
      isHealthy: false,
      rule: "Kekayaan Bersih / Total Aset > 50%"
    },
    investmentRatio: {
      value: (investmentAssets / totalAssets) * 100,
      isHealthy: false,
      rule: "Aset Investasi / Total Aset > 50%"
    }
  };

  // New logic for liquidity: 3-6 is healthy, >6 is very healthy (both considered "isHealthy: true")
  const liquidityValue = results.liquidity.value;
  results.liquidity.isHealthy = liquidityValue >= 3;
  
  results.currentRatio.isHealthy = results.currentRatio.value > 1;
  results.savingsRatio.isHealthy = results.savingsRatio.value > 10;
  results.debtRatio.isHealthy = results.debtRatio.value < 50;
  results.debtServiceRatio.isHealthy = results.debtServiceRatio.value < 30;
  results.solvencyRatio.isHealthy = results.solvencyRatio.value > 50;
  results.investmentRatio.isHealthy = results.investmentRatio.value > 50;

  return results;
};
