
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 pt-8 pb-4 border-b border-slate-50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {initialData ? 'Ubah Transaksi' : 'Catat Transaksi'}
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Input Data Keuangan</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === TransactionType.EXPENSE 
                  ? 'bg-white text-rose-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Kredit (Keluar)
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === TransactionType.INCOME 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Debit (Masuk)
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nominal (IDR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  required
                  min="0"
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-xl font-black text-slate-900"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Kategori</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-xs font-bold"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tanggal</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-xs font-bold"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Keterangan Tambahan</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-xs font-bold"
                placeholder="Contoh: Belanja bulanan rumah"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border border-slate-100 rounded-2xl font-bold text-xs text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-slate-800 shadow-lg shadow-slate-100 transition-all active:scale-95"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
