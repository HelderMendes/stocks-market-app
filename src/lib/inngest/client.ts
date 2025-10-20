import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'TestNewAPI', // Completely new ID to break cache
  ai: {
    openai: {
      apiKey: process.env.OPENROUTER_API_KEY! || '',
      baseUrl: 'https://openrouter.ai/api/v1',
    },
  },
});

// Alternative Gemini setup (commented out)
// export const inngest = new Inngest({
//   id: 'stock-tracker',
//   ai: { gemini: { apiKey: process.env.GOOGLE_GEMINI_API_KEY! || '' } },
// });
