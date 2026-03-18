import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import styled from 'styled-components';

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow-y: scroll;
`;

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$isSidebarCollapsed ? '9rem 1fr' : '26rem 1fr'};
  grid-template-rows: auto 1fr;
  height: 100vh;
  transition: grid-template-columns 0.25s ease;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <StyledAppLayout $isSidebarCollapsed={isSidebarCollapsed}>
      <Header />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
      />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
};

export default AppLayout;
