import { apiRequest, buildPublicFileUrl } from './apiClient';

const normalizeCabin = (cabin) => ({
  ...cabin,
  image: buildPublicFileUrl(cabin.image),
});

export const getCabins = async () => {
  const response = await apiRequest('/cabins', { auth: false });
  return (response?.data?.cabins || []).map(normalizeCabin);
};

export const getCabin = async (id) => {
  const response = await apiRequest(`/cabins/${id}`, { auth: false });
  return normalizeCabin(response?.data?.cabin);
};

export const getCabinsStatus = async ({ startDate, endDate } = {}) => {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const qs = params.toString();
  const response = await apiRequest(`/cabins/status${qs ? `?${qs}` : ''}`, { auth: false });
  return response?.data?.bookedCabinIds || [];
};

export const createEditCabin = async (newCabin, id) => {
  const formData = new FormData();

  formData.append('name', newCabin.name);
  formData.append('maxCapacity', String(newCabin.maxCapacity));
  formData.append('regularPrice', String(newCabin.regularPrice));
  formData.append('discount', String(newCabin.discount ?? 0));
  formData.append('description', newCabin.description || '');

  if (newCabin.image instanceof File) {
    formData.append('image', newCabin.image);
  }

  const method = id ? 'PATCH' : 'POST';
  const endpoint = id ? `/cabins/${id}` : '/cabins';
  const response = await apiRequest(endpoint, {
    method,
    body: formData,
    isFormData: true,
  });

  return normalizeCabin(response?.data?.cabin);
};

export const deleteCabin = async (id) => {
  await apiRequest(`/cabins/${id}`, { method: 'DELETE' });
  return null;
};
