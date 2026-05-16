import { useState, useEffect, useCallback } from 'react';
import { fetchVentes } from '../api/ventesApi';

/**
 * Hook pour gérer l'historique des ventes.
 */
export const useVentes = (filters = {}) => {
    const [ventes, setVentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchVentes(filters);
            setVentes(data.results || data);
        } catch (err) {
            console.error('Fetch Ventes Error:', err);
            setError(
                err.response?.data?.message || 
                'Erreur lors de la récupération de l\'historique des ventes.'
            );
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { ventes, loading, error, refresh: loadData };
};
