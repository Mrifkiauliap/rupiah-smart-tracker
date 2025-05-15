
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

  return {
    financialData,
    isLoading,
    error,
    saveFinancialData,
  };
}
