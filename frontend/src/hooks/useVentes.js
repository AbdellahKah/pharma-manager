import { useState, useEffect, useCallback } from 'react';
import { fetchVentes } from '../api/ventesApi';

/**
 * Hook pour gérer l'historique des ventes.
 */
export const useVentes = (filters = {}) => {
    const [ventes, setVentes] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, count: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchVentes(filters);
            const results = data.results || data;
            setVentes(Array.isArray(results) ? results : []);
            if (data.results) {
                setPagination({
                    totalPages: data.total_pages,
                    currentPage: data.current_page,
                    count: data.count
                });
            }
        } catch (err) {
            console.error('Fetch Ventes Error:', err);
            setError('Erreur de chargement.');
        } finally {
            setLoading(false);
        }
    }, [filters.date_vente__gte, filters.date_vente__lte, filters.statut, filters.page]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { ventes, pagination, loading, error, refresh: loadData };
};
