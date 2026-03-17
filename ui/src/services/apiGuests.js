import { apiRequest } from './apiClient';

export const getGuests = async () => {
  const response = await apiRequest('/guests');
  return response?.data?.guests || [];
};

export const createGuest = async (data) => {
  const response = await apiRequest('/guests', {
    method: 'POST',
    body: data,
  });
  return response?.data?.guest;
};
