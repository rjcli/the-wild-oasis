import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateCurrentPassword } from '../../services/apiAuth';

export const useUpdatePassword = () => {
  const { mutate: updatePassword, isLoading: isUpdatingPassword } = useMutation({
    mutationFn: updateCurrentPassword,
    onSuccess: (message) => toast.success(message),
    onError: (err) => toast.error(err.message),
  });

  return { updatePassword, isUpdatingPassword };
};
