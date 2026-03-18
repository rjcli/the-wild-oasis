import styled from 'styled-components';
import Spinner from './Spinner';

const StyledDiv = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-grey-50);
`;

const SpinnerFullPage = () => {
  return (
    <StyledDiv>
      <Spinner />
    </StyledDiv>
  );
};

export default SpinnerFullPage;
