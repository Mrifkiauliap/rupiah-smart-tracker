
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionAnalytics } from "@/hooks/useTransactionAnalytics";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#0EA5E9', '#D946EF', '#F97316'];

interface TransactionAnalyticsChartProps {
  analytics: TransactionAnalytics;
  formatCurrency: (amount: number) => string;
}

const TransactionAnalyticsChart = ({ analytics, formatCurrency }: TransactionAnalyticsChartProps) => {
  const monthlyData = analytics.monthlyCashFlow;
  const categoryData = analytics.categoryBreakdown;
  const { theme } = useTheme();
  
  // Prepare data for financial health radar chart
  const financialHealthData = [
    {
      metric: "Likuiditas",
      value: Math.min(analytics.financialMetrics.liquidity.value * 16.67, 100), // Scale to 0-100%
      fullMark: 100,
      isHealthy: analytics.financialMetrics.liquidity.isHealthy,
      actualValue: analytics.financialMetrics.liquidity.value.toFixed(2)
    },
    {
      metric: "Utang/Pendapatan",
      value: Math.max(0, 100 - analytics.financialMetrics.debtToIncome.value), // Inverse since lower is better
      fullMark: 100,
      isHealthy: analytics.financialMetrics.debtToIncome.isHealthy,
      actualValue: `${analytics.financialMetrics.debtToIncome.value.toFixed(2)}%`
    },
    {
      metric: "Tingkat Tabungan",
      value: Math.min(analytics.financialMetrics.savingsRate.value * 5, 100), // Scale to 0-100%
      fullMark: 100,
      isHealthy: analytics.financialMetrics.savingsRate.isHealthy,
      actualValue: `${analytics.financialMetrics.savingsRate.value.toFixed(2)}%`
    },
    {
      metric: "Efisiensi Pengeluaran",
      value: Math.max(0, 100 - analytics.financialMetrics.expenseRatio.value), // Inverse since lower is better
      fullMark: 100,
      isHealthy: analytics.financialMetrics.expenseRatio.isHealthy,
      actualValue: `${analytics.financialMetrics.expenseRatio.value.toFixed(2)}%`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Health Overview Card - Improved UI */}
      <Card className="col-span-1 md:col-span-2 overflow-hidden border-l-4 border-l-purple-500">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center text-lg md:text-xl">
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 p-1.5 rounded-full mr-2">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            Kesehatan Keuangan
          </CardTitle>
          <CardDescription>Analisis menyeluruh berdasarkan data transaksi Anda</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2">
              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={120} data={financialHealthData}>
                    <PolarGrid stroke={theme === 'dark' ? '#444' : '#ddd'} />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }} />
                    <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }} />
                    <Radar 
                      name="Skor" 
                      dataKey="value" 
                      stroke="#6366F1" 
                      fill="#6366F1" 
                      fillOpacity={0.3} 
                    />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        return [props.payload.actualValue, props.payload.metric]
                      }}
                      contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', color: theme === 'dark' ? '#fff' : '#000', border: theme === 'dark' ? '1px solid #334155' : '1px solid #ddd' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(analytics.financialMetrics).map(([key, metric]) => (
                  <div key={key} className={`p-4 rounded-lg border transition-all ${
                    metric.isHealthy 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{
                        key === 'liquidity' ? 'Likuiditas' :
                        key === 'debtToIncome' ? 'Utang/Pendapatan' :
                        key === 'savingsRate' ? 'Tingkat Tabungan' : 
                        'Rasio Pengeluaran'
                      }</span>
                      {metric.isHealthy ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Sehat</Badge>
                      ) : (
                        <Badge variant="destructive">Perhatikan</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.description}</span>
                      <span className={`font-semibold ${metric.isHealthy ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {key === 'liquidity' ? metric.value.toFixed(2) + 'x' : metric.value.toFixed(2) + '%'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Cash Flow Chart - Improved UI */}
      <Card className="col-span-1 md:col-span-2 overflow-hidden border-l-4 border-l-blue-500">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center text-lg md:text-xl">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-1.5 rounded-full mr-2">
              <TrendingUp className="h-5 w-5" />
            </span>
            Arus Kas Bulanan
          </CardTitle>
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
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#ddd'} />
                    <XAxis 
                      dataKey="month" 
                      stroke={theme === 'dark' ? '#ccc' : '#888'} 
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value).split(',')[0]} 
                      stroke={theme === 'dark' ? '#ccc' : '#888'}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), ""]} 
                      labelFormatter={(label) => `Bulan: ${label}`}
                      contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', color: theme === 'dark' ? '#fff' : '#000', border: theme === 'dark' ? '1px solid #334155' : '1px solid #ddd' }}
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
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#ddd'} />
                    <XAxis 
                      dataKey="month" 
                      stroke={theme === 'dark' ? '#ccc' : '#888'} 
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value).split(',')[0]} 
                      stroke={theme === 'dark' ? '#ccc' : '#888'}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), ""]} 
                      labelFormatter={(label) => `Bulan: ${label}`}
                      contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', color: theme === 'dark' ? '#fff' : '#000', border: theme === 'dark' ? '1px solid #334155' : '1px solid #ddd' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10B981" name="Pemasukan" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Pengeluaran" strokeWidth={2} />
                    <Line type="monotone" dataKey="net" stroke="#6366F1" name="Net" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card - Improved UI */}
        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1.5 rounded-full mr-2">
                <ArrowDownUp className="h-5 w-5" />
              </span>
              Ringkasan Keuangan
            </CardTitle>
            <CardDescription>Periode 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-muted-foreground">Total Pemasukan:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(analytics.totalIncome)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <span className="text-muted-foreground">Total Pengeluaran:</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(analytics.totalExpense)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-muted-foreground">Saldo Bersih:</span>
                <span className={`font-bold ${analytics.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(analytics.netBalance)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="text-muted-foreground">Rasio Tabungan:</span>
                <span className={`font-bold ${analytics.savingsRatio >= 20 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {analytics.savingsRatio.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Card - Improved UI */}
        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 p-1.5 rounded-full mr-2">
                <PieChart className="h-5 w-5" />
              </span>
              Pengeluaran per Kategori
            </CardTitle>
            <CardDescription>Distribusi pengeluaran berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6">
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
                    contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', color: theme === 'dark' ? '#fff' : '#000', border: theme === 'dark' ? '1px solid #334155' : '1px solid #ddd' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full mt-4 space-y-2 max-h-[150px] overflow-y-auto">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
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
    </div>
  );
};

export default TransactionAnalyticsChart;
