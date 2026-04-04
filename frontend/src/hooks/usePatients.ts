import { useState, useEffect, useCallback } from 'react';
import { fetchPatients } from '../services/api';
import { Patient } from '../types';

export const usePatients = (refreshInterval = 4000) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    try {
      const data = await fetchPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError('Failed to load patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
    const interval = setInterval(loadPatients, refreshInterval);
    return () => clearInterval(interval);
  }, [loadPatients, refreshInterval]);

  return { patients, loading, error, refetch: loadPatients };
};