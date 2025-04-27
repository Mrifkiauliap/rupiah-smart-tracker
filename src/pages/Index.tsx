
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, ArrowUp, ArrowDown, Filter, History, ChartBar } from "lucide-react";
import TransactionHistory from '@/components/TransactionHistory';
import TransactionModal from '@/components/TransactionModal';
import FinancialChart from '@/components/FinancialChart';

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setBalance(prev => 
      transaction.type === 'income' 
        ? prev + transaction.amount 
        : prev - transaction.amount
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Keuangan Pribadi</h1>
          <div className="mt-4">
            <Card className="p-6 bg-white shadow-lg">
              <h2 className="text-lg text-gray-600 mb-2">Total Saldo</h2>
              <p className="text-4xl font-bold text-purple-600">
                Rp {balance.toLocaleString('id-ID')}
              </p>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white p-6"
            onClick={() => {
              setTransactionType('income');
              setShowModal(true);
            }}
          >
            <PlusCircle className="mr-2" />
            Tambah Pemasukan
          </Button>
          
          <Button
            className="bg-red-500 hover:bg-red-600 text-white p-6"
            onClick={() => {
              setTransactionType('expense');
              setShowModal(true);
            }}
          >
            <MinusCircle className="mr-2" />
            Tambah Pengeluaran
          </Button>

          <Button className="bg-purple-500 hover:bg-purple-600 text-white p-6">
            <ChartBar className="mr-2" />
            Lihat Analisis
          </Button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Grafik Keuangan</h3>
            <FinancialChart transactions={transactions} />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Riwayat Transaksi</h3>
            <TransactionHistory transactions={transactions} />
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
