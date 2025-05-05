
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUserSettings } from '@/hooks/useUserSettings';

const currencies = [
  { value: 'USD', label: 'USD - US Dollar ($)' },
  { value: 'IDR', label: 'IDR - Indonesian Rupiah (Rp)' },
  { value: 'EUR', label: 'EUR - Euro (€)' },
  { value: 'GBP', label: 'GBP - British Pound (£)' }
];

export function AccountSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const { settings, isLoading, updateSettings } = useUserSettings();

  const handleThemeChange = async (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    await updateSettings({ theme: newTheme });
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    await updateSettings({ currency: newCurrency });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // First delete user's data
      // Delete financial metrics
      const { error: metricsError } = await supabase
        .from('financial_metrics')
        .delete()
        .eq('user_id', user.id);
      
      if (metricsError) throw metricsError;
      
      // Delete transactions
      const { error: transactionsError } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', user.id);
        
      if (transactionsError) throw transactionsError;
      
      // Delete user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id);
        
      if (settingsError) throw settingsError;
      
      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      // Sign out the user first
      await signOut();
      
      toast({
        title: 'Akun telah dihapus',
        description: 'Semua data Anda telah dihapus dari sistem kami.',
      });
      
      // Redirect to login page
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal menghapus akun',
        description: error.message || 'Terjadi kesalahan saat menghapus akun.',
      });
      setIsDeleting(false);
    }
  };

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
      
      <Card>
        <CardHeader>
          <CardTitle>Mode Tampilan</CardTitle>
          <CardDescription>
            Pilih mode tampilan yang Anda sukai.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span>Mode {theme === 'dark' ? 'Gelap' : 'Terang'}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="text-lg font-medium">Preferensi Mata Uang</h3>
        <p className="text-sm text-muted-foreground">
          Pilih mata uang yang ingin Anda gunakan dalam aplikasi.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mata Uang</CardTitle>
          <CardDescription>
            Pilih mata uang default untuk transaksi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.currency}
            onValueChange={handleCurrencyChange}
            className="space-y-3"
          >
            {currencies.map((currency) => (
              <div key={currency.value} className="flex items-center space-x-2">
                <RadioGroupItem value={currency.value} id={currency.value} />
                <Label htmlFor={currency.value}>{currency.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Separator />
      
      <div className="pt-4">
        <h3 className="text-lg font-medium text-destructive">Zona Berbahaya</h3>
        <p className="text-sm text-muted-foreground">
          Tindakan di bawah ini tidak dapat dibatalkan. Harap berhati-hati.
        </p>
      </div>
      
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Hapus Akun</CardTitle>
          <CardDescription>
            Menghapus akun akan menghapus semua data Anda secara permanen. 
            Tindakan ini tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Semua data pribadi Anda, termasuk riwayat transaksi, 
            dan metrik keuangan akan dihapus sepenuhnya dari sistem kami.
          </p>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex gap-2">
                <Trash2 className="h-4 w-4" />
                Hapus Akun Saya
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus seluruh akun
                  Anda dan semua data yang terkait dengannya secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : 'Ya, Hapus Akun Saya'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
