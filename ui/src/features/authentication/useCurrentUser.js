import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/apiAuth';
import { hasStoredAuthTokens } from '../../services/apiClient';

export const useCurrentUser = () => {
  const hasStoredSession = hasStoredAuthTokens();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: hasStoredSession,
    retry: false,
  });

  return {
    user: user || null,
    isLoading: hasStoredSession && isLoading,
    error,
    isAuthenticated: Boolean(user),
  };
};
