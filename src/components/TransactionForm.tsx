
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, DollarSign, Calendar, FileText } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Transaction | null;
  isEditing?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setDate(initialData.date);
      setDescription(initialData.description);
    } else {
      // Set today's date as default
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount))) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      amount: Number(amount),
      date,
      description: description.trim(),
    });

    // Reset form if not editing
    if (!isEditing) {
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setErrors({});
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (use negative for expenses)"
              className={`text-lg ${errors.amount ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
            <p className="text-xs text-gray-500">
              Use positive numbers for income, negative for expenses
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${errors.date ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
              className={`min-h-[80px] resize-none ${errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              {isEditing ? 'Update Transaction' : 'Add Transaction'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
