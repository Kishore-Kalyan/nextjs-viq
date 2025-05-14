let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

const getCachedToken = async (): Promise<string | null> => {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const res = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Token error:', data.error);
      return null;
    }

    const expiresIn = 60 * 60 * 1000; // 1 hour
    cachedToken = data.token;
    tokenExpiry = now + expiresIn;

    return cachedToken;
  } catch (err) {
    console.error('Token fetch failed:', err);
    return null;
  }
};

export { getCachedToken };
