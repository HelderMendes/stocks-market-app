'use server';

import { auth } from '@/lib/better-auth/auth';
import { inngest } from '@/lib/inngest/client';
import { headers } from 'next/headers';

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (response) {
      await inngest.send({
        name: 'app/user.created',
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (e) {
    console.log('Sign up failed', e);
    return { success: false, error: 'Sign up failed' };
  }
};

export const signInWithEmail = async ({
  fullName,
  email,
  password,
  confirmPassword,
}: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: { fullName, email, password, confirmPassword },
    });
    return { success: true, data: response };
  } catch (err) {
    console.log('Sign in failed ', err);
    return { success: false, error: 'Sign in failed' };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.log('Error signing out: ', e);
    return { success: false, error: 'Sign out failed' };
  }
};
