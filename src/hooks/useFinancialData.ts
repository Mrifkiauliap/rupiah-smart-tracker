
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/AuthProvider';

interface FinancialData {
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
}

export function useFinancialData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: financialData, isLoading, isError } = useQuery({
    queryKey: ['financial_data'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('financial_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching financial data:', error);
        throw error;
      }

      return data as FinancialData | null;
    },
    enabled: !!user,
  });

  const saveFinancialData = useMutation({
    mutationFn: async (data: Omit<FinancialData, 'id' | 'user_id'>) => {
      if (!user) throw new Error('User not logged in');

      const financialDataToSave = {
        user_id: user.id,
        ...data
      };

      if (financialData?.id) {
        // Update existing record
        const { data: updatedData, error } = await supabase
          .from('financial_data')
          .update(financialDataToSave)
          .eq('id', financialData.id)
          .select()
          .single();

        if (error) throw error;
        return updatedData;
      } else {
        // Insert new record
        const { data: newData, error } = await supabase
          .from('financial_data')
          .insert(financialDataToSave)
          .select()
          .single();

        if (error) throw error;
        return newData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial_data'] });
      toast({
        title: "Data keuangan berhasil disimpan",
        description: "Informasi keuangan Anda telah diperbarui.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal menyimpan data",
        description: error.message || "Terjadi kesalahan saat menyimpan data keuangan.",
      });
    }
  });

  return {
    financialData,
    isLoading,
    isError,
    saveFinancialData
  };
}
