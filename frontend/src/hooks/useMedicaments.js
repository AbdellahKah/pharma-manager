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
    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, count: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMedicaments(filters);
            const results = data.results || data;
            setMedicaments(Array.isArray(results) ? results : []);
            if (data.results) {
                setPagination({
                    totalPages: data.total_pages,
                    currentPage: data.current_page,
                    count: data.count
                });
            }
        } catch (err) {
            console.error('API Error:', err);
            setError('Erreur de chargement.');
        } finally {
            setLoading(false);
        }
    }, [filters.search, filters.categorie, filters.ordonnance_requise, filters.page]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { medicaments, pagination, loading, error, refresh: loadData };
};
