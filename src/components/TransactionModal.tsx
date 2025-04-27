
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction } from '@/types/transaction';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  onSubmit: (transaction: Transaction) => void;
}

const categories = {
  income: ['Gaji', 'Investasi', 'Bonus', 'Lainnya'],
  expense: ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Lainnya']
};

const TransactionModal = ({ isOpen, onClose, type, onSubmit }: TransactionModalProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: Number(amount),
      description,
      category,
      date: new Date()
    };
    onSubmit(transaction);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Jumlah</label>
            <Input
              type="number"
              placeholder="Masukkan jumlah"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Kategori</label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories[type].map((cat) => (
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
