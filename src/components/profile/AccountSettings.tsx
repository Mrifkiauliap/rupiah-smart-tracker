
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2 } from 'lucide-react';

export function AccountSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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

      // Finally delete the user account itself
      const { error: userError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (userError) throw userError;

      // Sign out after successful deletion
      await signOut();
      
      // Redirect to login page
      navigate('/login');
      
      toast({
        title: 'Akun berhasil dihapus',
        description: 'Semua data Anda telah dihapus dari sistem kami.',
      });
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferensi Tampilan</h3>
        <p className="text-sm text-muted-foreground">
          Atur preferensi tampilan aplikasi Anda.
        </p>
      </div>
      
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
