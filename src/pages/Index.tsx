
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, ChartBar } from "lucide-react";
import TransactionHistory from '@/components/TransactionHistory';
import TransactionModal from '@/components/TransactionModal';
import FinancialChart from '@/components/FinancialChart';
import { useNavigate } from 'react-router-dom';
import { UserDropdown } from '@/components/UserDropdown';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/components/AuthProvider';
import { Transaction } from '@/types/transaction';
import { useUserSettings } from '@/hooks/useUserSettings';

const formatCurrency = (amount: number, currency: string, locale: string) => {
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
};

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useUserSettings();
  const { 
    transactions, 
    isLoading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (user) {
      addTransaction.mutate({
        ...transaction,
        user_id: user.id
      });
      setShowModal(false);
    }
  };

  const balance = transactions.reduce((acc, transaction) => 
    transaction.type === 'income' 
      ? acc + transaction.amount 
      : acc - transaction.amount
  , 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Kelola keuangan Anda dengan mudah</p>
          </div>
          <UserDropdown />
        </div>

        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg border-purple-100 dark:border-gray-700">
          <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-2">Total Saldo</h2>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(balance, settings.currency, settings.number_format)}
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-6"
            onClick={() => {
              setTransactionType('income');
              setShowModal(true);
            }}
          >
            <PlusCircle className="mr-2" />
            Tambah Pemasukan
          </Button>
          
          <Button
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white p-6"
            onClick={() => {
              setTransactionType('expense');
              setShowModal(true);
            }}
          >
            <MinusCircle className="mr-2" />
            Tambah Pengeluaran
          </Button>

          <Button 
            className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white p-6"
            onClick={() => navigate('/analysis')}
          >
            <ChartBar className="mr-2" />
            Lihat Analisis
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Grafik Keuangan</h3>
            <FinancialChart transactions={transactions} />
          </Card>
          
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Riwayat Transaksi</h3>
            <TransactionHistory 
              transactions={transactions} 
              onEdit={(transaction) => updateTransaction.mutate(transaction)}
              onDelete={(id) => deleteTransaction.mutate(id)}
              formatCurrency={(amount) => formatCurrency(amount, settings.currency, settings.number_format)}
            />
          </Card>
        </div>

        <TransactionModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)}
          type={transactionType}
          onSubmit={handleAddTransaction}
        />
      </div>
    </div>
  );
};

export default Index;
