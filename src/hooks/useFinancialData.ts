import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export interface FinancialData {
  id: string;
  user_id: string;
  cash_equivalents: number;
  monthly_expenses: number;
  short_term_debt: number;
  savings: number;
  total_income: number;
  total_debt: number;
  total_assets: number;
  debt_payment: number;
  investment_assets: number;
  created_at?: string;
  updated_at?: string;
}

export type FinancialDataInput = {
  cash_equivalents: number;
  monthly_expenses: number;
  short_term_debt: number;
  savings: number;
  total_income: number;
  total_debt: number;
  total_assets: number;
  debt_payment: number;
  investment_assets: number;
};

export type TimePeriod = '1month' | '6months' | '1year' | 'all';

export function useFinancialData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchFinancialData = async (): Promise<FinancialData | null> => {
    const { data, error } = await supabase
      .from('financial_data')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error("Terjadi kesalahan saat mengambil data keuangan:", error);
      throw error;
    }

    return data;
  };

  const createFinancialData = async (values: FinancialDataInput): Promise<FinancialData> => {
    // Mendapatkan user saat ini
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User tidak terautentikasi");
    }

    // Tambahkan user_id ke dalam values
    const dataWithUserId = {
      ...values,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('financial_data')
      .insert(dataWithUserId)
      .select('*')
      .single();

    if (error) {
      console.error("Terjadi kesalahan saat membuat data keuangan:", error);
      throw error;
    }

    return data;
  };

  const updateFinancialData = async (id: string, values: Partial<FinancialDataInput>): Promise<FinancialData> => {
    const { data, error } = await supabase
      .from('financial_data')
      .update(values)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error("Terjadi kesalahan saat memperbarui data keuangan:", error);
      throw error;
    }

    return data;
  };

  // Reset data keuangan ke nilai awal
  const resetFinancialData = async (id: string): Promise<void> => {
    const resetValues: Partial<FinancialDataInput> = {
      cash_equivalents: 0,
      monthly_expenses: 0,
      short_term_debt: 0,
      savings: 0,
      total_income: 0,
      total_debt: 0,
      total_assets: 0,
      debt_payment: 0,
      investment_assets: 0
    };

    const { error } = await supabase
      .from('financial_data')
      .update(resetValues)
      .eq('id', id);

    if (error) {
      console.error("Terjadi kesalahan saat mereset data keuangan:", error);
      throw error;
    }
  };

  // Sinkronkan data dari transaksi dengan periode yang dipilih
  const syncFromTransactions = async (period: TimePeriod = '6months'): Promise<FinancialData> => {
    // Perhitungan tanggal mulai berdasarkan periode yang dipilih
    const now = new Date();
    let startDate = new Date();
    let useAllData = false;
    
    switch(period) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        useAllData = true;
        break;
      default:
        startDate.setMonth(now.getMonth() - 6); // Default to 6 months
    }

    const startDateString = startDate.toISOString();

    // Ambil data transaksi dalam periode yang dipilih (atau semua transaksi)
    const transactionsQuery = supabase
      .from('transactions')
      .select('*');
      
    if (!useAllData) {
      transactionsQuery.gte('date', startDateString);
    }
    
    const { data: transactions, error: transactionsError } = await transactionsQuery;

    if (transactionsError) {
      console.error("Terjadi kesalahan saat mengambil data transaksi:", transactionsError);
      throw transactionsError;
    }

    // Hitung total dari transaksi
    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Hitung rata-rata bulanan dari pengeluaran
    // Untuk semua data, perkirakan bulan berdasarkan tanggal transaksi terlama
    let monthsDiff;
    if (useAllData && transactions.length > 0) {
      // Cari tanggal transaksi terlama
      const dates = transactions.map(tx => new Date(tx.date));
      const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
      
      // Hitung bulan berbeda antara tanggal transaksi terlama dan saat ini
      monthsDiff = (now.getFullYear() - oldestDate.getFullYear()) * 12 + 
                  (now.getMonth() - oldestDate.getMonth());
      
      // Gunakan minimal 1 bulan untuk menghindari pembagian dengan nol
      monthsDiff = Math.max(1, monthsDiff);
    } else {
      monthsDiff = period === '1month' ? 1 : (period === '6months' ? 6 : 12);
    }
    
    const monthlyExpenses = expenses / monthsDiff;

    const debtPayments = transactions
      .filter(tx => tx.type === 'expense' && (
        tx.category.toLowerCase().includes('utang') || 
        tx.category.toLowerCase().includes('debt') || 
        tx.category.toLowerCase().includes('loan') || 
        tx.category.toLowerCase().includes('credit')
      ))
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Mendapatkan user saat ini
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User tidak terautentikasi");
    }

    // Mendapatkan data keuangan saat ini
    const currentData = await fetchFinancialData();
    
    // Hitung saldo bersih (pendapatan - pengeluaran)
    const netBalance = Math.max(0, income - expenses);
    
    // Siapkan nilai yang diperbarui
    const updatedValues: Partial<FinancialDataInput> = {
      total_income: income,
      monthly_expenses: monthlyExpenses,
      debt_payment: debtPayments,
      cash_equivalents: netBalance,  // Simpan saldo bersih ke dalam cash_equivalents
      savings: currentData?.savings || 0  // Simpan nilai tabungan yang ada
    };

    // Perbarui atau buat data keuangan
    if (currentData) {
      const { data, error } = await supabase
        .from('financial_data')
        .update(updatedValues)
        .eq('id', currentData.id)
        .select('*')
        .single();

      if (error) {
        console.error("Terjadi kesalahan saat memperbarui data keuangan:", error);
        throw error;
      }
      
      return data;
    } else {
      // Jika tidak ada data, buat dengan nilai default untuk field lainnya
      const newData = {
        ...updatedValues,
        short_term_debt: 0,
        total_debt: debtPayments * 12, // Perkiraan kasar total utang berdasarkan pembayaran
        total_assets: Math.max(0, income - expenses) * 2, // Perkiraan kasar total aset berdasarkan pendapatan - pengeluaran
        investment_assets: 0,
        user_id: user.id  // Tambahkan user_id untuk data baru
      };

      const { data, error } = await supabase
        .from('financial_data')
        .insert(newData)
        .select('*')
        .single();

      if (error) {
        console.error("Terjadi kesalahan saat membuat data keuangan:", error);
        throw error;
      }
      
      return data;
    }
  };

  const { data: financialData, isLoading, error } = useQuery({
    queryKey: ['financialData'],
    queryFn: fetchFinancialData,
  });

  const saveFinancialData = useMutation({
    mutationFn: async (values: FinancialDataInput) => {
      if (financialData) {
        return updateFinancialData(financialData.id, values);
      } else {
        return createFinancialData(values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialData'] });
      toast({
        title: "Data berhasil disimpan",
        description: "Data keuangan Anda telah diperbarui.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan data",
        description: error.message || "Terjadi kesalahan saat menyimpan data.",
      });
    },
  });

  // Mutation for resetting financial data
  const resetData = useMutation({
    mutationFn: async () => {
      if (financialData) {
        return resetFinancialData(financialData.id);
      } 
      return null; // No data to reset
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialData'] });
      toast({
        title: "Data berhasil direset",
        description: "Data keuangan Anda telah direset ke nilai awal.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal mereset data",
        description: error.message || "Terjadi kesalahan saat mereset data.",
      });
    }
  });

  // Mutation for syncing data from transactions with period option
  const syncData = useMutation({
    mutationFn: (period: TimePeriod = '6months') => syncFromTransactions(period),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialData'] });
      toast({
        title: "Data berhasil disinkronkan",
        description: "Data keuangan Anda telah diperbarui dari riwayat transaksi.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal menyinkronkan data",
        description: error.message || "Terjadi kesalahan saat menyinkronkan data.",
      });
    }
  });

  return {
    financialData,
    isLoading,
    error,
    saveFinancialData,
    resetData,
    syncData
  };
}
