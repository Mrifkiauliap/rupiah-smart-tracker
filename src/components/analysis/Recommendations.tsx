
import React from 'react';

interface FinancialMetric {
  value: number;
  isHealthy: boolean;
}

interface RecommendationsProps {
  financialHealth: {
    liquidity: FinancialMetric;
    currentRatio: FinancialMetric;
    savingsRatio: FinancialMetric;
    debtRatio: FinancialMetric;
    debtServiceRatio: FinancialMetric;
    solvencyRatio: FinancialMetric;
    investmentRatio: FinancialMetric;
  };
}

const Recommendations = ({ financialHealth }: RecommendationsProps) => {
  const getLiquidityMessage = () => {
    const value = financialHealth.liquidity.value;
    if (value < 3) {
      return <li>Tingkatkan likuiditas dengan menyimpan lebih banyak uang tunai untuk keadaan darurat.</li>;
    } else if (value >= 3 && value <= 6) {
      return <li>Likuiditas Anda cukup oke (antara 3-6 bulan), pertahankan cadangan kas ini.</li>;
    } else {
      return <li>Likuiditas Anda sangat bagus! Anda memiliki cadangan kas yang lebih dari cukup.</li>;
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Rekomendasi:</h3>
      <ul className="list-disc pl-6 space-y-2">
        {getLiquidityMessage()}
        
        {!financialHealth.currentRatio.isHealthy && (
          <li>Kurangi utang jangka pendek atau tingkatkan aset lancar Anda.</li>
        )}
        {!financialHealth.savingsRatio.isHealthy && (
          <li>Tingkatkan porsi tabungan dari pendapatan Anda.</li>
        )}
        {!financialHealth.debtRatio.isHealthy && (
          <li>Kurangi total utang Anda atau tingkatkan aset untuk menyeimbangkan rasio.</li>
        )}
        {!financialHealth.debtServiceRatio.isHealthy && (
          <li>Cari cara untuk mengurangi cicilan utang bulanan atau refinancing.</li>
        )}
        {!financialHealth.solvencyRatio.isHealthy && (
          <li>Fokus pada pengurangan utang untuk meningkatkan kekayaan bersih.</li>
        )}
        {!financialHealth.investmentRatio.isHealthy && (
          <li>Pertimbangkan untuk meningkatkan porsi aset investasi Anda.</li>
        )}
        {Object.entries(financialHealth)
          .filter(([key]) => key !== 'liquidity') // Exclude liquidity as we handle it separately
          .every(([_, metric]) => metric.isHealthy) && 
          financialHealth.liquidity.value >= 3 && (
          <li>Keuangan Anda dalam kondisi sangat baik! Pertahankan kebiasaan keuangan yang baik.</li>
        )}
      </ul>
    </div>
  );
};

export default Recommendations;
