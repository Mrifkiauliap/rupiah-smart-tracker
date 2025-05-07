
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinancialData } from '@/hooks/useFinancialData';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/components/AuthProvider';

// Define form validation schema
const formSchema = z.object({
  cashEquivalents: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  monthlyExpenses: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  shortTermDebt: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  savings: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  totalIncome: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  totalDebt: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  totalAssets: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  debtPayment: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  investmentAssets: z.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface FinancialHealthFormProps {
  cashEquivalents: number;
  monthlyExpenses: number;
  shortTermDebt: number;
  savings: number;
  totalIncome: number;
  totalDebt: number;
  totalAssets: number;
  debtPayment: number;
  investmentAssets: number;
  setCashEquivalents: (value: number) => void;
  setMonthlyExpenses: (value: number) => void;
  setShortTermDebt: (value: number) => void;
  setSavings: (value: number) => void;
  setTotalIncome: (value: number) => void;
  setTotalDebt: (value: number) => void;
  setTotalAssets: (value: number) => void;
  setDebtPayment: (value: number) => void;
  setInvestmentAssets: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FinancialHealthForm = ({
  cashEquivalents,
  monthlyExpenses,
  shortTermDebt,
  savings,
  totalIncome,
  totalDebt,
  totalAssets,
  debtPayment,
  investmentAssets,
  setCashEquivalents,
  setMonthlyExpenses,
  setShortTermDebt,
  setSavings,
  setTotalIncome,
  setTotalDebt,
  setTotalAssets,
  setDebtPayment,
  setInvestmentAssets,
  onSubmit
}: FinancialHealthFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
  );
};

export default FinancialHealthForm;
