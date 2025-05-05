
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, ArrowDownUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import FinancialHealthForm from '@/components/analysis/FinancialHealthForm';
import FinancialMetricsTable from '@/components/analysis/FinancialMetricsTable';
import Recommendations from '@/components/analysis/Recommendations';
import InvestmentAnalysisForm from '@/components/analysis/InvestmentAnalysisForm';
import { calculateFinancialHealth } from '@/utils/financialCalculations';
import { useTransactions } from '@/hooks/useTransactions';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useTransactionAnalytics } from '@/hooks/useTransactionAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransactionAnalyticsChart from '@/components/analysis/TransactionAnalyticsChart';

const Analysis = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const { settings } = useUserSettings();
  const analytics = useTransactionAnalytics(transactions);
  
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
  const [showInvestmentAnalysis, setShowInvestmentAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState('transaction-analytics');

  // Pre-fill form with transaction data
  useEffect(() => {
    if (transactions.length > 0) {
      setMonthlyExpenses(analytics.totalExpense / 6); // Average monthly expenses over 6 months
      setTotalIncome(analytics.totalIncome);
      setSavings(analytics.netBalance > 0 ? analytics.netBalance : 0);
    }
  }, [transactions, analytics]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(settings.number_format, { 
      style: 'currency', 
      currency: settings.currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Analisis Kesehatan Keuangan</h1>
            <p className="text-muted-foreground">Evaluasi kondisi keuangan Anda secara menyeluruh</p>
          </div>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="transaction-analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analisis Transaksi
            </TabsTrigger>
            <TabsTrigger value="financial-health" className="flex items-center gap-2">
              <ArrowDownUp className="h-4 w-4" />
              Kesehatan Keuangan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transaction-analytics">
            <TransactionAnalyticsChart 
              analytics={analytics} 
              formatCurrency={formatCurrency} 
            />
          </TabsContent>

          <TabsContent value="financial-health">
            <Card className="p-6 bg-card text-card-foreground">
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
              <Card className="p-6 bg-card text-card-foreground mt-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Hasil Analisis Kesehatan Keuangan</h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium">Skor Kesehatan Keuangan:</span>
                      <span className="text-xl font-bold">{healthPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-4">
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

                  {!showInvestmentAnalysis && (
                    <Button
                      onClick={() => setShowInvestmentAnalysis(true)}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      Tambahkan Analisis Investasi
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {showInvestmentAnalysis && (
              <InvestmentAnalysisForm onClose={() => setShowInvestmentAnalysis(false)} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analysis;
