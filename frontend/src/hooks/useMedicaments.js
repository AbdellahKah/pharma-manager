import { useState, useEffect, useCallback } from 'react';
import { fetchMedicaments } from '../api/medicamentsApi';

/**
 * Hook personnalisé pour gérer l'état des médicaments.
 * 
 * @param {Object} filters - Filtres de recherche et pagination.
 * @returns {Object} { medicaments, loading, error, refresh }
 */
export const useMedicaments = (filters = {}) => {
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMedicaments(filters);
            // DRF renvoie un objet paginé { results: [], ... } ou une liste simple
            setMedicaments(data.results || data);
        } catch (err) {
            console.error('API Error:', err);
            setError(
                err.response?.data?.message || 
                'Une erreur est survenue lors de la récupération des médicaments.'
            );
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { medicaments, loading, error, refresh: loadData };
};
