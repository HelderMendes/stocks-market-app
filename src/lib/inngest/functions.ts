import { inngest } from '@/lib/inngest/client';
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from './prompts';
import { sendWelcomeEmail } from '@/lib/nodemailer';
import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth/auth';

export const sendSignUpEmail = inngest.createFunction(
  { id: 'sign-up-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    const userProfile = `
    - Country: ${event.data.country}
    - Investment goals: ${event.data.investmentGoals}
    - Risk tolerance: ${event.data.riskTolerance}
    - Experience level: ${event.data.experienceLevel}
    - Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      '{{userProfile}}',
      userProfile
    );

    const response = await step.ai.infer('generate-welcome-intro', {
      model: step.ai.models.gemini({
        model: 'gemini-2.5-flash-lite-preview-06-17',
      }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run('send-welcome-email', async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && 'text' in part ? part.text : null) ||
        "Thanks for signing up to Stock Tracker!\n\r We're excited to have you on board. \nYou've now the tools to track your favorite stocks and stay updated with the latest market trends.";

      //  Integrate actual email service
      const {
        data: { email, name },
      } = event;
      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });
    return { success: true, message: 'Welcome email process completed' };
  }
);

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.log('Error signing out: ', error);
    return {
      success: false,
      error: 'Sign out failed',
    };
  }
  return { success: true, message: 'Signed out successfully' };
};

// export const functions = [sendSignUpEmail];
