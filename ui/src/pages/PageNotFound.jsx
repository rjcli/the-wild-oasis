import styled from 'styled-components';
import { HiArrowLeft } from 'react-icons/hi2';
import { useMoveBack } from '../hooks/useMoveBack';

const StyledPageNotFound = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2.4rem;
  right: 2.4rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-grey-100);
    border-color: var(--color-grey-300);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  text-align: center;
`;

const ErrorCode = styled.p`
  font-size: 12rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-brand-600);
  letter-spacing: -0.4rem;
  opacity: 0.15;
  user-select: none;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-grey-800);
  margin-top: -4rem;
`;

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: var(--color-grey-500);
  max-width: 44rem;
  line-height: 1.6;
`;

const PageNotFound = () => {
  const moveBack = useMoveBack();

  return (
    <StyledPageNotFound>
      <BackButton onClick={moveBack}>
        <HiArrowLeft />
        Go back
      </BackButton>

      <Box>
        <ErrorCode>404</ErrorCode>
        <Title>Page not found</Title>
        <Subtitle>
          The page you are looking for doesn&apos;t exist or has been moved.
        </Subtitle>
      </Box>
    </StyledPageNotFound>
  );
};

export default PageNotFound;
