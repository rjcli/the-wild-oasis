import Spinner from '../../ui/Spinner';
import { useCabins } from './useCabins';
import { useCabinsStatus } from './useCabinsStatus';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import CabinRow from './CabinRow';
import { useSearchParams } from 'react-router-dom';
import { useCurrentUser } from '../authentication/useCurrentUser';

const CabinTable = () => {
  const { isLoading, cabins } = useCabins();
  const { user } = useCurrentUser();
  const isAdmin = user?.role === 'admin';
  const [searchParams] = useSearchParams();

  const checkIn = searchParams.get('checkIn') || undefined;
  const checkOut = searchParams.get('checkOut') || undefined;

  const { bookedCabinIds } = useCabinsStatus({
    startDate: checkIn,
    endDate: checkOut,
  });

  if (isLoading) return <Spinner />;

  const filterValue = searchParams.get('discount') || 'all';

  // 1) FILTER
  let filteredCabins;
  if (filterValue === 'all') {
    filteredCabins = cabins;
  } else if (filterValue === 'no-discount') {
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  } else if (filterValue === 'with-discount') {
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);
  }

  // 2) SORT
  const sortBy = searchParams.get('sort-by') || 'startDate-asc';
  const [field, direction] = sortBy.split('-');
  const modifier = direction === 'asc' ? 1 : -1;
  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier,
  );

  return (
    <Menus>
      <Table
        columns={
          isAdmin
            ? '0.6fr 1.8fr 2.2fr 1fr 1fr 1fr'
            : '0.6fr 1.8fr 2.2fr 1fr 1fr'
        }
      >
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          {isAdmin && <div></div>}
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => (
            <CabinRow
              cabin={cabin}
              canManage={isAdmin}
              isBooked={bookedCabinIds.includes(cabin.id)}
              key={cabin.id}
            />
          )}
        />
      </Table>
    </Menus>
  );
};

export default CabinTable;
