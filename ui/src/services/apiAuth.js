import {
  apiRequest,
  buildPublicFileUrl,
  clearAuthTokens,
  saveAuthTokens,
} from './apiClient';

const normalizeUser = (user) => ({
  ...user,
  avatar: buildPublicFileUrl(user?.avatar),
});

export const login = async ({ email, password }) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  });

  const payload = response?.data;
  saveAuthTokens(payload || {});

  return normalizeUser(payload?.user);
};

export const signup = async ({ fullName, email, password }) => {
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    auth: false,
    body: { fullName, email, password },
  });

  const payload = response?.data;
  clearAuthTokens();
  return normalizeUser(payload?.user);
};

export const createUserAsAdmin = async ({ fullName, email, password }) => {
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    auth: false,
    body: { fullName, email, password },
  });
  return normalizeUser(response?.data?.user);
};

export const getCurrentUser = async () => {
  const response = await apiRequest('/auth/me');
  return normalizeUser(response?.data?.user);
};

export const updateCurrentUser = async ({ fullName, avatar }) => {
  const formData = new FormData();

  if (fullName) formData.append('fullName', fullName);
  if (avatar instanceof File) formData.append('avatar', avatar);

  const response = await apiRequest('/auth/update-me', {
    method: 'PATCH',
    body: formData,
    isFormData: true,
  });

  return normalizeUser(response?.data?.user);
};

export const updateCurrentPassword = async ({
  currentPassword,
  newPassword,
}) => {
  const response = await apiRequest('/auth/update-password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
  });

  saveAuthTokens(response?.data || {});
  return response?.message || 'Password updated successfully.';
};

export const getUsers = async () => {
  const response = await apiRequest('/auth/users');
  return (response?.data?.users || []).map(normalizeUser);
};

export const adminUpdateUser = async ({ id, fullName, role }) => {
  const response = await apiRequest(`/auth/users/${id}`, {
    method: 'PATCH',
    body: { fullName, role },
  });
  return normalizeUser(response?.data?.user);
};

export const adminDeleteUser = async (id) => {
  await apiRequest(`/auth/users/${id}`, { method: 'DELETE' });
  return null;
};

export const logout = () => {
  clearAuthTokens();
};
