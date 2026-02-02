
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

interface TransactionFormProps {
  onClose: () => void;
  onSave: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  initialData?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSave, initialData }) => {
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [type, setType] = useState<TransactionType>(initialData?.type || TransactionType.EXPENSE);
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Reset category if type changes and current category is not in the new type's list
    const currentCats = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!currentCats.includes(category)) {
      setCategory(currentCats[0]);
    }
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    
    onSave({
      amount: parseFloat(amount),
      type,
      category,
      description,
      date: new Date(date).toISOString()
    });
  };

  const categories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 pt-8 pb-6 bg-indigo-600 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">
            {initialData ? 'Ubah Transaksi' : 'Transaksi Baru'}
          </h2>
          <p className="text-indigo-100 text-sm mt-1">Catat detail keuangan Anda dengan akurat</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                type === TransactionType.EXPENSE 
                  ? 'bg-white text-rose-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                type === TransactionType.INCOME 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                required
                min="0"
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xl font-bold text-slate-900"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan (Opsional)</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Contoh: Makan siang di kantor"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
