import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { logout as logoutApi } from '../../services/apiAuth';

export const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading: isLoggingOut } = useMutation({
    mutationFn: async () => logoutApi(),
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      toast.success('Logged out successfully');
    },
  });

  return { logout, isLoggingOut };
};
