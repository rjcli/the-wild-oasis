import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { differenceInCalendarDays, format, addDays } from 'date-fns';
import {
  HiOutlineHomeModern,
  HiOutlineUsers,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineUserPlus,
  HiOutlineTrash,
} from 'react-icons/hi2';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import { useCabins } from '../cabins/useCabins';
import { useSettings } from '../settings/useSettings';
import { useCreateBooking } from './useCreateBooking';
import { checkCabinAvailability } from '../../services/apiBookings';
import { createGuest } from '../../services/apiGuests';
import { formatCurrency } from '../../utils/helpers';

const today = () => format(new Date(), 'yyyy-MM-dd');
const tomorrow = () => format(addDays(new Date(), 1), 'yyyy-MM-dd');

/* ─── Styled components ────────────────────────────────────────────────────── */

const FormWrap = styled.div`
  width: 72rem;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 50rem) {
    width: 95vw;
  }
`;

const FormHeader = styled.div`
  padding: 2.4rem 2.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: linear-gradient(
    135deg,
    var(--color-brand-600) 0%,
    var(--color-brand-700) 100%
  );

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.3rem;
  }

  p {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const FormBody = styled.div`
  padding: 2.4rem 2.8rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-grey-500);
  display: flex;
  align-items: center;
  gap: 0.6rem;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.$cols || '1fr 1fr'};
  gap: 1.6rem;

  @media (max-width: 50rem) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1.5px solid
    ${(p) => (p.$error ? 'var(--color-red-700)' : 'var(--color-grey-200)')};
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    cursor: not-allowed;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1.5px solid
    ${(p) => (p.$error ? 'var(--color-red-700)' : 'var(--color-grey-200)')};
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    cursor: not-allowed;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  resize: vertical;
  min-height: 8rem;
  font-family: inherit;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  cursor: pointer;
  padding: 0.8rem 0;
`;

const ErrorMsg = styled.p`
  font-size: 1.2rem;
  color: var(--color-red-700);
  margin-top: 0.2rem;
`;

const PriceCard = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-brand-50) 0%,
    var(--color-brand-100) 100%
  );
  border: 1px solid var(--color-brand-200);
  border-radius: var(--border-radius-sm);
  padding: 1.6rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem 2rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;

  span:first-child {
    color: var(--color-brand-700);
    font-weight: 500;
  }

  span:last-child {
    font-family: 'Sono';
    font-weight: 600;
    color: var(--color-grey-800);
  }
`;

const TotalRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid var(--color-brand-200);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-brand-700);
`;

const AvailabilityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.2rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  background-color: ${(p) => {
    if (p.$checking) return 'var(--color-grey-100)';
    if (p.$available) return 'var(--color-green-100)';
    return 'var(--color-red-100)';
  }};
  color: ${(p) => {
    if (p.$checking) return 'var(--color-grey-600)';
    if (p.$available) return 'var(--color-green-700)';
    return 'var(--color-red-700)';
  }};

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-grey-100);
  margin: 0.4rem 0;
`;

const FormActions = styled.div`
  padding: 2rem 2.8rem;
  border-top: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
`;

/* Guest slots */
const GuestSlotList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GuestSlot = styled.div`
  display: grid;
  grid-template-columns: 1fr 8rem 12rem 3.2rem;
  gap: 1rem;
  align-items: end;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);

  @media (max-width: 50rem) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;

    & > *:nth-child(3) {
      grid-column: 1 / -1;
    }

    & > *:nth-child(4) {
      grid-column: 1 / -1;
      justify-self: end;
    }
  }
`;

const SlotLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-500);
  margin-bottom: 0.4rem;
  display: block;
`;

const RemoveBtn = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--color-red-700);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-red-100);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const AddGuestBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.4rem;
  border: 1.5px dashed var(--color-brand-400, var(--color-brand-500));
  border-radius: var(--border-radius-sm);
  background: transparent;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-brand-600);
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-50);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const CapacityHint = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  margin-top: 0.4rem;
`;

/* ─── Component ────────────────────────────────────────────────────────────── */

const emptyGuest = () => ({ name: '', age: '', gender: '' });

const CreateBookingForm = ({ onCloseModal }) => {
  const { cabins, isLoading: loadingCabins } = useCabins();
  const { settings } = useSettings();
  const { createBooking, isCreating } = useCreateBooking();

  const [availability, setAvailability] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState(null);
  // guests: array of { name, age }
  const [guests, setGuests] = useState([emptyGuest()]);
  const [guestErrors, setGuestErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      startDate: today(),
      endDate: tomorrow(),
      hasBreakfast: false,
      observations: '',
    },
  });

  const watchCabinId = watch('cabinId');
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchHasBreakfast = watch('hasBreakfast');

  // Sync selected cabin
  useEffect(() => {
    if (!watchCabinId || !cabins) return;
    const cabin = cabins.find((c) => c.id === Number(watchCabinId));
    setSelectedCabin(cabin || null);
    // reset guests to 1 when cabin changes
    setGuests([emptyGuest()]);
    setGuestErrors([]);
  }, [watchCabinId, cabins]);

  // Availability check
  useEffect(() => {
    if (!watchCabinId || !watchStartDate || !watchEndDate) {
      setAvailability(null);
      return;
    }
    if (new Date(watchEndDate) <= new Date(watchStartDate)) {
      setAvailability(null);
      return;
    }
    setAvailability('checking');
    checkCabinAvailability({
      cabinId: Number(watchCabinId),
      startDate: watchStartDate,
      endDate: watchEndDate,
    })
      .then((available) => setAvailability(available))
      .catch(() => setAvailability(null));
  }, [watchCabinId, watchStartDate, watchEndDate]);

  /* ── Guest slot helpers ── */
  const maxCapacity = selectedCabin?.maxCapacity || 1;

  const addGuestSlot = () => {
    if (guests.length < maxCapacity) {
      setGuests((g) => [...g, emptyGuest()]);
      setGuestErrors((e) => [...e, {}]);
    }
  };

  const removeGuestSlot = (idx) => {
    setGuests((g) => g.filter((_, i) => i !== idx));
    setGuestErrors((e) => e.filter((_, i) => i !== idx));
  };

  const updateGuest = (idx, field, value) => {
    setGuests((g) =>
      g.map((guest, i) => (i === idx ? { ...guest, [field]: value } : guest)),
    );
    setGuestErrors((e) =>
      e.map((err, i) => (i === idx ? { ...err, [field]: undefined } : err)),
    );
  };

  const validateGuests = () => {
    const errs = guests.map((g) => ({
      name:
        g.name.trim().length < 2
          ? 'Name must be at least 2 characters'
          : undefined,
      age:
        g.age !== '' && (Number(g.age) < 0 || Number(g.age) > 130)
          ? 'Age must be 0–130'
          : undefined,
      gender: !g.gender ? 'Gender is required' : undefined,
    }));
    setGuestErrors(errs);
    return errs.every((e) => !e.name && !e.age && !e.gender);
  };

  /* ── Derived prices ── */
  const numNights =
    watchStartDate && watchEndDate
      ? Math.max(
          0,
          differenceInCalendarDays(
            new Date(watchEndDate),
            new Date(watchStartDate),
          ),
        )
      : 0;

  const cabinPrice = selectedCabin
    ? (selectedCabin.regularPrice - (selectedCabin.discount || 0)) * numNights
    : 0;

  const breakfastPrice = settings?.breakfastPrice ?? 15;
  const numGuests = guests.length;
  const extrasPrice = watchHasBreakfast
    ? breakfastPrice * numNights * numGuests
    : 0;
  const totalPrice = cabinPrice + extrasPrice;

  /* ── Submit ── */
  const onSubmit = async (data) => {
    if (!availability) return;
    if (!validateGuests()) return;

    setIsSubmitting(true);
    try {
      // 1. Create guests and get IDs — first guest is the primary guest
      const createdGuests = await Promise.all(
        guests.map((g, i) =>
          createGuest({
            fullName: g.name.trim(),
            email: `guest-${Date.now()}-${i}@booking.local`, // placeholder unique email
            age: g.age !== '' ? Number(g.age) : undefined,
            gender: g.gender,
          }),
        ),
      );

      const primaryGuestId = createdGuests[0]?.id;
      if (!primaryGuestId) throw new Error('Failed to create guest record');

      const payload = {
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        numNights,
        numGuests,
        cabinId: Number(data.cabinId),
        guestId: primaryGuestId,
        hasBreakfast: Boolean(data.hasBreakfast),
        observations: data.observations || '',
        isPaid: false,
        cabinPrice,
        extrasPrice,
        totalPrice,
      };

      createBooking(payload, {
        onSuccess: () => {
          reset();
          setGuests([emptyGuest()]);
          onCloseModal?.();
        },
      });
    } catch (err) {
      import('react-hot-toast').then(({ default: toast }) =>
        toast.error(err.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const busy = isCreating || isSubmitting;

  if (loadingCabins)
    return (
      <FormWrap>
        <div
          style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}
        >
          <Spinner />
        </div>
      </FormWrap>
    );

  return (
    <FormWrap>
      <FormHeader>
        <h2>Create new booking</h2>
        <p>Fill in the details to reserve a cabin for a guest</p>
      </FormHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormBody>
          {/* ── Cabin ── */}
          <SectionTitle>
            <HiOutlineHomeModern />
            Select cabin
          </SectionTitle>
          <FieldGroup>
            <Label htmlFor='cabinId'>Cabin</Label>
            <StyledSelect
              id='cabinId'
              $error={!!errors.cabinId}
              disabled={busy}
              {...register('cabinId', { required: 'Please select a cabin' })}
            >
              <option value=''>— Select cabin —</option>
              {cabins.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.cabinNumber ? ` (#${c.cabinNumber})` : ''} · up to{' '}
                  {c.maxCapacity} {c.maxCapacity === 1 ? 'guest' : 'guests'} ·{' '}
                  {formatCurrency(c.regularPrice - (c.discount || 0))}/night
                </option>
              ))}
            </StyledSelect>
            {errors.cabinId && <ErrorMsg>{errors.cabinId.message}</ErrorMsg>}
          </FieldGroup>

          <Divider />

          {/* ── Dates ── */}
          <SectionTitle>
            <HiOutlineCalendarDays />
            Dates
          </SectionTitle>
          <FieldGrid>
            <FieldGroup>
              <Label htmlFor='startDate'>Check-in date</Label>
              <StyledInput
                id='startDate'
                type='date'
                $error={!!errors.startDate}
                disabled={busy}
                min={today()}
                {...register('startDate', {
                  required: 'Check-in date is required',
                })}
              />
              {errors.startDate && (
                <ErrorMsg>{errors.startDate.message}</ErrorMsg>
              )}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor='endDate'>Check-out date</Label>
              <StyledInput
                id='endDate'
                type='date'
                $error={!!errors.endDate}
                disabled={busy}
                min={tomorrow()}
                {...register('endDate', {
                  required: 'Check-out date is required',
                  validate: (v) =>
                    new Date(v) > new Date(watchStartDate) ||
                    'Check-out must be after check-in',
                })}
              />
              {errors.endDate && <ErrorMsg>{errors.endDate.message}</ErrorMsg>}
            </FieldGroup>
          </FieldGrid>

          {watchCabinId && numNights > 0 && (
            <AvailabilityBadge
              $checking={availability === 'checking'}
              $available={availability === true}
            >
              {availability === 'checking' && (
                <>
                  <HiOutlineClock />
                  Checking availability…
                </>
              )}
              {availability === true && (
                <>
                  <HiOutlineCheckCircle />
                  Available for {numNights}{' '}
                  {numNights === 1 ? 'night' : 'nights'}
                </>
              )}
              {availability === false && (
                <>
                  <HiOutlineCalendarDays />
                  Already booked for those dates — choose different dates.
                </>
              )}
            </AvailabilityBadge>
          )}

          <Divider />

          {/* ── Guests ── */}
          <SectionTitle>
            <HiOutlineUsers />
            Guests
            {selectedCabin && (
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '1.2rem',
                  fontWeight: 400,
                  color: 'var(--color-grey-500)',
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                {guests.length} / {maxCapacity} slots used
              </span>
            )}
          </SectionTitle>

          <GuestSlotList>
            {guests.map((g, idx) => (
              <GuestSlot key={idx}>
                <FieldGroup>
                  <SlotLabel>Guest {idx + 1} — Name *</SlotLabel>
                  <StyledInput
                    type='text'
                    placeholder='Full name'
                    value={g.name}
                    onChange={(e) => updateGuest(idx, 'name', e.target.value)}
                    $error={!!guestErrors[idx]?.name}
                    disabled={busy}
                  />
                  {guestErrors[idx]?.name && (
                    <ErrorMsg>{guestErrors[idx].name}</ErrorMsg>
                  )}
                </FieldGroup>

                <FieldGroup>
                  <SlotLabel>Age (optional)</SlotLabel>
                  <StyledInput
                    type='number'
                    placeholder='e.g. 34'
                    min={0}
                    max={130}
                    value={g.age}
                    onChange={(e) => updateGuest(idx, 'age', e.target.value)}
                    $error={!!guestErrors[idx]?.age}
                    disabled={busy}
                    style={{ maxWidth: '10rem' }}
                  />
                  {guestErrors[idx]?.age && (
                    <ErrorMsg>{guestErrors[idx].age}</ErrorMsg>
                  )}
                </FieldGroup>

                <FieldGroup>
                  <SlotLabel>Gender *</SlotLabel>
                  <StyledSelect
                    value={g.gender}
                    onChange={(e) => updateGuest(idx, 'gender', e.target.value)}
                    $error={!!guestErrors[idx]?.gender}
                    disabled={busy}
                  >
                    <option value=''>— Select —</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </StyledSelect>
                  {guestErrors[idx]?.gender && (
                    <ErrorMsg>{guestErrors[idx].gender}</ErrorMsg>
                  )}
                </FieldGroup>

                <RemoveBtn
                  type='button'
                  onClick={() => removeGuestSlot(idx)}
                  disabled={guests.length === 1 || busy}
                  title='Remove guest'
                >
                  <HiOutlineTrash />
                </RemoveBtn>
              </GuestSlot>
            ))}
          </GuestSlotList>

          {selectedCabin && guests.length < maxCapacity && (
            <AddGuestBtn type='button' onClick={addGuestSlot} disabled={busy}>
              <HiOutlineUserPlus />
              Add another guest
            </AddGuestBtn>
          )}
          {selectedCabin && (
            <CapacityHint>
              This cabin fits up to {maxCapacity}{' '}
              {maxCapacity === 1 ? 'guest' : 'guests'}. The first guest is the
              primary booking contact.
            </CapacityHint>
          )}

          <Divider />

          {/* ── Extras ── */}
          <FieldGrid>
            <FieldGroup>
              <Label>Extras</Label>
              <CheckboxRow>
                <input
                  type='checkbox'
                  id='hasBreakfast'
                  disabled={busy}
                  style={{
                    width: '1.6rem',
                    height: '1.6rem',
                    cursor: 'pointer',
                  }}
                  {...register('hasBreakfast')}
                />
                Include breakfast ({formatCurrency(breakfastPrice)} / person /
                night)
              </CheckboxRow>
            </FieldGroup>
          </FieldGrid>

          <FieldGroup>
            <Label htmlFor='observations'>
              Observations / Special requests
            </Label>
            <StyledTextarea
              id='observations'
              placeholder='Allergy info, room preferences, arrival time…'
              disabled={busy}
              {...register('observations')}
            />
          </FieldGroup>

          {/* ── Price summary ── */}
          {numNights > 0 && selectedCabin && (
            <>
              <Divider />
              <SectionTitle>
                <HiOutlineBanknotes />
                Price summary
              </SectionTitle>
              <PriceCard>
                <PriceRow>
                  <span>Cabin price</span>
                  <span>
                    {formatCurrency(
                      selectedCabin.regularPrice -
                        (selectedCabin.discount || 0),
                    )}{' '}
                    × {numNights} nights
                  </span>
                </PriceRow>
                <PriceRow>
                  <span>Cabin subtotal</span>
                  <span>{formatCurrency(cabinPrice)}</span>
                </PriceRow>
                {watchHasBreakfast && (
                  <>
                    <PriceRow>
                      <span>Breakfast</span>
                      <span>
                        {formatCurrency(breakfastPrice)} × {numNights} nights ×{' '}
                        {numGuests} guests
                      </span>
                    </PriceRow>
                    <PriceRow>
                      <span>Breakfast subtotal</span>
                      <span>{formatCurrency(extrasPrice)}</span>
                    </PriceRow>
                  </>
                )}
                <TotalRow>
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </TotalRow>
              </PriceCard>
            </>
          )}
        </FormBody>

        <FormActions>
          <Button
            variation='secondary'
            type='button'
            onClick={onCloseModal}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            variation='primary'
            disabled={
              busy ||
              availability === false ||
              availability === 'checking' ||
              !watchCabinId
            }
          >
            {busy ? 'Creating…' : 'Create booking'}
          </Button>
        </FormActions>
      </form>
    </FormWrap>
  );
};

export default CreateBookingForm;
