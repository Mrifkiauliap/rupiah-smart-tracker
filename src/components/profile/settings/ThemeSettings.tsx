
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon } from 'lucide-react';

interface ThemeSettingsProps {
  settings: {
    theme: string;
    [key: string]: any;
  };
  updateSettings: (settings: Partial<{
    theme: string;
    [key: string]: any;
  }>) => Promise<any>;
}

export function ThemeSettings({ settings, updateSettings }: ThemeSettingsProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = async (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    await updateSettings({ theme: newTheme });
  };

  return (
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
  );
}
