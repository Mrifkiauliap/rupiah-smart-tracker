// This file possibly needs to be updated to fix the type errors
// Add or update the appropriate types and hooks for financial data
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

type FinancialDataInput = Omit<FinancialData, "id" | "user_id" | "created_at" | "updated_at">;

export function useFinancialData() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchFinancialData = async (): Promise<FinancialData | null> => {
    const { data, error } = await supabase
      .from('financial_data')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error("Error fetching financial data:", error);
      throw error;
    }

    return data;
  };

  const createFinancialData = async (values: FinancialDataInput): Promise<FinancialData> => {
    const { data, error } = await supabase
      .from('financial_data')
      .insert([values])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating financial data:", error);
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
      console.error("Error updating financial data:", error);
      throw error;
    }

    return data;
  };

  // New function to reset financial data
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
      console.error("Error resetting financial data:", error);
      throw error;
    }
  };

  // New function to sync data from transactions
  const syncFromTransactions = async (): Promise<FinancialData> => {
    // First get the transactions data
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*');

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError);
      throw transactionsError;
    }

    // Calculate totals from transactions
    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const debtPayments = transactions
      .filter(tx => tx.type === 'expense' && tx.category === 'Utang')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    // Get current financial data
    const currentData = await fetchFinancialData();
    
    // Prepare updated values
    const updatedValues: Partial<FinancialDataInput> = {
      total_income: income,
      monthly_expenses: expenses,
      debt_payment: debtPayments
      // We keep other fields as they are since they might not be derivable from transactions
    };

    // Update or create financial data
    if (currentData) {
      const { data, error } = await supabase
        .from('financial_data')
        .update(updatedValues)
        .eq('id', currentData.id)
        .select('*')
        .single();

      if (error) {
        console.error("Error syncing financial data:", error);
        throw error;
      }
      
      return data;
    } else {
      // If no data exists, create with default values for other fields
      const newData: FinancialDataInput = {
        ...updatedValues,
        cash_equivalents: 0,
        short_term_debt: 0,
        savings: 0,
        total_debt: 0,
        total_assets: 0,
        investment_assets: 0
      } as FinancialDataInput;

      const { data, error } = await supabase
        .from('financial_data')
        .insert([newData])
        .select('*')
        .single();

      if (error) {
        console.error("Error creating synced financial data:", error);
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

  // Mutation for syncing data from transactions
  const syncData = useMutation({
    mutationFn: syncFromTransactions,
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
