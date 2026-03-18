import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineUsers,
} from 'react-icons/hi2';
import { useCurrentUser } from '../features/authentication/useCurrentUser';

const Nav = styled.nav`
  flex: 1;
  display: flex;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 0.8rem;
`;

const SettingsItem = styled.li`
  margin-top: auto;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    justify-content: ${(props) =>
      props.$isCollapsed ? 'center' : 'flex-start'};
    gap: ${(props) => (props.$isCollapsed ? '0' : '1.2rem')};

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: ${(props) => (props.$isCollapsed ? '1.2rem' : '1.2rem 2.4rem')};
    transition: all 0.3s;
  }

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }

  & span {
    display: ${(props) => (props.$isCollapsed ? 'none' : 'inline')};
  }
`;

// eslint-disable-next-line react/prop-types
const MainNav = ({ isCollapsed = false }) => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === 'admin';
  return (
    <Nav>
      <NavList>
        <li>
          <StyledNavLink to='/dashboard' $isCollapsed={isCollapsed}>
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to='/bookings' $isCollapsed={isCollapsed}>
            <HiOutlineCalendarDays />
            <span>Bookings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to='/cabins' $isCollapsed={isCollapsed}>
            <HiOutlineHomeModern />
            <span>Cabins</span>
          </StyledNavLink>
        </li>
        {isAdmin && (
          <li>
            <StyledNavLink to='/users' $isCollapsed={isCollapsed}>
              <HiOutlineUsers />
              <span>Users</span>
            </StyledNavLink>
          </li>
        )}
        {isAdmin && (
          <SettingsItem>
            <StyledNavLink to='/settings' $isCollapsed={isCollapsed}>
              <HiOutlineCog6Tooth />
              <span>Settings</span>
            </StyledNavLink>
          </SettingsItem>
        )}
      </NavList>
    </Nav>
  );
};

export default MainNav;
