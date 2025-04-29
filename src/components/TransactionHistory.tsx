
import React, { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionHistory = ({ transactions, onEdit, onDelete }: TransactionHistoryProps) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setEditDescription(transaction.description);
    setEditCategory(transaction.category);
    setEditDate(new Date(transaction.date));
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingTransaction && editDate) {
      const updatedTransaction = {
        ...editingTransaction,
        amount: Number(editAmount),
        description: editDescription,
        category: editCategory,
        date: editDate.toISOString()
      };
      onEdit(updatedTransaction);
      setShowEditModal(false);
    }
  };

  const categories = {
    income: ['Gaji', 'Investasi', 'Bonus', 'Lainnya'],
    expense: ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Lainnya']
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <SelectValue placeholder="Filter transaksi" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:text-white">
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Cari transaksi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border dark:border-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUp className="text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDown className="text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{transaction.category}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  Rp {transaction.amount.toLocaleString('id-ID')}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 dark:text-gray-300 dark:hover:bg-gray-600" 
                    onClick={() => handleEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" 
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            Tidak ada transaksi yang ditemukan
          </div>
        )}
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
              <div>
                <label className="text-sm font-medium dark:text-gray-200">Jumlah</label>
                <Input
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-200">Kategori</label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700">
                    {categories[editingTransaction.type as 'income' | 'expense'].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-200">Deskripsi</label>
                <Input
                  placeholder="Masukkan deskripsi"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium dark:text-gray-200">Tanggal</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editDate && "text-muted-foreground",
                        "dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editDate ? format(editDate, 'dd/MM/yyyy') : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-gray-700">
                    <Calendar
                      mode="single"
                      selected={editDate}
                      onSelect={(date) => date && setEditDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">
                Simpan Perubahan
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionHistory;
