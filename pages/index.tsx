import { useEffect, useState } from 'react';
import { callProtectedApi } from '../src/lib/apiWithAuth';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callProtectedApi('https://func-lix-30999302globallib.azurewebsites.net/api/global_video_list');
        setData(response);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <h1>Protected API Data</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </main>
  );
}
