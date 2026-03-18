import { useEffect, useState } from 'react';

import Button from '../../components/Button';
import FileInput from '../../components/FileInput';
import Form from '../../components/Form';
import FormRow from '../../components/FormRow';
import Input from '../../components/Input';
import { useCurrentUser } from './useCurrentUser';
import { useUpdateCurrentUser } from './useUpdateCurrentUser';

const UpdateUserDataForm = ({ onCloseModal }) => {
  const { user } = useCurrentUser();
  const { updateCurrentUser, isUpdatingUser } = useUpdateCurrentUser();

  const email = user?.email || '';
  const currentFullName = user?.fullName || '';

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setFullName(currentFullName);
  }, [currentFullName]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateCurrentUser(
      { fullName, avatar },
      {
        onSuccess: () => setAvatar(null),
      },
    );
  };

  return (
    <>
      <h1>Update User Data</h1> <br />
      <Form onSubmit={handleSubmit}>
        <FormRow label='Email address'>
          <Input value={email} disabled />
        </FormRow>
        <FormRow label='Full name'>
          <Input
            type='text'
            disabled={isUpdatingUser}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            id='fullName'
          />
        </FormRow>
        <FormRow label='Avatar image'>
          <FileInput
            id='avatar'
            accept='image/*'
            disabled={isUpdatingUser}
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </FormRow>
        <FormRow>
          <Button
            type='reset'
            variation='secondary'
            onClick={() => {
              setAvatar(null);
              setFullName(currentFullName);
              onCloseModal?.();
            }}
          >
            Cancel
          </Button>
          <Button disabled={isUpdatingUser}>Update account</Button>
        </FormRow>
      </Form>
    </>
  );
};

export default UpdateUserDataForm;
