import styled from 'styled-components';
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
} from 'react-icons/hi2';
import Spinner from '../../ui/Spinner';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSettings';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 70rem) {
    grid-template-columns: 1fr;
  }
`;

const SettingCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: var(--shadow-sm);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.4rem;
`;

const IconBadge = styled.div`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: var(--border-radius-md);
  background-color: var(--color-${(p) => p.$color}-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-${(p) => p.$color}-700);
  }
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-grey-700);
  margin-bottom: 0.3rem;
`;

const CardDesc = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-400);
  line-height: 1.5;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Unit = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-grey-400);
  white-space: nowrap;
`;

const SettingInput = styled.input`
  width: 100%;
  padding: 1rem 1.4rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-grey-700);
  background-color: var(--color-grey-0);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
`;

const SavingDot = styled.span`
  font-size: 1.1rem;
  color: var(--color-brand-600);
  font-style: italic;
`;

const SETTINGS = [
  {
    field: 'minBookingLength',
    title: 'Minimum stay',
    desc: 'Shortest number of nights a guest can book in a single reservation.',
    icon: <HiOutlineClock />,
    color: 'blue',
    unit: 'nights',
    min: 1,
    max: 30,
  },
  {
    field: 'maxBookingLength',
    title: 'Maximum stay',
    desc: 'Longest number of nights allowed per reservation to manage availability.',
    icon: <HiOutlineCalendarDays />,
    color: 'green',
    unit: 'nights',
    min: 1,
    max: 90,
  },
  {
    field: 'maxGuestsPerBooking',
    title: 'Guests per booking',
    desc: 'Maximum number of adult guests that can be included in one reservation.',
    icon: <HiOutlineUsers />,
    color: 'indigo',
    unit: 'guests',
    min: 1,
    max: 20,
  },
  {
    field: 'breakfastPrice',
    title: 'Breakfast price',
    desc: 'Per-person, per-night cost added when guests opt in to breakfast service.',
    icon: <HiOutlineCurrencyDollar />,
    color: 'yellow',
    unit: '$ / person / night',
    min: 0,
    max: 200,
  },
];

const UpdateSettingsForm = () => {
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  const currentValues = {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  };

  const handleUpdate = (e, field) => {
    const { value } = e.target;
    if (!value) return;
    updateSetting({ [field]: Number(value) });
  };

  if (isLoading) return <Spinner />;

  return (
    <Grid>
      {SETTINGS.map(({ field, title, desc, icon, color, unit, min, max }) => (
        <SettingCard key={field}>
          <CardTop>
            <IconBadge $color={color}>{icon}</IconBadge>
            <CardInfo>
              <CardTitle>{title}</CardTitle>
              <CardDesc>{desc}</CardDesc>
            </CardInfo>
          </CardTop>

          <InputRow>
            <SettingInput
              type='number'
              id={field}
              defaultValue={currentValues[field]}
              min={min}
              max={max}
              disabled={isUpdating}
              onBlur={(e) => handleUpdate(e, field)}
            />
            <Unit>{unit}</Unit>
          </InputRow>

          {isUpdating && <SavingDot>Saving&hellip;</SavingDot>}
        </SettingCard>
      ))}
    </Grid>
  );
};

export default UpdateSettingsForm;

