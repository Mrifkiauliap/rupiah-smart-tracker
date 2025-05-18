import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';

export function DangerZone() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Hapus data user terlebih dahulu
      // Hapus metrik keuangan
      const { error: metricsError } = await supabase
        .from('financial_data')
        .delete()
        .eq('user_id', user.id);
      
      if (metricsError) throw metricsError;
      
      // Hapus transaksi
      const { error: transactionsError } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', user.id);
        
      if (transactionsError) throw transactionsError;
      
      // Hapus pengaturan user
      const { error: settingsError } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id);
        
      if (settingsError) throw settingsError;
      
      // Hapus profil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) throw profileError;

      // Keluar dari akun
      await signOut();
      
      toast({
        title: 'Akun telah dihapus',
        description: 'Semua data Anda telah dihapus dari sistem kami.',
      });
      
      // Redirect ke halaman login
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

  return (
    <div className="pt-4">
      <h3 className="text-lg font-medium text-destructive">Zona Berbahaya</h3>
      <p className="text-sm text-muted-foreground">
        Tindakan di bawah ini tidak dapat dibatalkan. Harap berhati-hati.
      </p>
      
      <Card className="border-destructive mt-4">
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

