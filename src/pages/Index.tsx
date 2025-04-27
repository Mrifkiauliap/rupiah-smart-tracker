
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, ChartBar, UserCircle } from "lucide-react";
import TransactionHistory from '@/components/TransactionHistory';
import TransactionModal from '@/components/TransactionModal';
import FinancialChart from '@/components/FinancialChart';
import { Transaction } from '@/types/transaction';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setBalance(prev => 
      transaction.type === 'income' 
        ? prev + transaction.amount 
        : prev - transaction.amount
    );
    toast({
      title: "Transaksi berhasil ditambahkan",
      description: `${transaction.description} sebesar Rp ${transaction.amount.toLocaleString('id-ID')}`,
    });
  };

  const handleEditTransaction = (id: string, updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find(t => t.id === id);
    if (!oldTransaction) return;
    
    // Update balance
    const balanceAdjustment = 
      oldTransaction.type === 'income' ? -oldTransaction.amount : oldTransaction.amount;
    const newBalanceAdjustment = 
      updatedTransaction.type === 'income' ? updatedTransaction.amount : -updatedTransaction.amount;
    
    setBalance(prev => prev + balanceAdjustment + newBalanceAdjustment);
    
    // Update transactions
    setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
    
    toast({
      title: "Transaksi berhasil diperbarui",
      description: `${updatedTransaction.description} sebesar Rp ${updatedTransaction.amount.toLocaleString('id-ID')}`,
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    // Update balance
    setBalance(prev => 
      transaction.type === 'income' 
        ? prev - transaction.amount 
        : prev + transaction.amount
    );
    
    // Remove transaction
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    toast({
      title: "Transaksi berhasil dihapus",
      description: `${transaction.description} sebesar Rp ${transaction.amount.toLocaleString('id-ID')}`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section with User Info */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserCircle className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">Selamat Datang!</h1>
            </div>
            <p className="text-gray-600">Kelola keuangan Anda dengan mudah</p>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-400 text-purple-600 hover:bg-purple-50"
            onClick={() => navigate('/login')}
          >
            Masuk / Daftar
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="p-6 bg-white shadow-lg border-purple-100">
          <h2 className="text-lg text-gray-600 mb-2">Total Saldo</h2>
          <p className="text-4xl font-bold text-purple-600">
            Rp {balance.toLocaleString('id-ID')}
          </p>
        </Card>

        {/* Action Buttons with improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white p-6 transition-all duration-200 transform hover:scale-[1.02]"
            onClick={() => {
              setTransactionType('income');
              setShowModal(true);
            }}
          >
            <PlusCircle className="mr-2" />
            Tambah Pemasukan
          </Button>
          
          <Button
            className="bg-red-500 hover:bg-red-600 text-white p-6 transition-all duration-200 transform hover:scale-[1.02]"
            onClick={() => {
              setTransactionType('expense');
              setShowModal(true);
            }}
          >
            <MinusCircle className="mr-2" />
            Tambah Pengeluaran
          </Button>

          <Button 
            className="bg-purple-500 hover:bg-purple-600 text-white p-6 transition-all duration-200 transform hover:scale-[1.02]"
            onClick={() => navigate('/analysis')}
          >
            <ChartBar className="mr-2" />
            Lihat Analisis
          </Button>
        </div>

        {/* Charts and History Section with improved layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Grafik Keuangan</h3>
            <FinancialChart transactions={transactions} />
          </Card>
          
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Riwayat Transaksi</h3>
            <TransactionHistory 
              transactions={transactions} 
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
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
