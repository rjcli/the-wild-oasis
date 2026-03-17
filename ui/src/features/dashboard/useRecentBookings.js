import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { subDays } from 'date-fns';
import { getBookingsAfterDate } from '../../services/apiBookings';

export const useRecentBookings = () => {
  const [searchParams] = useSearchParams();
  const numDays = Number(searchParams.get('last')) || 7;

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: bookings } = useQuery({
    queryKey: ['bookings', `last-${numDays}`],
    queryFn: () => getBookingsAfterDate(queryDate),
  });

  return { isLoading, bookings, numDays };
};
