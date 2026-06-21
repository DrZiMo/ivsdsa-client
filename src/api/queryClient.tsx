import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * React Query client configuration
 * Centralized configuration for all data fetching behavior
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Wrapper component that provides React Query to the app
 */
function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { QueryProvider };
