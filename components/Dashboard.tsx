
import React, { useState, useMemo, useRef } from 'react';
import { Transaction, TransactionType } from '../types';
import SummaryCards from './SummaryCards';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (updated: Transaction) => void;
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>; // Needed for import
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAdd, onDelete, onUpdate, setTransactions }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filtering states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2020;
    const yearList = [];
    for (let i = currentYear + 1; i >= startYear; i--) {
      yearList.push(i);
    }
    return yearList;
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayIncome = filteredTransactions
        .filter(t => t.type === TransactionType.INCOME && t.date.startsWith(dateStr))
        .reduce((acc, curr) => acc + curr.amount, 0);
      const dayExpense = filteredTransactions
        .filter(t => t.type === TransactionType.EXPENSE && t.date.startsWith(dateStr))
        .reduce((acc, curr) => acc + curr.amount, 0);
      
      if (dayIncome > 0 || dayExpense > 0) {
        data.push({
          name: i.toString(),
          masuk: dayIncome,
          keluar: dayExpense
        });
      }
    }
    return data.length > 0 ? data : [{ name: '1', masuk: 0, keluar: 0 }];
  }, [filteredTransactions, selectedMonth, selectedYear]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  const handlePrint = () => window.print();

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `bukukas_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json) && setTransactions) {
          if (confirm('Impor data akan menggabungkan dengan data saat ini. Lanjutkan?')) {
            setTransactions(prev => [...json, ...prev]);
            alert('Data berhasil diimpor!');
          }
        }
      } catch (err) {
        alert('File tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('PERINGATAN: Semua data transaksi akan dihapus permanen. Apakah Anda yakin?')) {
      if (setTransactions) setTransactions([]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 no-print">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laporan Keuangan</h1>
            <p className="text-slate-500 font-medium">BukuKas Pro &bull; {months[selectedMonth]} {selectedYear}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm p-1">
            <button 
              onClick={handleExport}
              title="Backup Data ke JSON"
              className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Impor Data dari JSON"
              className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".json" 
              className="hidden" 
            />
            <div className="w-px h-full bg-slate-100 mx-1"></div>
            <button 
              onClick={handleReset}
              title="Reset Semua Data"
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <button 
            onClick={handlePrint}
            className="inline-flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak</span>
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      <SummaryCards 
        income={stats.totalIncome} 
        expense={stats.totalExpense} 
        balance={stats.balance} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            Aliran Dana Harian
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${(val/1000).toFixed(0)}k`} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                />
                <Bar dataKey="masuk" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="keluar" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
            Kategori Pengeluaran
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium">Belum ada pengeluaran</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between no-print">
          <h3 className="text-lg font-bold text-slate-900">Rincian Rekening Koran</h3>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
            {filteredTransactions.length} Transaksi
          </span>
        </div>
        <div className="print:p-0">
          <TransactionList 
            transactions={filteredTransactions} 
            onDelete={onDelete}
            onEdit={(t) => setEditingTransaction(t)}
          />
        </div>
      </div>

      <footer className="no-print pt-8 pb-4 text-center">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          <span>Data disimpan lokal secara otomatis</span>
        </div>
      </footer>

      {(showAddModal || editingTransaction) && (
        <TransactionForm 
          onClose={() => {
            setShowAddModal(false);
            setEditingTransaction(null);
          }}
          onSave={(data) => {
            if (editingTransaction) {
              onUpdate({ ...editingTransaction, ...data });
            } else {
              onAdd(data);
            }
            setShowAddModal(false);
            setEditingTransaction(null);
          }}
          initialData={editingTransaction || undefined}
        />
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; max-width: 100% !important; }
          .rounded-3xl { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
