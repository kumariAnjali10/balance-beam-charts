
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import { Transaction } from '@/types/transaction';

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowForm(false);
  };

  const updateTransaction = (id: string, updated: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...updated, id } : t)
    );
    setEditingTransaction(null);
    setShowForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  // Calculate summary statistics
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Personal Finance
            </h1>
            <p className="text-gray-600">Track your expenses and manage your budget</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                ${totalIncome.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                ${totalExpenses.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${netAmount >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'} hover:shadow-lg transition-shadow duration-200`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                Net Amount
              </CardTitle>
              <Calendar className={`h-4 w-4 ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                ${netAmount.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Monthly Expenses</CardTitle>
              <CardDescription>Track your spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyExpensesChart transactions={transactions} />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Add your first transaction to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Transactions List */}
        {transactions.length > 0 && (
          <Card className="mt-8 bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">All Transactions</CardTitle>
              <CardDescription>Complete transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList 
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={deleteTransaction}
              />
            </CardContent>
          </Card>
        )}

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <TransactionForm
                onSubmit={editingTransaction ? 
                  (data) => updateTransaction(editingTransaction.id, data) : 
                  addTransaction
                }
                onCancel={handleCloseForm}
                initialData={editingTransaction}
                isEditing={!!editingTransaction}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
