import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import Button from '../../components/Button';
import { useCreateUser } from './useCreateUser';

const Card = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 2rem 2.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: linear-gradient(
    135deg,
    var(--color-brand-600) 0%,
    var(--color-brand-700) 100%
  );

  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const CardBody = styled.div`
  padding: 2.8rem;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 60rem) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-brand-600);
  }
`;

const InputWrap = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1.4rem;
  border: 1.5px solid
    ${(p) => (p.$error ? 'var(--color-red-700)' : 'var(--color-grey-200)')};
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  color: var(--color-grey-700);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }

  &:disabled {
    background-color: var(--color-grey-100);
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  font-size: 1.2rem;
  color: var(--color-red-700);
  margin-top: 0.2rem;
`;

const SuccessMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-green-100);
  color: var(--color-green-700);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 2rem;

  & svg {
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 2.4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-grey-100);
`;

const CreateUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const { createUser, isCreating } = useCreateUser();
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = ({ fullName, email, password }) => {
    createUser(
      { fullName, email, password },
      {
        onSuccess: () => {
          reset();
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 4000);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2>Create new staff account</h2>
        <p>Add a new team member to The Wild Oasis management system</p>
      </CardHeader>

      <CardBody>
        {showSuccess && (
          <SuccessMsg>
            <HiOutlineCheckCircle />
            <span>Account created successfully! The user can now log in.</span>
          </SuccessMsg>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGrid>
            <FieldGroup>
              <Label htmlFor='fullName'>
                <HiOutlineUserCircle />
                Full name
              </Label>
              <InputWrap>
                <StyledInput
                  id='fullName'
                  type='text'
                  placeholder='John Doe'
                  disabled={isCreating}
                  $error={!!errors.fullName}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Min. 2 characters' },
                  })}
                />
              </InputWrap>
              {errors.fullName && (
                <ErrorMsg>{errors.fullName.message}</ErrorMsg>
              )}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor='email'>
                <HiOutlineEnvelope />
                Email address
              </Label>
              <InputWrap>
                <StyledInput
                  id='email'
                  type='email'
                  placeholder='staff@wilodoasis.com'
                  disabled={isCreating}
                  $error={!!errors.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
              </InputWrap>
              {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor='password'>
                <HiOutlineLockClosed />
                Password
              </Label>
              <InputWrap>
                <StyledInput
                  id='password'
                  type='password'
                  disabled={isCreating}
                  $error={!!errors.password}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
              </InputWrap>
              {errors.password && (
                <ErrorMsg>{errors.password.message}</ErrorMsg>
              )}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor='passwordConfirm'>
                <HiOutlineLockClosed />
                Confirm password
              </Label>
              <InputWrap>
                <StyledInput
                  id='passwordConfirm'
                  type='password'
                  disabled={isCreating}
                  $error={!!errors.passwordConfirm}
                  {...register('passwordConfirm', {
                    required: 'Please confirm the password',
                    validate: (value) =>
                      value === getValues().password ||
                      'Passwords do not match',
                  })}
                />
              </InputWrap>
              {errors.passwordConfirm && (
                <ErrorMsg>{errors.passwordConfirm.message}</ErrorMsg>
              )}
            </FieldGroup>
          </FieldGrid>

          <FormActions>
            <Button
              variation='secondary'
              type='button'
              onClick={() => reset()}
              disabled={isCreating}
            >
              Clear
            </Button>
            <Button variation='primary' disabled={isCreating}>
              {isCreating ? 'Creating…' : 'Create account'}
            </Button>
          </FormActions>
        </form>
      </CardBody>
    </Card>
  );
};

CreateUserForm.displayName = 'CreateUserForm';

export default CreateUserForm;
