import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronDown, HiChevronUp, HiOutlineArrowRightOnRectangle, HiOutlineLockClosed, HiOutlineMoon, HiOutlineSun, HiOutlineUserCircle } from 'react-icons/hi2';
import Button from './Button';
import Modal from './Modal';
import LoginForm from '../features/authentication/LoginForm';
import SignupForm from '../features/authentication/SignupForm';
import UpdateUserDataForm from '../features/authentication/UpdateUserDataForm';
import UpdatePasswordForm from '../features/authentication/UpdatePasswordForm';
import UserAvatar from '../features/authentication/UserAvatar';
import { useCurrentUser } from '../features/authentication/useCurrentUser';
import { useLogout } from '../features/authentication/useLogout';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { useDarkMode } from '../hooks/useDarkMode';

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const DarkModeBtn = styled.button`
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 50%;
  border: 1.5px solid var(--color-grey-200);
  background-color: var(--color-grey-100);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-grey-600);

  &:hover {
    background-color: var(--color-brand-100);
    border-color: var(--color-brand-300, var(--color-brand-200));
    color: var(--color-brand-600);
  }

  & svg {
    width: 1.9rem;
    height: 1.9rem;
  }
`;

const UserMenuWrap = styled.div`
  position: relative;
`;

const UserTrigger = styled.button`
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.7rem;
    height: 1.7rem;
    color: var(--color-grey-500);
  }
`;

const UserMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 0.8rem);
  width: 22rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 0.6rem;
  z-index: 20;
`;

const UserMenuButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  border-radius: var(--border-radius-sm);
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.7rem;
    height: 1.7rem;
    color: var(--color-grey-500);
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { logout, isLoggingOut } = useLogout();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useOutsideClick(() => setIsUserMenuOpen(false));
  const { isDark, toggleDark } = useDarkMode();

  return (
    <StyledHeader>
      <Title>The Wild Oasis</Title>

      <Actions>
        <DarkModeBtn
          type='button'
          onClick={toggleDark}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
        </DarkModeBtn>
        <Modal>
          {!user && (
            <>
              <Modal.Open opens='login'>
                <Button size='small'>Login</Button>
              </Modal.Open>

              <Modal.Open opens='signup'>
                <Button variation='secondary' size='small'>
                  Signup
                </Button>
              </Modal.Open>
            </>
          )}

          {user && (
            <UserMenuWrap ref={userMenuRef}>
              <UserTrigger type='button' onClick={() => setIsUserMenuOpen((open) => !open)}>
                <UserAvatar />
                {isUserMenuOpen ? <HiChevronUp /> : <HiChevronDown />}
              </UserTrigger>

              {isUserMenuOpen && (
                <UserMenu>
                  <Modal.Open opens='update-profile'>
                    <UserMenuButton type='button' onClick={() => setIsUserMenuOpen(false)}>
                      <HiOutlineUserCircle />
                      <span>Update profile</span>
                    </UserMenuButton>
                  </Modal.Open>

                  <Modal.Open opens='update-password'>
                    <UserMenuButton type='button' onClick={() => setIsUserMenuOpen(false)}>
                      <HiOutlineLockClosed />
                      <span>Update password</span>
                    </UserMenuButton>
                  </Modal.Open>

                  <UserMenuButton
                    type='button'
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout(undefined, {
                        onSuccess: () => navigate('/dashboard', { replace: true }),
                      });
                    }}
                    disabled={isLoggingOut}
                  >
                    <HiOutlineArrowRightOnRectangle />
                    <span>Logout</span>
                  </UserMenuButton>
                </UserMenu>
              )}
            </UserMenuWrap>
          )}

          <Modal.Window name='login'>
            <LoginForm />
          </Modal.Window>

          <Modal.Window name='signup'>
            <SignupForm />
          </Modal.Window>

          <Modal.Window name='update-profile'>
            <UpdateUserDataForm />
          </Modal.Window>

          <Modal.Window name='update-password'>
            <UpdatePasswordForm />
          </Modal.Window>
        </Modal>
      </Actions>
    </StyledHeader>
  );
};

export default Header;
