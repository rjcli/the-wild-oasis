import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/apiAuth';

export const useUsers = () => {
  const {
    isLoading,
    data: users,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  return { isLoading, users: users || [], error };
};
