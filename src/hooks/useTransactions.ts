
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';

export function useTransactions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  const addTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaksi berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        title: "Error menambahkan transaksi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async (transaction: Transaction) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', transaction.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaksi berhasil diperbarui",
      });
    },
    onError: (error) => {
      toast({
        title: "Error memperbarui transaksi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaksi berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        title: "Error menghapus transaksi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
