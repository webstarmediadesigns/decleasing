import { useState, useEffect } from 'react';
import { supabase, uploadFile } from '../lib/supabase';
import { Customer, Document } from '../types';

export const useCustomer = (customerId?: string) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          trade_in_vehicles (*),
          documents (*)
        `)
        .eq('id', customerId)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (updatedData: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updatedData)
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      setCustomer(prev => prev ? { ...prev, ...data } : data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const uploadDocument = async (
    file: File,
    type: 'driversLicense' | 'insurance' | 'creditApplication'
  ) => {
    try {
      const path = `customers/${customerId}/${type}/${file.name}`;
      const url = await uploadFile(file, 'documents', path);

      if (!url) throw new Error('Failed to upload file');

      const { data, error } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          type: file.type,
          url,
          entity_type: 'customer',
          entity_id: customerId
        })
        .select()
        .single();

      if (error) throw error;

      setCustomer(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          documents: {
            ...prev.documents,
            [type]: data
          }
        };
      });

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const subscribeToCustomer = () => {
    const subscription = supabase
      .channel(`customer-${customerId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'customers',
        filter: `id=eq.${customerId}`
      }, (payload) => {
        setCustomer(prev => prev ? { ...prev, ...payload.new } : payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    customer,
    loading,
    error,
    updateCustomer,
    uploadDocument,
    subscribeToCustomer
  };
};