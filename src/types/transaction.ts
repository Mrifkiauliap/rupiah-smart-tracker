
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}
