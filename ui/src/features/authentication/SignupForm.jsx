import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useSignup } from './useSignup';

// Email regex: /\S+@\S+\.\S+/

// eslint-disable-next-line react/prop-types
const SignupForm = ({ onCloseModal, onOpenModal }) => {
  const { register, handleSubmit, formState, reset, getValues } = useForm();
  const { errors } = formState;
  const { signup, isSigningUp } = useSignup();

  const onSubmit = ({ fullName, email, password }) => {
    signup(
      { fullName, email, password },
      {
        onSuccess: () => {
          reset();
          onOpenModal?.('login');
        },
      },
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type='modal'>
      <h1>Create an account</h1> <br />
      <FormRow label='Full name' error={errors?.fullName?.message}>
        <Input
          type='text'
          id='fullName'
          disabled={isSigningUp}
          {...register('fullName', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />
      </FormRow>
      <FormRow label='Email address' error={errors?.email?.message}>
        <Input
          type='email'
          id='email'
          disabled={isSigningUp}
          {...register('email', {
            required: 'Email is required',
          })}
        />
      </FormRow>
      <FormRow
        label='Password (min 8 characters)'
        error={errors?.password?.message}
      >
        <Input
          type='password'
          id='password'
          disabled={isSigningUp}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password needs a minimum of 8 characters',
            },
          })}
        />
      </FormRow>
      <FormRow label='Repeat password' error={errors?.passwordConfirm?.message}>
        <Input
          type='password'
          id='passwordConfirm'
          disabled={isSigningUp}
          {...register('passwordConfirm', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === getValues().password || 'Passwords need to match',
          })}
        />
      </FormRow>
      <FormRow>
        <Button
          variation='secondary'
          type='button'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isSigningUp}>Create account</Button>
      </FormRow>
    </Form>
  );
};

export default SignupForm;
