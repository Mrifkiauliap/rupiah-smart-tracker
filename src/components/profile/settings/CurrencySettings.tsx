
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const currencies = [
  { value: 'USD', label: 'USD - US Dollar ($)' },
  { value: 'IDR', label: 'IDR - Indonesian Rupiah (Rp)' },
  { value: 'EUR', label: 'EUR - Euro (€)' },
  { value: 'GBP', label: 'GBP - British Pound (£)' }
];

interface CurrencySettingsProps {
  settings: {
    currency: string;
    [key: string]: any;
  };
  updateSettings: (settings: Partial<{
    currency: string;
    [key: string]: any;
  }>) => Promise<any>;
}

export function CurrencySettings({ settings, updateSettings }: CurrencySettingsProps) {
  const handleCurrencyChange = async (newCurrency: string) => {
    await updateSettings({ currency: newCurrency });
  };

  return (
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
  );
}
