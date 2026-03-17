import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateCurrentUser as updateCurrentUserApi } from '../../services/apiAuth';

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  const { mutate: updateCurrentUser, isLoading: isUpdatingUser } = useMutation({
    mutationFn: updateCurrentUserApi,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateCurrentUser, isUpdatingUser };
};
