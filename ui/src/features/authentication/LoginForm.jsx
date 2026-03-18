import { useForm } from 'react-hook-form';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Input from '../../components/Input';
import FormRow from '../../components/FormRow';
import { useLogin } from './useLogin';

const LoginForm = ({ onCloseModal, onSuccess, formType = 'modal' }) => {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const { login, isLoggingIn } = useLogin();

  const onSubmit = ({ email, password }) => {
    login(
      { email, password },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={formType}>
      <h1>Login to your account</h1> <br />
      <FormRow label='Email address' error={errors?.email?.message}>
        <Input
          type='email'
          id='email'
          disabled={isLoggingIn}
          autoComplete='username'
          {...register('email', {
            required: 'Email is required',
          })}
        />
      </FormRow>
      <FormRow label='Password' error={errors?.password?.message}>
        <Input
          type='password'
          id='password'
          disabled={isLoggingIn}
          autoComplete='current-password'
          {...register('password', {
            required: 'Password is required',
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
        <Button size='large' disabled={isLoggingIn}>
          Login
        </Button>
      </FormRow>
    </Form>
  );
};

export default LoginForm;
