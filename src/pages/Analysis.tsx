import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

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

  const calculateFinancialHealth = () => {
    const results = {
      liquidity: {
        value: cashEquivalents / monthlyExpenses,
        isHealthy: false,
        rule: "Kas / Pengeluaran Bulanan ≥ 3 dan ≤ 6"
      },
      currentRatio: {
        value: cashEquivalents / (shortTermDebt || 1),
        isHealthy: false,
        rule: "Kas / Utang Jangka Pendek > 1"
      },
      savingsRatio: {
        value: (savings / totalIncome) * 100,
        isHealthy: false,
        rule: "Tabungan / Total Pendapatan > 10%"
      },
      debtRatio: {
        value: (totalDebt / totalAssets) * 100,
        isHealthy: false,
        rule: "Total Utang / Total Aset < 50%"
      },
      debtServiceRatio: {
        value: (debtPayment / totalIncome) * 100,
        isHealthy: false,
        rule: "Cicilan Utang / Total Pendapatan < 30%"
      },
      solvencyRatio: {
        value: ((totalAssets - totalDebt) / totalAssets) * 100,
        isHealthy: false,
        rule: "Kekayaan Bersih / Total Aset > 50%"
      },
      investmentRatio: {
        value: (investmentAssets / totalAssets) * 100,
        isHealthy: false,
        rule: "Aset Investasi / Total Aset > 50%"
      }
    };

    results.liquidity.isHealthy = results.liquidity.value >= 3 && results.liquidity.value <= 6;
    results.currentRatio.isHealthy = results.currentRatio.value > 1;
    results.savingsRatio.isHealthy = results.savingsRatio.value > 10;
    results.debtRatio.isHealthy = results.debtRatio.value < 50;
    results.debtServiceRatio.isHealthy = results.debtServiceRatio.value < 30;
    results.solvencyRatio.isHealthy = results.solvencyRatio.value > 50;
    results.investmentRatio.isHealthy = results.investmentRatio.value > 50;

    return results;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const financialHealth = calculateFinancialHealth();
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
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kas & Setara Kas (Rp)</label>
                <Input 
                  type="number" 
                  value={cashEquivalents || ''} 
                  onChange={(e) => setCashEquivalents(Number(e.target.value))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Pengeluaran Bulanan (Rp)</label>
                <Input 
                  type="number" 
                  value={monthlyExpenses || ''} 
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Utang Jangka Pendek (Rp)</label>
                <Input 
                  type="number" 
                  value={shortTermDebt || ''} 
                  onChange={(e) => setShortTermDebt(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tabungan (Rp)</label>
                <Input 
                  type="number" 
                  value={savings || ''} 
                  onChange={(e) => setSavings(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Pendapatan (Rp)</label>
                <Input 
                  type="number" 
                  value={totalIncome || ''} 
                  onChange={(e) => setTotalIncome(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Utang (Rp)</label>
                <Input 
                  type="number" 
                  value={totalDebt || ''} 
                  onChange={(e) => setTotalDebt(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Aset (Rp)</label>
                <Input 
                  type="number" 
                  value={totalAssets || ''} 
                  onChange={(e) => setTotalAssets(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cicilan Utang (Rp)</label>
                <Input 
                  type="number" 
                  value={debtPayment || ''} 
                  onChange={(e) => setDebtPayment(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Aset Investasi (Rp)</label>
                <Input 
                  type="number" 
                  value={investmentAssets || ''} 
                  onChange={(e) => setInvestmentAssets(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Analisis Kesehatan Keuangan
            </Button>
          </form>
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
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aspek</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead>Aturan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Likuiditas</TableCell>
                  <TableCell>{financialHealth.liquidity.value.toFixed(2)}</TableCell>
                  <TableCell>{financialHealth.liquidity.rule}</TableCell>
                  <TableCell>
                    {financialHealth.liquidity.isHealthy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Rasio Lancar</TableCell>
                  <TableCell>{financialHealth.currentRatio.value.toFixed(2)}</TableCell>
                  <TableCell>{financialHealth.currentRatio.rule}</TableCell>
                  <TableCell>
                    {financialHealth.currentRatio.isHealthy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Rasio Tabungan</TableCell>
                  <TableCell>{financialHealth.savingsRatio.value.toFixed(2)}%</TableCell>
                  <TableCell>{financialHealth.savingsRatio.rule}</TableCell>
                  <TableCell>
                    {financialHealth.savingsRatio.isHealthy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Rasio Utang</TableCell>
                  <TableCell>{financialHealth.debtRatio.value.toFixed(2)}%</TableCell>
                  <TableCell>{financialHealth.debtRatio.rule}</TableCell>
                  <TableCell>
                    {financialHealth.debtRatio.isHealthy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Pelunasan Utang</TableCell>
                  <TableCell>{financialHealth.debtServiceRatio.value.toFixed(2)}%</TableCell>
                  <TableCell>{financialHealth.debtServiceRatio.rule}</TableCell>
                  <TableCell>
                    {financialHealth.debtServiceRatio.isHealthy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Solvensi</TableCell>
                  <TableCell>{financialHealth.solvencyRatio.value.toFixed(2)}%</TableCell>
                  <TableCell>{financialHealth.solvencyRatio.rule}</TableCell>
                  <TableCell>
                    {financialHealth.solvencyRatio.isHealthy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
                      </div>
                    )}
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Investasi</TableCell>
                  <TableCell>{financialHealth.investmentRatio.value.toFixed(2)}%</TableCell>
                  <TableCell>{financialHealth.investmentRatio.rule}</TableCell>
                  <TableCell>
                    {financialHealth.investmentRatio.isHealthy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-5 w-5 mr-1" /> Sehat
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" /> Perlu Perhatian
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Rekomendasi:</h3>
              <ul className="list-disc pl-6 space-y-2">
                {!financialHealth.liquidity.isHealthy && (
                  <li>Tingkatkan likuiditas dengan menyimpan lebih banyak uang tunai untuk keadaan darurat.</li>
                )}
                {!financialHealth.currentRatio.isHealthy && (
                  <li>Kurangi utang jangka pendek atau tingkatkan aset lancar Anda.</li>
                )}
                {!financialHealth.savingsRatio.isHealthy && (
                  <li>Tingkatkan porsi tabungan dari pendapatan Anda.</li>
                )}
                {!financialHealth.debtRatio.isHealthy && (
                  <li>Kurangi total utang Anda atau tingkatkan aset untuk menyeimbangkan rasio.</li>
                )}
                {!financialHealth.debtServiceRatio.isHealthy && (
                  <li>Cari cara untuk mengurangi cicilan utang bulanan atau refinancing.</li>
                )}
                {!financialHealth.solvencyRatio.isHealthy && (
                  <li>Fokus pada pengurangan utang untuk meningkatkan kekayaan bersih.</li>
                )}
                {!financialHealth.investmentRatio.isHealthy && (
                  <li>Pertimbangkan untuk meningkatkan porsi aset investasi Anda.</li>
                )}
                {Object.values(financialHealth).every(metric => metric.isHealthy) && (
                  <li>Keuangan Anda dalam kondisi sangat baik! Pertahankan kebiasaan keuangan yang baik.</li>
                )}
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analysis;
