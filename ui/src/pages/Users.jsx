import { useState } from 'react';
import styled from 'styled-components';
import { HiOutlineUserPlus, HiOutlineUsers } from 'react-icons/hi2';
import Heading from '../components/Heading';
import Row from '../components/Row';
import Button from '../components/Button';
import CreateUserForm from '../features/authentication/CreateUserForm';
import UsersList from '../features/authentication/UsersList';
import { useCurrentUser } from '../features/authentication/useCurrentUser';

const Notice = styled.div`
  padding: 2.4rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  font-size: 1.5rem;
  color: var(--color-grey-500);
  text-align: center;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const NewUsers = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === 'admin';
  const [view, setView] = useState('list');

  return (
    <Row>
      <Row type='horizontal'>
        <Heading as='h1'>Manage staff accounts</Heading>
        {isAdmin && (
          <TabBar>
            <Button
              variation={view === 'list' ? 'primary' : 'secondary'}
              size='small'
              onClick={() => setView('list')}
            >
              <HiOutlineUsers />
              All users
            </Button>
            <Button
              variation={view === 'create' ? 'primary' : 'secondary'}
              size='small'
              onClick={() => setView('create')}
            >
              <HiOutlineUserPlus />
              New user
            </Button>
          </TabBar>
        )}
      </Row>

      {isAdmin ? (
        view === 'list' ? (
          <UsersList />
        ) : (
          <CreateUserForm />
        )
      ) : (
        <Notice>Only administrators can manage user accounts.</Notice>
      )}
    </Row>
  );
};

export default NewUsers;
