'use client';

import CountrySelector from '@/components/forms/CountrySelector';
import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from '@/lib/constants';
import { Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: 'NL',
      investmentGoals: 'Growth',
      riskTolerance: 'Crypto',
    },
    mode: 'onBlur',
  });
  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log(data);
    } catch (error) {
      console.error('Error during sign up: ', error);
    }
  };

  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="Helder Mendes"
          register={register} //Hook form register function
          error={errors.fullName} //Hook form error message
          validation={{ required: 'Full name is required', minLength: 2 }} //Validation rules
        />
        <InputField
          name="email"
          label="Email Address"
          placeholder="Your email"
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
              minLength: 8,
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

        <CountrySelector
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />

        <SelectField
          name="investmentGoals"
          label="Investment Goals"
          placeholder="Select your investment goals"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />
        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select your risk level"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />
        <SelectField
          name="preferredIndustry"
          label="Preferred Industry"
          control={control}
          placeholder="Select your preferred industry"
          options={PREFERRED_INDUSTRIES}
          error={errors.preferredIndustry}
          required
        />

        <button
          type="submit"
          className="yellow-btn mt-5 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Create Account...' : 'Start Your Investing Journey'}
        </button>
        <FooterLink
          text="Already have an account?"
          linkText="Sign In"
          href="sign-in"
        />
      </form>
    </>
  );
};

export default SignUpPage;
