
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
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Only navigate if we're not already on the dashboard
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
          
          // Fetch user settings and apply theme when signing in
          if (session?.user) {
            setTimeout(async () => {
              const { data } = await supabase
                .from('user_settings')
                .select('theme')
                .eq('user_id', session.user.id)
                .single();
                
              if (data && data.theme) {
                setTheme(data.theme);
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch user settings and apply theme for existing session
      if (session?.user) {
        setTimeout(async () => {
          const { data } = await supabase
            .from('user_settings')
            .select('theme')
            .eq('user_id', session.user.id)
            .single();
            
          if (data && data.theme) {
            setTheme(data.theme);
          }
        }, 0);
      }
      
      // Only redirect to login if not already there and no session
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
