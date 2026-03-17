import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCabins } from '../cabins/useCabins';
import Heading from '../../ui/Heading';
import Spinner from '../../ui/Spinner';
import { formatCurrency } from '../../utils/helpers';

const CollageWrapper = styled.div`
  grid-column: 1 / -1;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
`;

const CollageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CabinCount = styled.span`
  font-size: 1.4rem;
  color: var(--color-grey-500);
  font-weight: 500;
`;

/* CSS grid masonry-style layout — hero cabin spans 2 rows */
const CollageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 20rem 20rem 14rem;
  gap: 0.8rem;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
`;

const CabinCard = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;

  /* Hero: first cabin spans both rows in first column */
  &:first-child {
    grid-row: 1 / span 2;
  }

  &:hover img {
    transform: scale(1.06);
  }

  &:hover > div {
    opacity: 1;
  }
`;

const CabinImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
  display: block;
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
`;

const CabinOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.2) 45%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.8rem 1.6rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const CabinLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.8rem;
`;

const CabinName = styled.p`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

const CabinMeta = styled.p`
  color: rgba(255, 255, 255, 0.88);
  font-size: 1.2rem;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.35);
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
`;

const EmptySlot = styled.div`
  background-color: var(--color-grey-100);
  border-radius: 0;
`;

const CabinCollage = () => {
  const { cabins, isLoading } = useCabins();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  /* Show up to 8 cabins in the grid (3 cols × 3 rows, hero uses 1 extra row) */
  const displayCabins = cabins?.slice(0, 8) ?? [];
  const emptySlots = Math.max(0, 8 - displayCabins.length);

  return (
    <CollageWrapper>
      <CollageHeader>
        <Heading as='h2'>Our Cabins</Heading>
        <CabinCount>{cabins?.length ?? 0} cabins available</CabinCount>
      </CollageHeader>

      <CollageGrid>
        {displayCabins.map((cabin) => {
          const price =
            cabin.discount > 0
              ? cabin.regularPrice - cabin.discount
              : cabin.regularPrice;

          return (
            <CabinCard key={cabin.id} onClick={() => navigate(`/cabins/${cabin.id}`)}>
              <CabinImage src={cabin.image} alt={cabin.name} />
              <CabinOverlay>
                <CabinLabel>
                  <CabinName>{cabin.name}</CabinName>
                  <CabinMeta>
                    {cabin.cabinNumber && `#${cabin.cabinNumber} · `}
                    {formatCurrency(price)} / night · {cabin.maxCapacity} guests
                  </CabinMeta>
                </CabinLabel>
              </CabinOverlay>
            </CabinCard>
          );
        })}

        {Array.from({ length: emptySlots }, (_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
      </CollageGrid>
    </CollageWrapper>
  );
};

export default CabinCollage;
