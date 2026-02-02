
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (t: Transaction) => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(val);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-slate-50/50">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">Tidak ada data untuk periode ini</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[700px]">
        <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
          <tr>
            <th className="px-6 py-4">Tgl</th>
            <th className="px-6 py-4">Referensi / Deskripsi</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Debit (Masuk)</th>
            <th className="px-6 py-4 text-right">Kredit (Keluar)</th>
            <th className="px-6 py-4 text-center no-print">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                {formatDate(t.date)}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-bold text-slate-800">{t.category}</div>
                <div className="text-xs text-slate-400 mt-0.5 italic">{t.description || '-'}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tighter ${
                  t.type === TransactionType.INCOME 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {t.type === TransactionType.INCOME ? 'Credit' : 'Debit'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm font-mono font-semibold text-emerald-600">
                {t.type === TransactionType.INCOME ? formatCurrency(t.amount) : '-'}
              </td>
              <td className="px-6 py-4 text-right text-sm font-mono font-semibold text-rose-600">
                {t.type === TransactionType.EXPENSE ? formatCurrency(t.amount) : '-'}
              </td>
              <td className="px-6 py-4 text-center no-print">
                <div className="flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-1">
                  <button 
                    onClick={() => onEdit(t)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50/50 font-bold text-slate-900 border-t border-slate-200">
          <tr>
            <td colSpan={3} className="px-6 py-4 text-sm text-right">TOTAL BERJALAN</td>
            <td className="px-6 py-4 text-right text-sm font-mono text-emerald-700">
              {formatCurrency(transactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0))}
            </td>
            <td className="px-6 py-4 text-right text-sm font-mono text-rose-700">
              {formatCurrency(transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0))}
            </td>
            <td className="no-print"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionList;
