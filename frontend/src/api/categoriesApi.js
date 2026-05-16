import api from './axiosConfig';

export const fetchCategories = async () => {
    const response = await api.get('/categories/');
    return response.data;
};
