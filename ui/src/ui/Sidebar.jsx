import styled from 'styled-components';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi2';
import Logo from './Logo';
import MainNav from './MainNav';

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem ${(props) => (props.$isCollapsed ? '1.2rem' : '2.4rem')};
  border-right: 1px solid var(--color-grey-100);

  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  position: relative;
  transition: padding 0.25s ease;

  &:hover button[data-sidebar-toggle='true'],
  button[data-sidebar-toggle='true']:hover,
  button[data-sidebar-toggle='true']:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 1.6rem;
  right: -1.6rem;
  width: 3.2rem;
  height: 3.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 50%;
  background-color: var(--color-grey-0);
  display: grid;
  place-items: center;
  color: var(--color-grey-600);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: var(--color-grey-800);
    border-color: var(--color-grey-400);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  return (
    <StyledSidebar $isCollapsed={isCollapsed}>
      <ToggleButton
        type='button'
        onClick={onToggleCollapse}
        data-sidebar-toggle='true'
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
      </ToggleButton>

      {!isCollapsed && <Logo />}
      <MainNav isCollapsed={isCollapsed} />
    </StyledSidebar>
  );
};

export default Sidebar;
