import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';
import { HiOutlineAdjustmentsHorizontal, HiOutlineBarsArrowDown, HiOutlineCheck } from 'react-icons/hi2';
import { useOutsideClick } from '../../hooks/useOutsideClick';

/* ─── Date-range pickers ──────────────────────────────────────────────────── */
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const DateRangeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const DateLabel = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-600);
  white-space: nowrap;
`;

const DateInput = styled.input`
  padding: 0.72rem 1rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 2px var(--color-brand-100);
  }
`;

const ClearBtn = styled.button`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-brand-600);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
  white-space: nowrap;

  &:hover {
    background-color: var(--color-brand-50);
  }
`;

/* ─── Dropdown button + panel ─────────────────────────────────────────────── */
const DropdownWrap = styled.div`
  position: relative;
`;

const DropBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.72rem 1.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover,
  &[aria-expanded='true'] {
    border-color: var(--color-brand-500);
    color: var(--color-brand-600);
    background-color: var(--color-brand-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const ActiveDot = styled.span`
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background-color: var(--color-brand-600);
  flex-shrink: 0;
`;

const Panel = styled.ul`
  position: absolute;
  right: 0;
  top: calc(100% + 0.6rem);
  min-width: 20rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 0.5rem;
  z-index: 50;
  list-style: none;
`;

const PanelItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.9rem 1.2rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? 'var(--color-brand-600)' : 'var(--color-grey-700)')};
  background-color: ${(p) => (p.$active ? 'var(--color-brand-50)' : 'transparent')};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    flex-shrink: 0;
  }
`;

/* ─── Data ────────────────────────────────────────────────────────────────── */
const FILTER_OPTIONS = [
  { value: 'all', label: 'All cabins' },
  { value: 'no-discount', label: 'No discount' },
  { value: 'with-discount', label: 'With discount' },
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
  { value: 'regularPrice-asc', label: 'Price (low first)' },
  { value: 'regularPrice-desc', label: 'Price (high first)' },
  { value: 'maxCapacity-asc', label: 'Capacity (low first)' },
  { value: 'maxCapacity-desc', label: 'Capacity (high first)' },
];

const today = () => format(new Date(), 'yyyy-MM-dd');

/* ─── Component ──────────────────────────────────────────────────────────── */
const CabinTableOperations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filterRef = useOutsideClick(() => setFilterOpen(false));
  const sortRef = useOutsideClick(() => setSortOpen(false));

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const activeFilter = searchParams.get('discount') || 'all';
  const activeSort = searchParams.get('sort-by') || '';

  const setParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const clearDates = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('checkIn');
      next.delete('checkOut');
      return next;
    });
  };

  const activeFilterLabel = FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label ?? 'Filter';
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === activeSort)?.label;

  return (
    <Toolbar>
      {/* Date range */}
      <DateRangeWrap>
        <DateLabel htmlFor='checkIn'>From</DateLabel>
        <DateInput
          id='checkIn'
          type='date'
          value={checkIn}
          min={today()}
          onChange={(e) => setParam('checkIn', e.target.value)}
        />
        <DateLabel htmlFor='checkOut'>To</DateLabel>
        <DateInput
          id='checkOut'
          type='date'
          value={checkOut}
          min={checkIn || today()}
          onChange={(e) => setParam('checkOut', e.target.value)}
        />
        {(checkIn || checkOut) && (
          <ClearBtn type='button' onClick={clearDates}>
            Clear
          </ClearBtn>
        )}
      </DateRangeWrap>

      {/* Filter dropdown */}
      <DropdownWrap ref={filterRef}>
        <DropBtn
          type='button'
          aria-expanded={filterOpen}
          onClick={() => { setFilterOpen((o) => !o); setSortOpen(false); }}
        >
          <HiOutlineAdjustmentsHorizontal />
          Filter
          {activeFilter !== 'all' && <ActiveDot />}
        </DropBtn>

        {filterOpen && (
          <Panel>
            {FILTER_OPTIONS.map((opt) => (
              <PanelItem
                key={opt.value}
                $active={activeFilter === opt.value}
                onClick={() => {
                  setParam('discount', opt.value === 'all' ? null : opt.value);
                  setFilterOpen(false);
                }}
              >
                {opt.label}
                {activeFilter === opt.value && <HiOutlineCheck />}
              </PanelItem>
            ))}
          </Panel>
        )}
      </DropdownWrap>

      {/* Sort dropdown */}
      <DropdownWrap ref={sortRef}>
        <DropBtn
          type='button'
          aria-expanded={sortOpen}
          onClick={() => { setSortOpen((o) => !o); setFilterOpen(false); }}
        >
          <HiOutlineBarsArrowDown />
          {activeSortLabel ? `Sort: ${activeSortLabel}` : 'Sort'}
          {activeSortLabel && <ActiveDot />}
        </DropBtn>

        {sortOpen && (
          <Panel>
            {SORT_OPTIONS.map((opt) => (
              <PanelItem
                key={opt.value}
                $active={activeSort === opt.value}
                onClick={() => {
                  setParam('sort-by', opt.value);
                  setSortOpen(false);
                }}
              >
                {opt.label}
                {activeSort === opt.value && <HiOutlineCheck />}
              </PanelItem>
            ))}
          </Panel>
        )}
      </DropdownWrap>
    </Toolbar>
  );
};

export default CabinTableOperations;
