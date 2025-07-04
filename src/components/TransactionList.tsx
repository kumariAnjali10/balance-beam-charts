
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No transactions yet</p>
        <p className="text-sm">Start by adding your first transaction</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4 flex-1">
            <div className={`p-2 rounded-full ${transaction.amount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {transaction.amount >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {transaction.description}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`text-lg font-semibold ${
                transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
            </span>
            
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction.id)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
