
import React from 'react';

interface SummaryCardsProps {
  income: number;
  expense: number;
  balance: number;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val);
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ income, expense, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Saldo Utama */}
      <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Sisa Saldo Periode</p>
          <h2 className="text-3xl font-black tracking-tight">{formatCurrency(balance)}</h2>
          <div className="mt-6 flex items-center">
             <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${balance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${balance >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                <span>{balance >= 0 ? 'Surplus' : 'Defisit'}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Pemasukan */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Masuk</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(income)}</h2>
        <div className="mt-4 flex items-center text-emerald-600 text-[10px] font-bold uppercase tracking-wide">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Kredit Rekening
        </div>
      </div>

      {/* Pengeluaran */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Keluar</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(expense)}</h2>
        <div className="mt-4 flex items-center text-rose-600 text-[10px] font-bold uppercase tracking-wide">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Debit Rekening
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
