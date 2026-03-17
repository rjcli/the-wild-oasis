import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { login as loginApi } from '../../services/apiAuth';

export const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate: login, isLoading: isLoggingIn } = useMutation({
    mutationFn: loginApi,
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(`Welcome back, ${user?.fullName || 'user'}!`);
    },
    onError: (err) => toast.error(err.message),
  });

  return { login, isLoggingIn };
};
