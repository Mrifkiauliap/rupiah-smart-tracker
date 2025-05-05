
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { ThemeSettings } from './settings/ThemeSettings';
import { CurrencySettings } from './settings/CurrencySettings'; 
import { DangerZone } from './settings/DangerZone';

export function AccountSettings() {
  const { settings, isLoading, updateSettings } = useUserSettings();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferensi Tampilan</h3>
        <p className="text-sm text-muted-foreground">
          Atur preferensi tampilan aplikasi Anda.
        </p>
      </div>
      
      <ThemeSettings settings={settings} updateSettings={updateSettings} />
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="text-lg font-medium">Preferensi Mata Uang</h3>
        <p className="text-sm text-muted-foreground">
          Pilih mata uang yang ingin Anda gunakan dalam aplikasi.
        </p>
      </div>
      
      <CurrencySettings settings={settings} updateSettings={updateSettings} />
      
      <Separator />
      
      <DangerZone />
    </div>
  );
}
