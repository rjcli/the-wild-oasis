import { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import {
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useUsers } from './useUsers';
import { useAdminUpdateUser, useAdminDeleteUser } from './useAdminUserActions';
import { useCurrentUser } from './useCurrentUser';
import Spinner from '../../components/Spinner';

const Wrapper = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 2rem 2.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;

  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-grey-700);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.4rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  padding: 0.3rem;
  background: var(--color-grey-50);
`;

const FilterBtn = styled.button`
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(p) =>
    p.$active ? 'var(--color-brand-600)' : 'transparent'};
  color: ${(p) =>
    p.$active ? 'var(--color-brand-50)' : 'var(--color-grey-600)'};

  &:hover:not(:disabled) {
    background-color: ${(p) =>
      p.$active ? 'var(--color-brand-600)' : 'var(--color-grey-100)'};
  }
`;

const Count = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  padding: 0.4rem 1rem;
  background-color: var(--color-grey-100);
  border-radius: 100px;
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
`;

const Tr = styled.tr`
  border-bottom: 1px solid var(--color-grey-100);
  transition: background-color 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const Td = styled.td`
  padding: 1.4rem 2rem;
  font-size: 1.4rem;
  color: var(--color-grey-700);
  vertical-align: middle;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const Avatar = styled.img`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-grey-200);
`;

const AvatarPlaceholder = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background-color: var(--color-brand-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand-600);
  font-size: 1.6rem;
  flex-shrink: 0;
`;

const Name = styled.span`
  font-weight: 600;
  color: var(--color-grey-700);
`;

const EmailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-grey-500);
  font-size: 1.3rem;

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    flex-shrink: 0;
  }
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  background-color: ${(p) =>
    p.$admin ? 'var(--color-green-100)' : 'var(--color-brand-100)'};
  color: ${(p) =>
    p.$admin ? 'var(--color-green-700)' : 'var(--color-brand-700)'};

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

const DateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  color: var(--color-grey-500);

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    flex-shrink: 0;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const IconBtn = styled.button`
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
  color: ${(p) =>
    p.$danger
      ? 'var(--color-red-700)'
      : p.$confirm
        ? 'var(--color-green-700)'
        : 'var(--color-grey-600)'};

  &:hover {
    background-color: ${(p) =>
      p.$danger
        ? 'var(--color-red-100)'
        : p.$confirm
          ? 'var(--color-green-100)'
          : 'var(--color-grey-100)'};
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

const InlineInput = styled.input`
  padding: 0.5rem 0.8rem;
  border: 1.5px solid var(--color-brand-500);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  width: 16rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 2px var(--color-brand-100);
  }
`;

const RoleSelect = styled.select`
  padding: 0.5rem 0.8rem;
  border: 1.5px solid var(--color-brand-500);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const ConfirmOverlay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  background-color: var(--color-red-100);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  color: var(--color-red-700);
  font-weight: 500;
  white-space: nowrap;
`;

const Empty = styled.div`
  padding: 3.2rem 2rem;
  text-align: center;
  color: var(--color-grey-500);
  font-size: 1.4rem;
`;

const FILTERS = [
  { value: 'all', label: 'All users' },
  { value: 'admin', label: 'Admins' },
  { value: 'user', label: 'Staff' },
];

const UsersList = () => {
  const { isLoading, users } = useUsers();
  const { user: currentUser } = useCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const { updateUser, isUpdating } = useAdminUpdateUser();
  const { deleteUser, isDeleting } = useAdminDeleteUser();

  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', role: 'user' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filtered =
    filter === 'all' ? users : users.filter((u) => u.role === filter);

  const startEdit = (u) => {
    setEditingId(u.id);
    setEditForm({ fullName: u.fullName, role: u.role });
    setConfirmDeleteId(null);
  };

  const saveEdit = () => {
    updateUser(
      { id: editingId, ...editForm },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
    setEditingId(null);
  };

  const confirmDelete = (id) => {
    deleteUser(id, { onSuccess: () => setConfirmDeleteId(null) });
  };

  return (
    <Wrapper>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <h2>All staff accounts</h2>
          <Count>{filtered.length}</Count>
        </div>
        <FilterBar>
          {FILTERS.map((f) => (
            <FilterBtn
              key={f.value}
              $active={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </FilterBtn>
          ))}
        </FilterBar>
      </Header>

      {isLoading ? (
        <div
          style={{
            padding: '3.2rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <Empty>No users found for this filter.</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              {isAdmin && <Th>Actions</Th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isEditing = editingId === u.id;
              const isConfirmingDelete = confirmDeleteId === u.id;
              const isSelf = currentUser?.id === u.id;

              return (
                <Tr key={u.id}>
                  {/* User */}
                  <Td>
                    <UserInfo>
                      {u.avatar ? (
                        <Avatar src={u.avatar} alt={u.fullName} />
                      ) : (
                        <AvatarPlaceholder>
                          <HiOutlineUserCircle />
                        </AvatarPlaceholder>
                      )}
                      <div>
                        {isEditing ? (
                          <InlineInput
                            value={editForm.fullName}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                fullName: e.target.value,
                              }))
                            }
                            disabled={isUpdating}
                          />
                        ) : (
                          <Name>
                            {u.fullName}
                            {isSelf && (
                              <span
                                style={{
                                  fontSize: '1.1rem',
                                  color: 'var(--color-brand-600)',
                                  marginLeft: '0.6rem',
                                  fontWeight: 400,
                                }}
                              >
                                (you)
                              </span>
                            )}
                          </Name>
                        )}
                        <EmailRow>
                          <HiOutlineEnvelope />
                          {u.email}
                        </EmailRow>
                      </div>
                    </UserInfo>
                  </Td>

                  {/* Role */}
                  <Td>
                    {isEditing ? (
                      <RoleSelect
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, role: e.target.value }))
                        }
                        disabled={isUpdating}
                      >
                        <option value='admin'>Admin</option>
                        <option value='user'>Staff</option>
                      </RoleSelect>
                    ) : (
                      <RoleBadge $admin={u.role === 'admin'}>
                        {u.role === 'admin' ? (
                          <HiOutlineShieldCheck />
                        ) : (
                          <HiOutlineUser />
                        )}
                        {u.role === 'admin' ? 'Admin' : 'Staff'}
                      </RoleBadge>
                    )}
                  </Td>

                  {/* Joined / confirm delete */}
                  <Td>
                    {isConfirmingDelete ? (
                      <ConfirmOverlay>
                        Delete {u.fullName}?
                        <IconBtn
                          $danger
                          onClick={() => confirmDelete(u.id)}
                          disabled={isDeleting}
                          title='Confirm'
                        >
                          <HiOutlineCheck />
                        </IconBtn>
                        <IconBtn
                          onClick={() => setConfirmDeleteId(null)}
                          title='Cancel'
                        >
                          <HiOutlineXMark />
                        </IconBtn>
                      </ConfirmOverlay>
                    ) : (
                      <DateCell>
                        <HiOutlineCalendar />
                        {format(new Date(u.createdAt), 'MMM d, yyyy')}
                      </DateCell>
                    )}
                  </Td>

                  {/* Admin actions */}
                  {isAdmin && (
                    <Td>
                      {isEditing ? (
                        <ActionGroup>
                          <IconBtn
                            $confirm
                            onClick={saveEdit}
                            disabled={isUpdating}
                            title='Save'
                          >
                            <HiOutlineCheck />
                          </IconBtn>
                          <IconBtn
                            onClick={() => setEditingId(null)}
                            title='Cancel'
                          >
                            <HiOutlineXMark />
                          </IconBtn>
                        </ActionGroup>
                      ) : (
                        <ActionGroup>
                          <IconBtn
                            onClick={() => startEdit(u)}
                            disabled={isUpdating || isDeleting}
                            title='Edit user'
                          >
                            <HiOutlinePencil />
                          </IconBtn>
                          <IconBtn
                            $danger
                            onClick={() => handleDeleteClick(u.id)}
                            disabled={isDeleting || isUpdating || isSelf}
                            title={
                              isSelf
                                ? 'Cannot delete your own account'
                                : 'Delete user'
                            }
                          >
                            <HiOutlineTrash />
                          </IconBtn>
                        </ActionGroup>
                      )}
                    </Td>
                  )}
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Wrapper>
  );
};

export default UsersList;
