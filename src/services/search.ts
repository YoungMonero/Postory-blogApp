import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Updated to match backend types (removed 'blog', added 'category')
export type SearchType = 'user' | 'post' | 'tag' | 'category';

interface SearchParams {
  q: string;
  limit?: number;
  type?: SearchType;
}

interface SearchResponse {
  suggestions: Array<{
    type: SearchType;
    text: string;
    score: number;
    data: Record<string, unknown>;
  }>;
}

export async function fetchSearchSuggestions({
  q,
  limit = 5,
  type,
}: SearchParams): Promise<SearchResponse> {
  const params = new URLSearchParams({ q });
  
  if (limit) params.append('limit', String(limit));
  if (type) params.append('type', type);

  try {
    const res = await fetch(
      `${NEXT_PUBLIC_API_URL}/search/suggestions?${params.toString()}`
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Search failed: ${res.status} ${res.statusText} - ${errorText}`);
    }
    // if (!res.ok) {
    // console.error(`Search failed: ${res.status} ${res.statusText}`);
    // }

    return await res.json();
  } catch (error) {
    console.error('Search fetch error:', error);
    return { suggestions: [] };
  }
}