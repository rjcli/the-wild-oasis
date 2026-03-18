import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import Form from '../../components/Form';
import FormRow from '../../components/FormRow';
import Input from '../../components/Input';

import { useUpdatePassword } from './useUpdatePassword';

// eslint-disable-next-line react/prop-types
const UpdatePasswordForm = ({ onCloseModal }) => {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  const { updatePassword, isUpdatingPassword } = useUpdatePassword();

  const onSubmit = ({ currentPassword, newPassword }) => {
    updatePassword({ currentPassword, newPassword }, { onSuccess: reset });
  };

  return (
    <>
      <h1>Update your password</h1> <br />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          label='Current password'
          error={errors?.currentPassword?.message}
        >
          <Input
            type='password'
            id='currentPassword'
            autoComplete='current-password'
            disabled={isUpdatingPassword}
            {...register('currentPassword', {
              required: 'This field is required',
            })}
          />
        </FormRow>

        <FormRow
          label='New password (min 8 characters)'
          error={errors?.newPassword?.message}
        >
          <Input
            type='password'
            autoComplete='new-password'
            id='newPassword'
            disabled={isUpdatingPassword}
            {...register('newPassword', {
              required: 'This field is required',
              minLength: {
                value: 8,
                message: 'Password needs a minimum of 8 characters',
              },
            })}
          />
        </FormRow>

        <FormRow
          label='Confirm new password'
          error={errors?.newPasswordConfirm?.message}
        >
          <Input
            type='password'
            autoComplete='new-password'
            id='newPasswordConfirm'
            disabled={isUpdatingPassword}
            {...register('newPasswordConfirm', {
              required: 'This field is required',
              validate: (value) =>
                getValues().newPassword === value || 'Passwords need to match',
            })}
          />
        </FormRow>

        <FormRow>
          <Button
            onClick={() => {
              reset();
              onCloseModal?.();
            }}
            type='reset'
            variation='secondary'
          >
            Cancel
          </Button>
          <Button disabled={isUpdatingPassword}>Update password</Button>
        </FormRow>
      </Form>
    </>
  );
};

export default UpdatePasswordForm;
