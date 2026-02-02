
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Saldo Akhir */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Saldo Akhir</p>
        <h2 className={`text-2xl font-extrabold tracking-tight ${balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
          {formatCurrency(balance)}
        </h2>
        <div className="mt-2 flex items-center">
           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${balance >= 0 ? 'bg-slate-100 text-slate-600' : 'bg-rose-50 text-rose-600'}`}>
             {balance >= 0 ? 'Surplus' : 'Defisit'}
           </span>
        </div>
      </div>

      {/* Total Debit (Masuk) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">Total Masuk (Debit)</p>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(income)}</h2>
      </div>

      {/* Total Kredit (Keluar) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-1">Total Keluar (Kredit)</p>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(expense)}</h2>
      </div>
    </div>
  );
};

export default SummaryCards;
