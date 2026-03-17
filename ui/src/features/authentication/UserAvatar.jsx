import styled from 'styled-components';
import { useCurrentUser } from './useCurrentUser';

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

const AvatarFallback = styled.div`
  width: 3.6rem;
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  font-weight: 600;
`;

const UserAvatar = () => {
  const { user } = useCurrentUser();

  if (!user) return null;

  return (
    <StyledUserAvatar>
      {user.avatar ? (
        <Avatar src={user.avatar} alt={user.fullName} />
      ) : (
        <AvatarFallback>
          {user.fullName?.slice(0, 1)?.toUpperCase() || 'U'}
        </AvatarFallback>
      )}
      <span>{user.fullName}</span>
    </StyledUserAvatar>
  );
};

export default UserAvatar;
