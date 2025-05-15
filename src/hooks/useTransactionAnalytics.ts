
import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO, format } from 'date-fns';

export interface TransactionAnalytics {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  monthlySavings: number;
  savingsRatio: number;
  monthlyCashFlow: {
    month: string;
    income: number;
    expense: number;
    net: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  // Financial metrics
  financialMetrics: {
    liquidity: {
      value: number;
      isHealthy: boolean;
      formula: string;
      description: string;
    };
    debtToIncome?: {
      value: number;
      isHealthy: boolean;
      formula: string;
      description: string;
    };
    savingsRate: {
      value: number;
      isHealthy: boolean;
      formula: string;
      description: string;
    };
    expenseRatio: {
      value: number;
      isHealthy: boolean;
      formula: string;
      description: string;
    };
    solvencyRatio?: {
      value: number;
      isHealthy: boolean;
      formula: string;
      description: string;
    };
    investmentRatio?: {
      value: number;
      isHealthy: boolean;
      formula: string;
      description: string;
    };
  };
  incomeByMonth: { [key: string]: number };
  expenseByMonth: { [key: string]: number };
  topExpenseCategories: { category: string; amount: number }[];
}

export function useTransactionAnalytics(transactions: Transaction[], months = 6) {
  return useMemo(() => {
    // Filter transactions for the last specified months
    const currentDate = new Date();
    const startDate = startOfMonth(subMonths(currentDate, months - 1));
    const endDate = endOfMonth(currentDate);
    
    const recentTransactions = transactions.filter(transaction => {
      try {
        const transactionDate = parseISO(transaction.date);
        return isWithinInterval(transactionDate, { start: startDate, end: endDate });
      } catch (e) {
        return false;
      }
    });

    // Calculate total income and expenses
    const totalIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpense;

    // Calculate monthly cash flow
    const monthlyCashFlow = [];
    
    // Track income and expense by month for later analysis
    const incomeByMonth: { [key: string]: number } = {};
    const expenseByMonth: { [key: string]: number } = {};
    
    for (let i = 0; i < months; i++) {
      const monthStart = startOfMonth(subMonths(currentDate, i));
      const monthEnd = endOfMonth(subMonths(currentDate, i));
      const monthName = monthStart.toLocaleString('id-ID', { month: 'short' });
      const year = monthStart.getFullYear().toString().slice(-2);
      const monthKey = format(monthStart, 'yyyy-MM');
      
      const monthIncome = recentTransactions
        .filter(t => {
          const transactionDate = parseISO(t.date);
          return t.type === 'income' && isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthExpense = recentTransactions
        .filter(t => {
          const transactionDate = parseISO(t.date);
          return t.type === 'expense' && isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyCashFlow.unshift({
        month: `${monthName} '${year}`,
        income: monthIncome,
        expense: monthExpense,
        net: monthIncome - monthExpense
      });
      
      // Store in monthly tracking objects
      incomeByMonth[monthKey] = monthIncome;
      expenseByMonth[monthKey] = monthExpense;
    }

    // Calculate expense by category
    const expenseCategories: { [key: string]: number } = {};
    recentTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!expenseCategories[t.category]) {
          expenseCategories[t.category] = 0;
        }
        expenseCategories[t.category] += t.amount;
      });

    const categoryBreakdown = Object.entries(expenseCategories)
      .map(([category, amount]) => ({
        category,
        amount: amount as number,
        percentage: totalExpense ? ((amount as number) / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Find top expense categories
    const topExpenseCategories = Object.entries(expenseCategories)
      .map(([category, amount]) => ({ category, amount: amount as number }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Calculate current month savings and ratio - Make specific to ONE month
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    
    const currentMonthIncome = recentTransactions
      .filter(t => {
        const transactionDate = parseISO(t.date);
        return t.type === 'income' && isWithinInterval(transactionDate, { start: currentMonthStart, end: currentMonthEnd });
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentMonthExpense = recentTransactions
      .filter(t => {
        const transactionDate = parseISO(t.date);
        return t.type === 'expense' && isWithinInterval(transactionDate, { start: currentMonthStart, end: currentMonthEnd });
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlySavings = currentMonthIncome - currentMonthExpense;
    const savingsRatio = currentMonthIncome ? (monthlySavings / currentMonthIncome) * 100 : 0;

    // Calculate financial metrics based on the transaction data
    const avgMonthlyExpense = totalExpense / months;
    const avgMonthlyIncome = totalIncome / months;
    
    // Estimate liquidity (using net balance as a proxy for cash equivalents)
    const liquidityRatio = avgMonthlyExpense > 0 ? netBalance / avgMonthlyExpense : 0;
    
    // Calculate expense to income ratio
    const expenseToIncomeRatio = avgMonthlyIncome > 0 ? (avgMonthlyExpense / avgMonthlyIncome) * 100 : 0;
    
    // Simple debt-to-income calculation based on recent transactions
    const estimatedMonthlyDebt = recentTransactions
      .filter(t => 
        t.category.toLowerCase().includes('debt') || 
        t.category.toLowerCase().includes('loan') || 
        t.category.toLowerCase().includes('credit') ||
        t.category.toLowerCase().includes('utang')
      )
      .reduce((sum, t) => sum + t.amount, 0) / months;
    
    // Only include debt-to-income if we have debt data
    let debtToIncomeRatio;
    let debtToIncomeMetric;
    
    if (estimatedMonthlyDebt > 0) {
      debtToIncomeRatio = avgMonthlyIncome > 0 ? (estimatedMonthlyDebt / avgMonthlyIncome) * 100 : 0;
      debtToIncomeMetric = {
        value: debtToIncomeRatio,
        isHealthy: debtToIncomeRatio < 30,
        formula: 'Estimasi Pembayaran Utang Bulanan / Pendapatan Bulanan × 100%',
        description: '' // Removed description as requested
      };
    }
    
    // Financial metrics for the Analysis page
    const financialMetrics: TransactionAnalytics['financialMetrics'] = {
      liquidity: {
        value: liquidityRatio,
        isHealthy: liquidityRatio >= 3,  // Changed to match new rules (≥3 is healthy, >6 is very healthy)
        formula: 'Saldo Bersih / Rata-rata Pengeluaran Bulanan',
        description: 'Berapa bulan pengeluaran yang dapat ditanggung dengan uang yang tersedia'
      },
      savingsRate: {
        value: savingsRatio,  // Using current month savings ratio for Tingkat Tabungan
        isHealthy: savingsRatio > 10,  // Keep threshold at 10% for healthy
        formula: '(Pendapatan - Pengeluaran) / Pendapatan × 100%',
        description: 'Persentase pendapatan bulan ini yang berhasil ditabung'  // Updated to specify current month
      },
      expenseRatio: {
        value: expenseToIncomeRatio,
        isHealthy: expenseToIncomeRatio < 80,
        formula: 'Total Pengeluaran / Total Pendapatan × 100%',
        description: 'Persentase pendapatan yang digunakan untuk pengeluaran'
      }
    };

    // Add debt-to-income if we have data
    if (debtToIncomeMetric) {
      financialMetrics.debtToIncome = debtToIncomeMetric;
    }

    return {
      totalIncome,
      totalExpense,
      netBalance,
      monthlySavings,
      savingsRatio,
      monthlyCashFlow,
      categoryBreakdown,
      financialMetrics,
      incomeByMonth,
      expenseByMonth,
      topExpenseCategories
    };
  }, [transactions, months]);
}
