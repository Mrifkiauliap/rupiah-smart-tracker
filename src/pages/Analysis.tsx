
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, ArrowDownUp, CheckCircle2, AlertTriangle, PieChart, Database } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useFinancialData } from '@/hooks/useFinancialData';
import { useToast } from '@/components/ui/use-toast';

const Analysis = () => {
  const navigate = useNavigate();
  const { transactions } = useTransactions();
  const { settings } = useUserSettings();
  const analytics = useTransactionAnalytics(transactions);
  const { financialData, saveFinancialData } = useFinancialData();
  const { toast } = useToast();
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with saved financial data
  useEffect(() => {
    if (financialData) {
      setCashEquivalents(financialData.cash_equivalents);
      setMonthlyExpenses(financialData.monthly_expenses);
      setShortTermDebt(financialData.short_term_debt);
      setSavings(financialData.savings);
      setTotalIncome(financialData.total_income);
      setTotalDebt(financialData.total_debt);
      setTotalAssets(financialData.total_assets);
      setDebtPayment(financialData.debt_payment);
      setInvestmentAssets(financialData.investment_assets);
      
      // Show results if we have financial data
      setShowResults(true);
    } else if (transactions.length > 0) {
      // Fallback to transaction data if no financial data is saved
      setMonthlyExpenses(analytics.totalExpense / 6); // Average monthly expenses over 6 months
      setTotalIncome(analytics.totalIncome);
      setSavings(analytics.netBalance > 0 ? analytics.netBalance : 0);
      
      // Set default values for other fields
      setCashEquivalents(analytics.netBalance > 0 ? analytics.netBalance : 10000);
      setShortTermDebt(10000);
      setTotalDebt(50000);
      setTotalAssets(100000);
      setDebtPayment(5000);
      setInvestmentAssets(50000);
      
      setShowResults(true);
    }
  }, [financialData, transactions, analytics]);

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

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save data to database
      await saveFinancialData.mutateAsync({
        cash_equivalents: cashEquivalents,
        monthly_expenses: monthlyExpenses,
        short_term_debt: shortTermDebt,
        savings: savings,
        total_income: totalIncome,
        total_debt: totalDebt,
        total_assets: totalAssets,
        debt_payment: debtPayment,
        investment_assets: investmentAssets,
      });
      
      setShowResults(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan data",
        description: error.message || "Terjadi kesalahan saat menyimpan data.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-500 hover:bg-blue-500/10 flex items-center gap-2"
              onClick={() => navigate('/financial-data')}
            >
              <Database className="h-4 w-4" />
              Kelola Data Keuangan
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Button>
          </div>
        </div>

        {/* This banner shows transaction-based metrics without requiring manual input */}
        {transactions.length > 0 && (
          <Card className="p-6 bg-card text-card-foreground mb-6 overflow-hidden border-l-4 border-l-purple-500">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Berdasarkan Data Transaksi Anda</h2>
                <Badge variant={analytics.financialMetrics.savingsRate.value >= 20 ? "default" : "destructive"}>
                  {analytics.financialMetrics.savingsRate.value >= 20 ? "Keuangan Sehat" : "Perlu Perhatian"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Likuiditas</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">{analytics.financialMetrics.liquidity.value.toFixed(1)}x</div>
                    {analytics.financialMetrics.liquidity.isHealthy ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Tingkat Tabungan</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">{analytics.financialMetrics.savingsRate.value.toFixed(1)}%</div>
                    {analytics.financialMetrics.savingsRate.isHealthy ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Utang/Pendapatan</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">{analytics.financialMetrics.debtToIncome.value.toFixed(1)}%</div>
                    {analytics.financialMetrics.debtToIncome.isHealthy ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Rasio Pengeluaran</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">{analytics.financialMetrics.expenseRatio.value.toFixed(1)}%</div>
                    {analytics.financialMetrics.expenseRatio.isHealthy ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

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
