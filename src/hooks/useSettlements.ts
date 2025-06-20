import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction, SettlementSummary } from '../types';

export const useSettlements = (dealId: string) => {
  const [settlements, setSettlements] = useState<SettlementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettlements();
    const unsubscribe = subscribeToTransactions();
    return () => {
      unsubscribe();
    };
  }, [dealId]);

  const fetchSettlements = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('deal_id', dealId)
        .order('date', { ascending: false });

      if (error) throw error;

      const transactions = data as Transaction[];
      const totalIncoming = transactions
        .filter(t => t.direction === 'in')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalOutgoing = transactions
        .filter(t => t.direction === 'out')
        .reduce((sum, t) => sum + t.amount, 0);

      setSettlements({
        totalIncoming,
        totalOutgoing,
        profit: totalIncoming - totalOutgoing,
        transactions,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          deal_id: dealId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const subscribeToTransactions = () => {
    const subscription = supabase
      .channel(`deal-transactions-${dealId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `deal_id=eq.${dealId}`
      }, () => {
        fetchSettlements();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    settlements,
    loading,
    error,
    addTransaction,
    deleteTransaction
  };
};