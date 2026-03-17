import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { adminUpdateUser, adminDeleteUser } from '../../services/apiAuth';

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: adminUpdateUser,
    onSuccess: (user) => {
      toast.success(`${user?.fullName} updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { updateUser, isUpdating };
};

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: adminDeleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { deleteUser, isDeleting };
};
