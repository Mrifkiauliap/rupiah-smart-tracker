
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionAnalytics } from "@/hooks/useTransactionAnalytics";

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6'];

interface TransactionAnalyticsChartProps {
  analytics: TransactionAnalytics;
  formatCurrency: (amount: number) => string;
}

const TransactionAnalyticsChart = ({ analytics, formatCurrency }: TransactionAnalyticsChartProps) => {
  const monthlyData = analytics.monthlyCashFlow;
  const categoryData = analytics.categoryBreakdown;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Cash Flow Chart */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Arus Kas Bulanan</CardTitle>
          <CardDescription>Pemasukan dan pengeluaran selama 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar">
            <TabsList className="mb-4">
              <TabsTrigger value="bar">Grafik Batang</TabsTrigger>
              <TabsTrigger value="line">Grafik Garis</TabsTrigger>
            </TabsList>
            <TabsContent value="bar">
              <div className="h-[350px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value).split(',')[0]} 
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), ""]} 
                      labelFormatter={(label) => `Bulan: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10B981" name="Pemasukan" />
                    <Bar dataKey="expense" fill="#EF4444" name="Pengeluaran" />
                    <Bar dataKey="net" fill="#6366F1" name="Net" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="line">
              <div className="h-[350px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value).split(',')[0]} 
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), ""]} 
                      labelFormatter={(label) => `Bulan: ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10B981" name="Pemasukan" />
                    <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Pengeluaran" />
                    <Line type="monotone" dataKey="net" stroke="#6366F1" name="Net" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Keuangan</CardTitle>
          <CardDescription>Periode 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-muted-foreground">Total Pemasukan:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(analytics.totalIncome)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-muted-foreground">Total Pengeluaran:</span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {formatCurrency(analytics.totalExpense)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-muted-foreground">Saldo Bersih:</span>
              <span className={`font-bold ${analytics.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(analytics.netBalance)}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-muted-foreground">Rasio Tabungan:</span>
              <span className={`font-bold ${analytics.savingsRatio >= 20 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {analytics.savingsRatio.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pengeluaran per Kategori</CardTitle>
          <CardDescription>Distribusi pengeluaran berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), ""]} 
                  labelFormatter={(name) => `Kategori: ${name}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full mt-4 space-y-2 max-h-[150px] overflow-y-auto">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-sm">{category.category}</span>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionAnalyticsChart;
