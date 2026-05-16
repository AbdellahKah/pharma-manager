import { useState, useEffect } from 'react';
import { fetchCategories } from '../api/categoriesApi';

/**
 * Hook pour récupérer la liste des catégories.
 */
export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return { categories, loading };
};
