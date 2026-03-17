import { Outlet, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { HiOutlineLockClosed, HiXMark } from 'react-icons/hi2';
import SpinnerFullPage from './SpinnerFullPage';
import { useCurrentUser } from '../features/authentication/useCurrentUser';
import LoginForm from '../features/authentication/LoginForm';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled.div`
  position: relative;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  min-width: 48rem;
  max-width: 95vw;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
    display: block;
  }
`;

const AuthNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-yellow-100);
  color: var(--color-yellow-700);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 2.4rem;

  & svg {
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
  }
`;

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  if (isLoading) return <SpinnerFullPage />;

  if (!isAuthenticated) {
    return createPortal(
      <Overlay>
        <LoginCard>
          <CloseBtn onClick={() => navigate('/dashboard')}>
            <HiXMark />
          </CloseBtn>
          <AuthNotice>
            <HiOutlineLockClosed />
            <span>Please log in to access this page</span>
          </AuthNotice>
          <LoginForm
            formType='modal'
            onCloseModal={() => navigate('/dashboard')}
          />
        </LoginCard>
      </Overlay>,
      document.body,
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
