import api from './axiosConfig';

export const fetchVentes = async (params = {}) => {
    const response = await api.get('/ventes/', { params });
    return response.data;
};

export const createVente = async (data) => {
    const response = await api.post('/ventes/', data);
    return response.data;
};

export const annulerVente = async (id) => {
    const response = await api.post(`/ventes/${id}/annuler/`);
    return response.data;
};
