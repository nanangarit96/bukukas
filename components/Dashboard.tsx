
import React, { useState, useMemo, useRef } from 'react';
import { Transaction, TransactionType } from '../types';
import SummaryCards from './SummaryCards';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';

interface DashboardProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (updated: Transaction) => void;
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAdd, onDelete, onUpdate, setTransactions }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const years = [2024, 2025, 2026];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((s, c) => s + c.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, c) => s + c.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pembukuan_digital_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (Array.isArray(data) && setTransactions) {
          setTransactions(data);
          alert('Data berhasil diimpor');
        }
      } catch { alert('Format file tidak valid'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">Ringkasan Keuangan</h1>
          <div className="flex gap-2 mt-1">
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="text-xs font-bold text-slate-500 bg-transparent outline-none cursor-pointer hover:text-slate-900">
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="text-xs font-bold text-slate-500 bg-transparent outline-none cursor-pointer hover:text-slate-900">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
              <button onClick={handleExport} className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors" title="Download Backup">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors" title="Impor Data">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
              </button>
              <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors" title="Cetak Rekening Koran">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              </button>
           </div>
           <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
           <button 
              onClick={() => setShowAddModal(true)} 
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
           >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Tambah Transaksi
           </button>
        </div>
      </div>

      <SummaryCards income={stats.income} expense={stats.expense} balance={stats.balance} />

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daftar Transaksi (Rekening Koran)</h3>
        </div>
        <TransactionList 
          transactions={filteredTransactions} 
          onDelete={onDelete}
          onEdit={(t) => setEditingTransaction(t)}
        />
      </div>

      {(showAddModal || editingTransaction) && (
        <TransactionForm 
          onClose={() => { setShowAddModal(false); setEditingTransaction(null); }}
          onSave={(data) => {
            if (editingTransaction) onUpdate({ ...editingTransaction, ...data });
            else onAdd(data);
            setShowAddModal(false); setEditingTransaction(null);
          }}
          initialData={editingTransaction || undefined}
        />
      )}
    </div>
  );
};

export default Dashboard;
