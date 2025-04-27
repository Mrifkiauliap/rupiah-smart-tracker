
import React from 'react';

interface FinancialMetric {
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
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Rekomendasi:</h3>
      <ul className="list-disc pl-6 space-y-2">
        {!financialHealth.liquidity.isHealthy && (
          <li>Tingkatkan likuiditas dengan menyimpan lebih banyak uang tunai untuk keadaan darurat.</li>
        )}
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
        {Object.values(financialHealth).every(metric => metric.isHealthy) && (
          <li>Keuangan Anda dalam kondisi sangat baik! Pertahankan kebiasaan keuangan yang baik.</li>
        )}
      </ul>
    </div>
  );
};

export default Recommendations;

