import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createUserAsAdmin } from '../../services/apiAuth';

export const useCreateUser = () => {
  const { mutate: createUser, isLoading: isCreating } = useMutation({
    mutationFn: createUserAsAdmin,
    onSuccess: (user) => {
      toast.success(`Account created for ${user?.fullName || 'user'}`);
    },
    onError: (err) => toast.error(err.message),
  });

  return { createUser, isCreating };
};
