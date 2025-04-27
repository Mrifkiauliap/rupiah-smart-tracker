
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/transaction';

interface FinancialChartProps {
  transactions: Transaction[];
}

const FinancialChart = ({ transactions }: FinancialChartProps) => {
  const data = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    const existingDay = acc.find(item => item.date === date);

    if (existingDay) {
      if (transaction.type === 'income') {
        existingDay.income += transaction.amount;
      } else {
        existingDay.expense += transaction.amount;
      }
    } else {
      acc.push({
        date,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expense: transaction.type === 'expense' ? transaction.amount : 0
      });
    }

    return acc;
  }, [] as { date: string; income: number; expense: number }[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#10B981" name="Pemasukan" />
        <Bar dataKey="expense" fill="#EF4444" name="Pengeluaran" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FinancialChart;
