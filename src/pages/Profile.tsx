
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { PasswordForm } from '@/components/profile/PasswordForm';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { ArrowLeft } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8 px-4 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profil & Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola informasi pribadi dan pengaturan akun Anda.
        </p>
      </div>
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="password">Kata Sandi</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="p-6">
            <TabsContent value="profile" className="mt-0">
              <CardTitle className="mb-4">Informasi Profil</CardTitle>
              <CardDescription className="mb-6">
                Perbarui informasi profil Anda di sini.
              </CardDescription>
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="password" className="mt-0">
              <CardTitle className="mb-4">Ubah Kata Sandi</CardTitle>
              <CardDescription className="mb-6">
                Pastikan kata sandi Anda cukup kuat untuk keamanan akun.
              </CardDescription>
              <PasswordForm />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <CardTitle className="mb-4">Pengaturan Akun</CardTitle>
              <CardDescription className="mb-6">
                Kelola pengaturan akun dan preferensi Anda.
              </CardDescription>
              <AccountSettings />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
