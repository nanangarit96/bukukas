
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO format
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AppState {
  transactions: Transaction[];
  user: User | null;
}
