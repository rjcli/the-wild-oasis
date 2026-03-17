import { useQuery } from '@tanstack/react-query';
import { getCabin } from '../../services/apiCabins';

export const useCabin = (id) => {
  const {
    isLoading,
    data: cabin,
    error,
  } = useQuery({
    queryKey: ['cabin', id],
    queryFn: () => getCabin(id),
    enabled: !!id,
  });
  return { isLoading, cabin, error };
};
