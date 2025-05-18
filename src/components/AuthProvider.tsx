import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null,
  signOut: async () => {} 
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Membuat listener perubahan state auth pertama
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Perubahan state auth:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Hanya navigasi jika tidak ada di halaman dashboard
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
          
          // Mengambil settingan user dan menerapkan tema saat masuk
          if (session?.user) {
            setTimeout(async () => {
              const { data } = await supabase
                .from('user_settings')
                .select('theme')
                .eq('user_id', session.user.id)
                .single();
                
              if (data && data.theme) {
                // Konversi string ke 'dark' | 'light' | 'system' type
                const themeValue = data.theme === 'dark' || data.theme === 'light' ? data.theme : 'system';
                setTheme(themeValue);
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Lalu cek untuk session yang sudah ada
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Mengambil settingan user dan menerapkan tema untuk session yang sudah ada
      if (session?.user) {
        setTimeout(async () => {
          const { data } = await supabase
            .from('user_settings')
            .select('theme')
            .eq('user_id', session.user.id)
            .single();
            
          if (data && data.theme) {
            // Konversi string ke 'dark' | 'light' | 'system' type
            const themeValue = data.theme === 'dark' || data.theme === 'light' ? data.theme : 'system';
            setTheme(themeValue);
          }
        }, 0);
      }
      
      // Hanya redirect ke login jika tidak ada di halaman login dan tidak ada session
      if (!session && location.pathname !== '/login') {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, setTheme]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Sedang memuat...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

