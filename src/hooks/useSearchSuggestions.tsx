import { useQuery } from '@tanstack/react-query';
import { fetchSearchSuggestions, SearchType } from '@/src/services/search';

export function useSearchSuggestions(
  q: string,
  limit = 5,
  type?: SearchType
) {
  return useQuery({
    queryKey: ['search-suggestions', q, limit, type],
    queryFn: () => fetchSearchSuggestions({ q, limit, type }),
    enabled: q.trim().length >= 2,
    staleTime: 10_000,
    retry: 1,
  });
}