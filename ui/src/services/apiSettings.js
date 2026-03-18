import { apiRequest } from './apiClient';

export const getSettings = async () => {
  const response = await apiRequest('/settings');
  return response?.data?.settings;
};

export const updateSetting = async (newSetting) => {
  const response = await apiRequest('/settings', {
    method: 'PATCH',
    body: newSetting,
  });

  return response?.data?.settings;
};
