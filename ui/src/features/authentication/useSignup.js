import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { signup as signupApi } from '../../services/apiAuth';

export const useSignup = () => {
  const queryClient = useQueryClient();

  const { mutate: signup, isLoading: isSigningUp } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      queryClient.removeQueries({ queryKey: ['currentUser'], exact: true });
      toast.success(`Account created for ${user?.fullName || 'user'}`);
    },
    onError: (err) => toast.error(err.message),
  });

  return { signup, isSigningUp };
};
