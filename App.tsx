
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';

const STORAGE_KEY_USER = 'bukukas_user';
const STORAGE_KEY_DATA = 'bukukas_transactions';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    const savedData = localStorage.getItem(STORAGE_KEY_DATA);
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedData) {
      try {
        setTransactions(JSON.parse(savedData));
      } catch (e) {
        setTransactions([]);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addTransaction = (t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navigation user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard 
          transactions={transactions} 
          onAdd={addTransaction}
          onDelete={deleteTransaction}
          onUpdate={updateTransaction}
          setTransactions={setTransactions}
        />
      </main>
    </div>
  );
};

export default App;
