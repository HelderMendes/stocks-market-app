import { inngest } from '@/lib/inngest/client';
import {
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
  NEWS_SUMMARY_EMAIL_PROMPT,
} from './prompts';
import { sendWelcomeEmail, sendNewsEmail } from '@/lib/nodemailer';
import { getAllUsersForNewsEmail } from '@/lib/actions/user.actions';
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions';
import { getNews } from '@/lib/actions/finnhub.actions';
// import { getFormattedTodayDate } from '@/lib/utils';

// Local types used in this file
interface UserForNewsEmail {
  email: string;
  name?: string;
  // include optional properties that may be present on the user object
  [key: string]: unknown;
}

interface MarketNewsArticle {
  // common fields returned by news APIs; allow optional/extra fields
  headline?: string;
  summary?: string;
  url?: string;
  datetime?: string | number;
  [key: string]: unknown;
}

export const sendSignUpEmail = inngest.createFunction(
  { id: 'sign-up-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    try {
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

      const apiKey = process.env.OPENROUTER_API_KEY;
      console.log('🔑 API Key exists:', !!apiKey);

      let response;
      try {
        response = await step.ai.infer('generate-welcome-intro', {
          model: step.ai.models.openai({
            model: 'deepseek/deepseek-chat',
            baseUrl: 'https://openrouter.ai/api/v1',
            apiKey: apiKey,
          }),
          body: {
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          },
        });
      } catch (aiError) {
        console.error('❌ AI failed, using fallback:', aiError);
        return {
          choices: [
            {
              message: {
                content:
                  "Thanks for signing up to Stock Tracker!\n\rWe're excited to have you on board. \nYou've now the tools to track your favorite stocks and stay updated with the latest market trends.",
              },
            },
          ],
        };
      }

      const emailResult = await step.run('send-welcome-email', async () => {
        try {
          const introText =
            response.choices?.[0]?.message?.content ||
            "Thanks for signing up to Stock Tracker!\n\r We're excited to have you on board. \nYou've now the tools to track your favorite stocks and stay updated with the latest market trends.";

          const {
            data: { email, name },
          } = event;

          const result = await sendWelcomeEmail({
            email,
            name,
            intro: introText,
          });

          // console.log('✅ Email sent successfully:', result);
          return result;
        } catch (emailError) {
          console.error('❌ Email step failed:', emailError);
          throw emailError;
        }
      });

      return {
        success: true,
        message: 'Welcome email process completed',
        emailResult,
      };
    } catch (error) {
      console.error('💥 Function failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: 'daily-news-summary' },
  [{ event: 'app/send.daily.news' }, { cron: '0 11 * * *' }],
  // [{ event: 'app/send.daily.news' }, { cron: 'minute hour day month day-of-week' }], --- IGNORE ---
  async ({ step }) => {
    // Step #1: Get all users for news delivery
    const users = await step.run('get-all-users', getAllUsersForNewsEmail);

    if (!users || users.length === 0)
      return { success: false, message: 'No users found for news email' };

    // Step #2: For each user, get watchlist symbols -> fetch news (fallback to general)
    const results = await step.run('fetch-user-news', async () => {
      const perUser: Array<{
        user: UserForNewsEmail;
        articles: MarketNewsArticle[];
      }> = [];
      for (const user of users as UserForNewsEmail[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);
          // If still empty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.error('daily-news: error preparing user news', user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });

    // Step #3: (placeholder) Summarize news via AI
    const userNewsSummaries: {
      user: UserForNewsEmail;
      newsContent: string | null;
    }[] = [];

    for (const { user, articles } of results) {
      try {
        const newsPrompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          '{{newsData}}',
          JSON.stringify(articles, null, 2)
        );

        const apiKey = process.env.OPENROUTER_API_KEY;
        console.log('🔑 API Key exists:', !!apiKey);

        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.openai({
            model: 'deepseek/deepseek-chat',
            baseUrl: 'https://openrouter.ai/api/v1',
            apiKey: apiKey,
          }),
          body: {
            messages: [
              {
                role: 'user',
                content: newsPrompt,
              },
            ],
          },
        });

        const messageContent = response.choices?.[0]?.message?.content;
        let newsContent: string | null = null;

        if (typeof messageContent === 'string') {
          // content is a plain string
          newsContent = messageContent;
        } else if (Array.isArray(messageContent)) {
          const first = messageContent[0];
          if (
            first &&
            typeof first === 'object' &&
            'text' in first &&
            typeof (first as { text: unknown }).text === 'string'
          ) {
            newsContent = (first as { text: string }).text.replace(/\n/g, ' ');
          } else if (typeof first === 'string') {
            // first element is a string
            newsContent = first;
          }
        }

        newsContent = newsContent || 'No market news.';

        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.error(`Failed to summarize news for : ${user.email}`, e);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    // Step #4: (placeholder) Send the emails
    await step.run('send-news-emails', async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;

          return await sendNewsEmail({
            email: user.email,
            name: user.name || '',
            newsContent,
          });
        })
      );
    });

    return {
      success: true,
      message: 'Daily news summary emails sent successfully',
    };
  }
);
