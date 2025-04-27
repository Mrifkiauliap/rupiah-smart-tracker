
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import FinancialHealthForm from '@/components/analysis/FinancialHealthForm';
import FinancialMetricsTable from '@/components/analysis/FinancialMetricsTable';
import Recommendations from '@/components/analysis/Recommendations';
import { calculateFinancialHealth } from '@/utils/financialCalculations';

const Analysis = () => {
  const navigate = useNavigate();
  const [cashEquivalents, setCashEquivalents] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [shortTermDebt, setShortTermDebt] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [debtPayment, setDebtPayment] = useState<number>(0);
  const [investmentAssets, setInvestmentAssets] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);

  const financialHealth = calculateFinancialHealth(
    cashEquivalents,
    monthlyExpenses,
    shortTermDebt,
    savings,
    totalIncome,
    totalDebt,
    totalAssets,
    debtPayment,
    investmentAssets
  );

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const healthyCount = Object.values(financialHealth).filter(metric => metric.isHealthy).length;
  const healthPercentage = (healthyCount / 7) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-800">Analisis Kesehatan Keuangan</h1>
            <p className="text-gray-600">Evaluasi kondisi keuangan Anda secara menyeluruh</p>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-400 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Button>
        </div>

        <Card className="p-6 bg-white shadow-lg">
          <FinancialHealthForm 
            cashEquivalents={cashEquivalents}
            monthlyExpenses={monthlyExpenses}
            shortTermDebt={shortTermDebt}
            savings={savings}
            totalIncome={totalIncome}
            totalDebt={totalDebt}
            totalAssets={totalAssets}
            debtPayment={debtPayment}
            investmentAssets={investmentAssets}
            setCashEquivalents={setCashEquivalents}
            setMonthlyExpenses={setMonthlyExpenses}
            setShortTermDebt={setShortTermDebt}
            setSavings={setSavings}
            setTotalIncome={setTotalIncome}
            setTotalDebt={setTotalDebt}
            setTotalAssets={setTotalAssets}
            setDebtPayment={setDebtPayment}
            setInvestmentAssets={setInvestmentAssets}
            onSubmit={handleCalculate}
          />
        </Card>

        {showResults && (
          <Card className="p-6 bg-white shadow-lg mt-6">
            <h2 className="text-xl font-bold mb-4">Hasil Analisis Kesehatan Keuangan</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">Skor Kesehatan Keuangan:</span>
                <span className="text-xl font-bold">{healthPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    healthPercentage > 70 ? 'bg-green-500' : 
                    healthPercentage > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${healthPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <FinancialMetricsTable financialHealth={financialHealth} />
            <Recommendations financialHealth={financialHealth} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analysis;

