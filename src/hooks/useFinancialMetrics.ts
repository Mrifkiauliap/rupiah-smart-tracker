
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useFinancialMetrics() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['financial-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_metrics')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const updateMetrics = useMutation({
    mutationFn: async (metrics: any) => {
      const { data, error } = await supabase
        .from('financial_metrics')
        .upsert(metrics)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-metrics'] });
      toast({
        title: "Metrik keuangan berhasil diperbarui",
      });
    },
    onError: (error) => {
      toast({
        title: "Error memperbarui metrik keuangan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    metrics,
    isLoading,
    updateMetrics,
  };
}
