import api from './axiosConfig';

/**
 * Récupère la liste des médicaments (avec filtres et pagination).
 */
export const fetchMedicaments = async (params = {}) => {
    const response = await api.get('/medicaments/', { params });
    return response.data;
};

/**
 * Récupère les médicaments en alerte de stock.
 */
export const fetchStockAlerts = async () => {
    const response = await api.get('/medicaments/alertes/');
    return response.data;
};

/**
 * Enregistre un nouveau médicament.
 */
export const createMedicament = async (data) => {
    const response = await api.post('/medicaments/', data);
    return response.data;
};

/**
 * Met à jour un médicament existant (PATCH).
 */
export const updateMedicament = async (id, data) => {
    const response = await api.patch(`/medicaments/${id}/`, data);
    return response.data;
};

/**
 * Supprime (soft delete) un médicament.
 */
export const deleteMedicament = async (id) => {
    await api.delete(`/medicaments/${id}/`);
};
