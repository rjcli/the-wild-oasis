import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Tag from '../../ui/Tag';
import { Flag } from '../../ui/Flag';
import Button from '../../ui/Button';

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

const TodayItem = ({ activity }) => {
  const { id, status, numNights, guests } = activity;
  const guestName = guests?.fullName ?? guests?.full_name ?? 'Guest';
  const countryFlag = guests?.countryFlag ?? guests?.country_flag ?? '';
  const nationality = guests?.nationality ?? '';

  return (
    <StyledTodayItem>
      {status === 'unconfirmed' && <Tag type='green'>Arriving</Tag>}
      {status === 'checked-in' && <Tag type='blue'>Departing</Tag>}

      <Flag src={countryFlag} alt={`Flag of ${nationality}`} />

      <Guest>{guestName}</Guest>

      <div>{numNights} nights</div>

      {status === 'unconfirmed' && (
        <Button
          size='small'
          variation='primary'
          as={Link}
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {status === 'checked-in' && (
        <Button
          size='small'
          variation='primary'
          as={Link}
          to={`/checkin/${id}`}
        >
          Check out
        </Button>
      )}
    </StyledTodayItem>
  );
};

export default TodayItem;
