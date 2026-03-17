import { useQuery } from '@tanstack/react-query';
import { getGuests } from '../../services/apiGuests';

export const useGuests = () => {
  const {
    isLoading,
    data: guests,
    error,
  } = useQuery({
    queryKey: ['guests'],
    queryFn: getGuests,
  });
  return { isLoading, guests: guests || [], error };
};
