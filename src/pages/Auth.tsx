
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message || "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            name: registerName,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ name: registerName })
          .eq('id', authData.user.id);
          
        if (updateError) {
          console.error("Error updating profile name:", updateError);
        }
      }

      toast({
        title: "Registrasi berhasil",
        description: "Selamat datang di aplikasi keuangan pribadi!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message || "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg border-purple-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Aplikasi Keuangan Pribadi</h1>
          <p className="text-gray-600 dark:text-gray-300">Kelola keuangan pribadi Anda dengan mudah</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-200">Email</label>
                <Input 
                  type="email" 
                  placeholder="Email anda" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-200">Kata Sandi</label>
                <Input 
                  type="password" 
                  placeholder="Kata sandi anda" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-200">Nama</label>
                <Input 
                  placeholder="Nama lengkap" 
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-200">Email</label>
                <Input 
                  type="email" 
                  placeholder="Email anda" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-200">Kata Sandi</label>
                <Input 
                  type="password" 
                  placeholder="Kata sandi anda" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
