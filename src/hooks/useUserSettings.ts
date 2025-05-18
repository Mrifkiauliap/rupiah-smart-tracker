
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserSettings {
  id?: string;
  currency: string;
  theme: string;
  number_format: string;
}

export function useUserSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>({
    currency: 'IDR',
    theme: 'light',
    number_format: 'id-ID',
  });
  const { toast } = useToast();

  // Fetch user settings
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchUserSettings() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setSettings({
            id: data.id,
            currency: data.currency,
            theme: data.theme,
            number_format: data.number_format,
          });
        } else {
          const { data: newSettings, error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              currency: 'IDR',
              theme: 'light',
              number_format: 'id-ID',
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user settings:', insertError.message);
          } else if (newSettings) {
            setSettings({
              id: newSettings.id,
              currency: newSettings.currency,
              theme: newSettings.theme,
              number_format: newSettings.number_format,
            });
          }
        }
      } catch (error: any) {
        console.error('Error fetching user settings:', error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserSettings();
  }, [user]);

  // Update user settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          id: settings.id, 
          user_id: user.id,
          currency: updatedSettings.currency,
          theme: updatedSettings.theme,
          number_format: updatedSettings.number_format,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(updatedSettings);
      
      toast({
        title: 'Pengaturan berhasil diperbarui',
        description: 'Perubahan Anda telah disimpan.',
      });

      return updatedSettings;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal memperbarui pengaturan',
        description: error.message,
      });
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
  };
}
