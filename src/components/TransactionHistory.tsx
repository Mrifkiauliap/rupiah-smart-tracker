
import React, { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Filter, Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onEdit?: (id: string, updatedTransaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

const TransactionHistory = ({ transactions, onEdit, onDelete }: TransactionHistoryProps) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
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
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingTransaction && onEdit) {
      const updatedTransaction = {
        ...editingTransaction,
        amount: Number(editAmount),
        description: editDescription,
        category: editCategory
      };
      onEdit(editingTransaction.id, updatedTransaction);
      setShowEditModal(false);
    }
  };

  const categories = {
    income: ['Gaji', 'Investasi', 'Bonus', 'Lainnya'],
    expense: ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Lainnya']
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter transaksi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Cari transaksi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUp className="text-green-600" />
                  ) : (
                    <ArrowDown className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  Rp {transaction.amount.toLocaleString('id-ID')}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => onDelete(transaction.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            Tidak ada transaksi yang ditemukan
          </div>
        )}
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Jumlah</label>
                <Input
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[editingTransaction.type].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Input
                  placeholder="Masukkan deskripsi"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                />
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
