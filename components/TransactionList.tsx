
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
    month: 'short',
    year: 'numeric'
  });
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white">
        <p className="text-slate-400 text-sm font-medium italic">Belum ada catatan transaksi</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-y border-slate-200">
          <tr>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanggal</th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deskripsi</th>
            <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Debit (In)</th>
            <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kredit (Out)</th>
            <th className="px-6 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest no-print">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500">
                {formatDate(t.date)}
              </td>
              <td className="px-6 py-4">
                <div className="text-xs font-bold text-slate-900">{t.category}</div>
                <div className="text-[10px] text-slate-400 italic">{t.description || '-'}</div>
              </td>
              <td className="px-6 py-4 text-right text-xs font-mono font-bold text-emerald-600">
                {t.type === TransactionType.INCOME ? formatCurrency(t.amount) : '-'}
              </td>
              <td className="px-6 py-4 text-right text-xs font-mono font-bold text-rose-600">
                {t.type === TransactionType.EXPENSE ? formatCurrency(t.amount) : '-'}
              </td>
              <td className="px-6 py-4 text-center no-print">
                <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(t)} className="p-1.5 text-slate-400 hover:text-slate-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                  <button onClick={() => onDelete(t.id)} className="p-1.5 text-slate-400 hover:text-rose-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50 border-t-2 border-slate-200">
          <tr className="font-bold text-slate-900">
            <td colSpan={2} className="px-6 py-4 text-xs text-right uppercase tracking-widest">Total Keseluruhan</td>
            <td className="px-6 py-4 text-right text-xs font-mono text-emerald-700">
              {formatCurrency(transactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0))}
            </td>
            <td className="px-6 py-4 text-right text-xs font-mono text-rose-700">
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
