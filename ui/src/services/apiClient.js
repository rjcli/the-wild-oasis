const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_URL || `${API_ORIGIN}/api/v1`;

const ACCESS_TOKEN_KEY = 'wild_oasis_access_token';
const REFRESH_TOKEN_KEY = 'wild_oasis_refresh_token';

const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const hasStoredTokens = () => Boolean(getAccessToken() || getRefreshToken());

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const saveAuthTokens = setTokens;
export const clearAuthTokens = clearTokens;

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  return response.json();
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await parseResponse(response);
  if (!response.ok || !payload?.data?.accessToken) {
    clearTokens();
    return null;
  }

  setTokens(payload.data);
  return payload.data.accessToken;
};

const getValidAccessToken = async () => {
  const current = getAccessToken();
  if (current) return current;

  const refreshed = await refreshAccessToken();
  if (refreshed) return refreshed;

  return null;
};

export const apiRequest = async (
  path,
  {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    isFormData = false,
    retryOn401 = true,
  } = {},
) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const requestHeaders = { ...headers };
  if (!isFormData) requestHeaders['Content-Type'] = 'application/json';

  if (auth) {
    const token = await getValidAccessToken();
    if (!token) throw new Error('Authentication required');
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let requestBody;
  if (body) {
    requestBody = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status === 401 && auth && retryOn401) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      return apiRequest(path, {
        method,
        body,
        headers,
        auth,
        isFormData,
        retryOn401: false,
      });
    }
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
};

export const buildPublicFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  return `${API_ORIGIN}/public/${filePath}`;
};

export { API_BASE_URL, API_ORIGIN };
export const hasStoredAuthTokens = hasStoredTokens;