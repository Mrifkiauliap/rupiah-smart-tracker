
import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns';

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
    for (let i = 0; i < months; i++) {
      const monthStart = startOfMonth(subMonths(currentDate, i));
      const monthEnd = endOfMonth(subMonths(currentDate, i));
      const monthName = monthStart.toLocaleString('id-ID', { month: 'short' });
      const year = monthStart.getFullYear().toString().slice(-2);
      
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
    }

    // Calculate expense by category
    const expenseCategories = {};
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

    // Calculate current month savings and ratio
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

    return {
      totalIncome,
      totalExpense,
      netBalance,
      monthlySavings,
      savingsRatio,
      monthlyCashFlow,
      categoryBreakdown
    };
  }, [transactions, months]);
}
