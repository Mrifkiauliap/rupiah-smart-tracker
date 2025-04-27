
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would make an API call to validate credentials
    // For now, just simulate a login
    toast({
      title: "Login berhasil",
      description: "Selamat datang kembali!",
    });
    navigate('/');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would make an API call to register the user
    // For now, just simulate a registration
    toast({
      title: "Registrasi berhasil",
      description: "Selamat datang di aplikasi keuangan pribadi!",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Aplikasi Keuangan Pribadi</h1>
          <p className="text-gray-600">Kelola keuangan pribadi Anda dengan mudah</p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  placeholder="Email anda" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kata Sandi</label>
                <Input 
                  type="password" 
                  placeholder="Kata sandi anda" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Masuk
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama</label>
                <Input 
                  placeholder="Nama lengkap" 
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  placeholder="Email anda" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kata Sandi</label>
                <Input 
                  type="password" 
                  placeholder="Kata sandi anda" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Daftar
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            className="text-purple-600 hover:bg-purple-50"
            onClick={() => navigate('/')}
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
