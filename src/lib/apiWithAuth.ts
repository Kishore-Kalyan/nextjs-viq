import { getCachedToken } from './tokenCache';

const callProtectedApi = async (url: string, options: RequestInit = {}) => {
  const token = await getCachedToken();
  if (!token) throw new Error('No token available');

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'API call failed');

  return data;
};

export { callProtectedApi };
