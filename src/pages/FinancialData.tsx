
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Calculator, RefreshCw } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/components/AuthProvider';

// Define form validation schema
const formSchema = z.object({
  cash_equivalents: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  monthly_expenses: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  short_term_debt: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  savings: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  total_income: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  total_debt: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  total_assets: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  debt_payment: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
  investment_assets: z.coerce.number().nonnegative({
    message: "Nilai tidak boleh negatif"
  }),
});

const FinancialData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { financialData, isLoading, saveFinancialData } = useFinancialData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cash_equivalents: 0,
      monthly_expenses: 0,
      short_term_debt: 0,
      savings: 0,
      total_income: 0,
      total_debt: 0,
      total_assets: 0,
      debt_payment: 0,
      investment_assets: 0,
    },
  });

  // Update form when financial data is loaded
  useEffect(() => {
    if (financialData) {
      form.reset({
        cash_equivalents: financialData.cash_equivalents,
        monthly_expenses: financialData.monthly_expenses,
        short_term_debt: financialData.short_term_debt,
        savings: financialData.savings,
        total_income: financialData.total_income,
        total_debt: financialData.total_debt,
        total_assets: financialData.total_assets,
        debt_payment: financialData.debt_payment,
        investment_assets: financialData.investment_assets,
      });
    }
  }, [financialData, form]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await saveFinancialData.mutateAsync(values);
      toast({
        title: "Data berhasil disimpan",
        description: "Data keuangan Anda telah berhasil diperbarui.",
      });
    } catch (error) {
      console.error('Error saving financial data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goToAnalysis = () => {
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Data Keuangan</h1>
            <p className="text-muted-foreground">Isi data keuangan Anda untuk analisis lebih akurat</p>
          </div>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Button>
        </div>

        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">Input Data Keuangan</CardTitle>
            <CardDescription>
              Masukkan informasi keuangan Anda untuk mendapatkan analisis yang akurat
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cash_equivalents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kas & Setara Kas (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="monthly_expenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pengeluaran Bulanan (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="short_term_debt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Utang Jangka Pendek (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="savings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tabungan (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Pendapatan (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_debt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Utang (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total_assets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Aset (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="debt_payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cicilan Utang (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="investment_assets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aset Investasi (Rp)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Simpan Data
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={goToAnalysis}
                  >
                    <Calculator className="h-4 w-4" />
                    Lihat Analisis
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-amber-500">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-xl">Informasi Penting</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <p>Data keuangan yang Anda masukkan akan digunakan untuk menghitung berbagai rasio keuangan penting seperti:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-medium">Likuiditas</span> - Mengukur kemampuan Anda memenuhi kebutuhan jangka pendek (Kas / Pengeluaran Bulanan ≥ 3 dan ≤ 6)</li>
                <li><span className="font-medium">Rasio Lancar</span> - Mengukur kemampuan membayar utang jangka pendek (Kas / Utang Jangka Pendek {'>'} 1)</li>
                <li><span className="font-medium">Rasio Tabungan</span> - Mengukur tingkat tabungan dari pendapatan (Tabungan / Total Pendapatan {'>'} 10%)</li>
                <li><span className="font-medium">Rasio Utang</span> - Mengukur proporsi utang terhadap aset (Total Utang / Total Aset {'<'} 50%)</li>
                <li><span className="font-medium">Pelunasan Utang</span> - Mengukur beban cicilan utang terhadap pendapatan (Cicilan Utang / Total Pendapatan {'<'} 30%)</li>
                <li><span className="font-medium">Solvensi</span> - Mengukur kesehatan keuangan jangka panjang (Kekayaan Bersih / Total Aset {'>'} 50%)</li>
                <li><span className="font-medium">Investasi</span> - Mengukur alokasi aset untuk investasi (Aset Investasi / Total Aset {'>'} 50%)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialData;
