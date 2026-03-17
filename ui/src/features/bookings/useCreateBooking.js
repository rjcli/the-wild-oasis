import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createBooking as createBookingApi } from '../../services/apiBookings';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  const { mutate: createBooking, isPending: isCreating } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success('Booking created successfully!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createBooking, isCreating };
};
