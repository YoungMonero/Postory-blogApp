// DashboardSearchController.tsx - SIMPLIFIED VERSION
import { useState, useEffect } from 'react';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions'; // Import this

export function useDashboardSearch() {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Use the React Query hook
  const { 
    data: searchData, 
    isLoading, 
    error 
  } = useSearchSuggestions(query, 5);

  // Extract results from searchData
  const results = searchData?.suggestions || [];

  useEffect(() => {
    if (query.length >= 2) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setIsActive(false);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    isActive,
    error: error ? (error as Error).message : null,
    clearSearch,
  };
}