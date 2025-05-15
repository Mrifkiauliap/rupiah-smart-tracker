
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, ArrowDownUp, CheckCircle2, AlertTriangle, PieChart, Database } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import FinancialHealthForm from '@/components/analysis/FinancialHealthForm';
import FinancialMetricsTable from '@/components/analysis/FinancialMetricsTable';
import Recommendations from '@/components/analysis/Recommendations';
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
  const [activeTab, setActiveTab] = useState('transaction-analytics');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with data from either saved financial data or transaction analytics
  useEffect(() => {
    if (financialData) {
      // Use saved financial data as first priority
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
      setShortTermDebt(0);
      setTotalDebt(0);
      setTotalAssets(analytics.netBalance > 0 ? analytics.netBalance * 2 : 20000); // Rough estimate
      setDebtPayment(0);
      setInvestmentAssets(0);
      
      setShowResults(true);
    }
  }, [financialData, transactions, analytics]);

  // Calculate financial health metrics
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

  // Function to handle form submission and save data
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

  // Generate enhanced financial metrics for display
  // This will ensure we always have all metrics regardless of data source
  const enhancedAnalytics = React.useMemo(() => {
    // Start with the analytics from transactions
    const enhanced = { ...analytics };
    
    // If we have financial data, replace/enhance specific metrics
    if (financialData) {
      // Replace liquidity ratio if we have cash equivalents and monthly expenses
      if (financialData.cash_equivalents > 0 && financialData.monthly_expenses > 0) {
        enhanced.financialMetrics.liquidity = {
          ...enhanced.financialMetrics.liquidity,
          value: financialData.cash_equivalents / financialData.monthly_expenses,
          isHealthy: (financialData.cash_equivalents / financialData.monthly_expenses) >= 3 && 
                    (financialData.cash_equivalents / financialData.monthly_expenses) <= 6
        };
      }
      
      // Add/replace debt to income ratio if we have total debt and total income
      if (financialData.total_debt > 0 && financialData.total_income > 0) {
        enhanced.financialMetrics.debtToIncome = {
          ...enhanced.financialMetrics.debtToIncome,
          value: (financialData.total_debt / financialData.total_income) * 100,
          isHealthy: (financialData.total_debt / financialData.total_income) * 100 < 30
        };
      }
      
      // Add/replace savings rate if we have savings and total income
      if (financialData.savings > 0 && financialData.total_income > 0) {
        enhanced.financialMetrics.savingsRate = {
          ...enhanced.financialMetrics.savingsRate,
          value: (financialData.savings / financialData.total_income) * 100,
          isHealthy: (financialData.savings / financialData.total_income) * 100 > 20
        };
      }
      
      // Add solvency ratio if missing (based on financial data)
      if (financialData.total_assets > 0) {
        enhanced.financialMetrics.solvencyRatio = {
          value: ((financialData.total_assets - financialData.total_debt) / financialData.total_assets) * 100,
          isHealthy: ((financialData.total_assets - financialData.total_debt) / financialData.total_assets) * 100 > 50,
          formula: 'Kekayaan Bersih / Total Aset × 100%',
          description: 'Kesehatan keuangan jangka panjang'
        };
      }
      
      // Add investment ratio if missing (based on financial data)
      if (financialData.total_assets > 0 && financialData.investment_assets > 0) {
        enhanced.financialMetrics.investmentRatio = {
          value: (financialData.investment_assets / financialData.total_assets) * 100,
          isHealthy: (financialData.investment_assets / financialData.total_assets) * 100 > 50,
          formula: 'Aset Investasi / Total Aset × 100%',
          description: 'Alokasi aset untuk investasi'
        };
      }
    }
    
    return enhanced;
  }, [analytics, financialData]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">SIPAKU - Analisis Kesehatan Keuangan</h1>
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
                <Badge variant={enhancedAnalytics.financialMetrics.savingsRate.value >= 20 ? "default" : "destructive"}>
                  {enhancedAnalytics.financialMetrics.savingsRate.value >= 20 ? "Keuangan Sehat" : "Perlu Perhatian"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Likuiditas</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">{enhancedAnalytics.financialMetrics.liquidity.value.toFixed(1)}x</div>
                    {enhancedAnalytics.financialMetrics.liquidity.isHealthy ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Tingkat Tabungan</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">{enhancedAnalytics.financialMetrics.savingsRate.value.toFixed(1)}%</div>
                    {enhancedAnalytics.financialMetrics.savingsRate.isHealthy ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Utang/Pendapatan</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">
                      {enhancedAnalytics.financialMetrics.debtToIncome ? 
                        enhancedAnalytics.financialMetrics.debtToIncome.value.toFixed(1) + '%' : 
                        financialData && financialData.total_income > 0 ? 
                          ((financialData.total_debt / financialData.total_income) * 100).toFixed(1) + '%' : 
                          '0%'}
                    </div>
                    {enhancedAnalytics.financialMetrics.debtToIncome ? 
                      (enhancedAnalytics.financialMetrics.debtToIncome.isHealthy ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )) : 
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    }
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="text-sm text-muted-foreground">Rasio Pengeluaran</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xl font-semibold">{enhancedAnalytics.financialMetrics.expenseRatio.value.toFixed(1)}%</div>
                    {enhancedAnalytics.financialMetrics.expenseRatio.isHealthy ? (
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
              analytics={enhancedAnalytics} 
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
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analysis;
