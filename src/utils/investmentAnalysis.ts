export type RiskPreference = 'conservative' | 'moderate' | 'aggressive';
export type BudgetLevel = 'low' | 'medium' | 'high';

interface InvestmentRecommendation {
  products: string[];
  description: string;
  riskLevel: string;
  expectedReturn: string;
}

export const getInvestmentRecommendation = (
  riskPreference: RiskPreference,
  budgetLevel: BudgetLevel
): InvestmentRecommendation => {
  const recommendations: Record<RiskPreference, Record<BudgetLevel, InvestmentRecommendation>> = {
    conservative: {
      low: {
        products: ['Tabungan Berjangka', 'Deposito'],
        description: 'Investasi dengan risiko rendah dan return yang stabil',
        riskLevel: 'Rendah',
        expectedReturn: '4-6% per tahun'
      },
      medium: {
        products: ['Deposito', 'Obligasi Pemerintah', 'Reksa Dana Pendapatan Tetap'],
        description: 'Portfolio campuran dengan fokus pada instrumen pendapatan tetap (80%) dan pasar uang (20%)',
        riskLevel: 'Rendah-Sedang',
        expectedReturn: '6-8% per tahun'
      },
      high: {
        products: ['Obligasi Pemerintah', 'Reksa Dana Pendapatan Tetap'],
        description: 'Fokus pada instrumen pendapatan tetap dengan kualitas tinggi',
        riskLevel: 'Sedang',
        expectedReturn: '7-9% per tahun'
      }
    },
    moderate: {
      low: {
        products: ['Reksa Dana Pasar Uang'],
        description: 'Investasi pada instrumen pasar uang dengan likuiditas tinggi',
        riskLevel: 'Rendah-Sedang',
        expectedReturn: '5-7% per tahun'
      },
      medium: {
        products: ['Reksa Dana Campuran'],
        description: 'Portfolio terdiversifikasi (60% saham, 20% pendapatan tetap, 20% pasar uang)',
        riskLevel: 'Sedang',
        expectedReturn: '8-12% per tahun'
      },
      high: {
        products: ['Reksa Dana Campuran', 'Saham Bluechip'],
        description: 'Kombinasi reksadana campuran dan saham perusahaan besar',
        riskLevel: 'Sedang-Tinggi',
        expectedReturn: '10-15% per tahun'
      }
    },
    aggressive: {
      low: {
        products: ['Reksa Dana Saham'],
        description: 'Fokus pada pertumbuhan melalui reksa dana saham',
        riskLevel: 'Tinggi',
        expectedReturn: '12-18% per tahun'
      },
      medium: {
        products: ['Saham Individu'],
        description: 'Portfolio mayoritas saham (90%) dengan sedikit pendapatan tetap (10%)',
        riskLevel: 'Tinggi',
        expectedReturn: '15-20% per tahun'
      },
      high: {
        products: ['Saham', 'Cryptocurrency', 'Private Equity'],
        description: 'Portfolio agresif dengan target return tinggi',
        riskLevel: 'Sangat Tinggi',
        expectedReturn: '>20% per tahun'
      }
    }
  };

  return recommendations[riskPreference][budgetLevel];
};
