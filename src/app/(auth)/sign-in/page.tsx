'use client';

import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import { Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

const SignInPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });
  const password = watch('password');

  const onSubmit = async (data: SignInFormData) => {
    try {
      console.log(data);
    } catch (error) {
      console.error('Error during sign up: ', error);
    }
  };

  return (
    <>
      <h1 className="form-title">Sign In</h1>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="Your full name"
          register={register} //Hook form register function
          error={errors.fullName} //Hook form error message
          validation={{ required: 'Full name is required', minLength: 2 }} //Validation rules
        />
        <InputField
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          register={register}
          error={errors.email}
          validation={{
            required: 'Email is required',
            pattern: /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
            message: 'Please enter a valid email address',
          }}
        />
        <div className="relative">
          <InputField
            name="password"
            label="Password"
            placeholder="Create a strong password"
            type={showPassword ? 'text' : 'password'}
            register={register}
            error={errors.password}
            validation={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 transform pt-6"
          >
            {showPassword ? (
              <EyeOff className="text-primary size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <div className="relative">
          <InputField
            name="confirmPassword"
            label="Password Confirmation"
            placeholder="Confirm the above password"
            type={showPassword ? 'text' : 'password'}
            register={register}
            error={errors.confirmPassword}
            validation={{
              required: 'Password confirmation is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              validate: (value: string | null) =>
                value === password || 'Passwords do not match',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 transform pt-6"
          >
            {showPassword ? (
              <EyeOff className="text-primary size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="yellow-btn mt-5 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In to Your Account'}
        </button>
        <FooterLink text="No account?" linkText="Sign Up" href="sign-up" />
      </form>
    </>
  );
};

export default SignInPage;
