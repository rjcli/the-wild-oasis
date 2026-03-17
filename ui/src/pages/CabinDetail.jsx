import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  HiOutlineArrowLeft,
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineTag,
  HiOutlineHashtag,
  HiOutlineCalendarDays,
} from 'react-icons/hi2';
import { useCabin } from '../features/cabins/useCabin';
import { useCabinsStatus } from '../features/cabins/useCabinsStatus';
import { formatCurrency } from '../utils/helpers';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';

const Page = styled.div`
  max-width: 90rem;
  margin: 0 auto;
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-600);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 2.4rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-brand-600);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const Card = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const HeroWrapper = styled.div`
  position: relative;
  height: 36rem;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 3.2rem;
`;

const HeroTitle = styled.div`
  h1 {
    font-size: 3.2rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.4rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  p {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const BookedBanner = styled.div`
  background-color: var(--color-red-100);
  border-bottom: 1px solid var(--color-red-300);
  padding: 1.2rem 3.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-red-700);
`;

const Body = styled.div`
  padding: 3.2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.2rem;

  @media (max-width: 60rem) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-grey-500);
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
`;

const StatCard = styled.div`
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
`;

const StatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 0.6rem;

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-grey-800);
  font-family: 'Sono';
`;

const SubValue = styled.div`
  font-size: 1.3rem;
  color: var(--color-green-700);
  font-weight: 600;
  margin-top: 0.2rem;
`;

const Description = styled.p`
  font-size: 1.5rem;
  line-height: 1.7;
  color: var(--color-grey-600);
`;

const Actions = styled.div`
  padding: 2.4rem 3.2rem;
  border-top: 1px solid var(--color-grey-100);
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
`;

const CabinDetail = () => {
  const { cabinId } = useParams();
  const navigate = useNavigate();
  const { isLoading, cabin } = useCabin(Number(cabinId));
  const { bookedCabinIds } = useCabinsStatus();

  if (isLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
        <Spinner />
      </div>
    );

  if (!cabin)
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-grey-500)', fontSize: '1.6rem' }}>
        Cabin not found.
      </div>
    );

  const isBooked = bookedCabinIds.includes(cabin.id);
  const discountedPrice =
    cabin.discount > 0 ? cabin.regularPrice - cabin.discount : null;

  return (
    <Page>
      <BackBtn onClick={() => navigate(-1)}>
        <HiOutlineArrowLeft />
        Back
      </BackBtn>

      <Card>
        <HeroWrapper>
          {cabin.image ? (
            <HeroImage src={cabin.image} alt={cabin.name} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--color-grey-200)',
              }}
            />
          )}
          <HeroOverlay>
            <HeroTitle>
              <h1>{cabin.name}</h1>
              {cabin.cabinNumber && <p>Cabin #{cabin.cabinNumber}</p>}
            </HeroTitle>
          </HeroOverlay>
        </HeroWrapper>

        {isBooked && (
          <BookedBanner>
            <HiOutlineCalendarDays style={{ width: '1.8rem', height: '1.8rem' }} />
            This cabin is currently occupied — it has an active booking today.
          </BookedBanner>
        )}

        <Body>
          <Section>
            <SectionTitle>Cabin details</SectionTitle>
            <StatGrid>
              <StatCard>
                <StatLabel>
                  <HiOutlineUsers />
                  Capacity
                </StatLabel>
                <StatValue>
                  {cabin.maxCapacity}
                  <span style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-grey-500)' }}>
                    {' '}guests
                  </span>
                </StatValue>
              </StatCard>

              <StatCard>
                <StatLabel>
                  <HiOutlineBanknotes />
                  Regular price
                </StatLabel>
                <StatValue>{formatCurrency(cabin.regularPrice)}</StatValue>
                <SubValue>per night</SubValue>
              </StatCard>

              {cabin.discount > 0 && (
                <StatCard>
                  <StatLabel>
                    <HiOutlineTag />
                    Discount
                  </StatLabel>
                  <StatValue>{formatCurrency(cabin.discount)}</StatValue>
                  <SubValue>
                    Final: {formatCurrency(discountedPrice)} / night
                  </SubValue>
                </StatCard>
              )}

              {cabin.cabinNumber && (
                <StatCard>
                  <StatLabel>
                    <HiOutlineHashtag />
                    Cabin number
                  </StatLabel>
                  <StatValue>{cabin.cabinNumber}</StatValue>
                </StatCard>
              )}
            </StatGrid>
          </Section>

          <Section>
            <SectionTitle>About this cabin</SectionTitle>
            {cabin.description ? (
              <Description>{cabin.description}</Description>
            ) : (
              <Description style={{ color: 'var(--color-grey-400)', fontStyle: 'italic' }}>
                No description provided.
              </Description>
            )}
          </Section>
        </Body>

        <Actions>
          <Button variation='secondary' onClick={() => navigate(-1)}>
            Back to cabins
          </Button>
          <Button
            variation='primary'
            onClick={() => navigate('/bookings')}
            disabled={isBooked}
          >
            {isBooked ? 'Currently occupied' : 'Book this cabin'}
          </Button>
        </Actions>
      </Card>
    </Page>
  );
};

export default CabinDetail;
