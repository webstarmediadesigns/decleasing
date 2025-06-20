import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod, PaymentStatus } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';
import AddTransactionModal from './AddTransactionModal';
import { useSettlements } from '../../hooks/useSettlements';

interface SettlementSectionProps {
  dealId: string;
}

const SettlementSection: React.FC<SettlementSectionProps> = ({ dealId }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { settlements, loading, addTransaction, deleteTransaction } = useSettlements(dealId);

  if (loading) {
    return <div>Loading settlements...</div>;
  }

  if (!settlements) {
    return <div>No settlement data available</div>;
  }

  const { totalIncoming, totalOutgoing, profit, transactions } = settlements;

  const handleAddTransaction = async (data: any) => {
    await addTransaction(data);
    setIsAddModalOpen(false);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowDownRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Total Incoming</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${totalIncoming.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Total Outgoing</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${totalOutgoing.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className={`text-lg font-semibold ${
                  profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(profit).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Related Party
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No transactions recorded yet
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.direction === 'in' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.relatedParty.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{transaction.relatedParty.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={transaction.direction === 'in' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.direction === 'in' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === PaymentStatus.Completed
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === PaymentStatus.Pending
                            ? 'bg-yellow-100 text-yellow-800'
                            : transaction.status === PaymentStatus.Failed
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default SettlementSection;