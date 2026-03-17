import { apiRequest } from './apiClient';

export const getSettings = async () => {
  const response = await apiRequest('/settings');
  return response?.data?.settings;
};

// We expect a newSetting object that looks like {setting: newValue}
export const updateSetting = async (newSetting) => {
  const response = await apiRequest('/settings', {
    method: 'PATCH',
    body: newSetting,
  });

  return response?.data?.settings;
};
