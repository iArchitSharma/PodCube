'use client';

import PodcastPlayer from '@/components/PodcastPlayer';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;
    if (!id) {
      console.warn('No ID provided');
      router.push('/podcast');
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    async function fetchPodcastScript() {
      try {
        const res = await fetch(`/api/podcast/${id}`);
        const data = await res.json();

        if (data.success) {
          setScript(data.podcastScript);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError('Failed to load podcast script.');
      } finally {
        setLoading(false);
      }
    }

    fetchPodcastScript();
  }, [id]);

  if (loading) return <p>Loading podcast...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!script) return <p>No podcast script found.</p>;

  return (
    <div>
      <PodcastPlayer podcastScript={script} />
    </div>
  );
}
