import { useQuery } from '@tanstack/react-query';
import { getCabinsStatus } from '../../services/apiCabins';

export const useCabinsStatus = ({ startDate, endDate } = {}) => {
  const {
    isLoading,
    data: bookedCabinIds,
    error,
  } = useQuery({
    queryKey: ['cabins-status', startDate, endDate],
    queryFn: () => getCabinsStatus({ startDate, endDate }),
    staleTime: 60 * 1000,
  });
  return { isLoading, bookedCabinIds: bookedCabinIds || [], error };
};
