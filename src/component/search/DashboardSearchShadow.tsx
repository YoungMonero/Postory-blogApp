import { useState, useEffect } from 'react';
import { fetchSearchSuggestions } from '@/src/services/search';

export function DashboardSearchController() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsActive(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);

        const response = await fetchSearchSuggestions({ q: query });

        /**
         * ✅ NORMALIZATION LAYER
         * Backend may return:
         * - { success, data: [] }
         * - { success, data: { users, posts, tags } }
         */
        let normalizedResults: any[] = [];

        if (Array.isArray(response.data)) {
          normalizedResults = response.data;
        } else if (response.data && typeof response.data === 'object') {
          normalizedResults = Object.values(response.data).flat();
        }

        setResults(normalizedResults);
        setIsActive(true);
      } catch (err) {
        console.error('Search failed', err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isActive,
  };
}
