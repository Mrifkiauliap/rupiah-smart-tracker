
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';

interface FinancialChartProps {
  transactions: Transaction[];
}

const FinancialChart = ({ transactions }: FinancialChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<7 | 30>(7); // 7 days or 30 days

  const endDate = new Date();
  const startDate = subDays(endDate, timeRange);
  
  // Filter transactions within the selected time range
  const filteredTransactions = transactions.filter(transaction => {
    try {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, { start: startDate, end: endDate });
    } catch (e) {
      return false;
    }
  });

  // Process data for line chart (daily aggregation)
  const generateDailyData = () => {
    const dailyData: Record<string, { date: string; income: number; expense: number }> = {};
    
    // Create entries for each day in the range
    for (let i = 0; i < timeRange; i++) {
      const date = subDays(endDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      dailyData[dateStr] = {
        date: format(date, 'dd/MM'),
        income: 0,
        expense: 0
      };
    }
    
    // Add transaction data
    filteredTransactions.forEach(transaction => {
      try {
        const transactionDate = parseISO(transaction.date);
        const dateStr = format(transactionDate, 'yyyy-MM-dd');
        
        if (dailyData[dateStr]) {
          if (transaction.type === 'income') {
            dailyData[dateStr].income += transaction.amount;
          } else {
            dailyData[dateStr].expense += transaction.amount;
          }
        }
      } catch (e) {
        console.error('Invalid date format', transaction.date);
      }
    });
    
    // Convert to array sorted by date
    return Object.values(dailyData).sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('');
      const dateB = b.date.split('/').reverse().join('');
      return dateA.localeCompare(dateB);
    });
  };

  const dailyData = generateDailyData();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            onClick={() => setChartType('line')}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Grafik Garis
          </Button>
          <Button 
            size="sm" 
            variant={chartType === 'bar' ? 'default' : 'outline'} 
            onClick={() => setChartType('bar')}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Grafik Batang
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={timeRange === 7 ? 'default' : 'outline'} 
            onClick={() => setTimeRange(7)}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            7 Hari
          </Button>
          <Button 
            size="sm" 
            variant={timeRange === 30 ? 'default' : 'outline'} 
            onClick={() => setTimeRange(30)}
            className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            30 Hari
          </Button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={dailyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis 
              dataKey="date" 
              stroke="#888"
              className="dark:text-gray-300" 
            />
            <YAxis 
              stroke="#888"
              className="dark:text-gray-300"
              tickFormatter={(value) => `${value / 1000}k`} 
            />
            <Tooltip 
              formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, ""]}
              labelFormatter={(label) => `Tanggal: ${label}`}
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', color: '#fff', border: '1px solid #334155' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              name="Pemasukan" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              name="Pengeluaran" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        ) : (
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis 
              dataKey="date" 
              stroke="#888"
              className="dark:text-gray-300" 
            />
            <YAxis 
              stroke="#888"
              className="dark:text-gray-300"
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, ""]}
              labelFormatter={(label) => `Tanggal: ${label}`} 
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', color: '#fff', border: '1px solid #334155' }}
            />
            <Legend />
            <Bar dataKey="income" fill="#10B981" name="Pemasukan" />
            <Bar dataKey="expense" fill="#EF4444" name="Pengeluaran" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
