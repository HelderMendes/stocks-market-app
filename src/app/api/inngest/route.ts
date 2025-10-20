import { inngest } from '@/lib/inngest/client';
import { sendDailyNewsSummary, sendSignUpEmail } from '@/lib/inngest/functions';
import { serve } from 'inngest/next';

// Rate limiting state
let putCount = 0;
let isBlocked = false;

const handler = serve({
  client: inngest,
  functions: [sendSignUpEmail, sendDailyNewsSummary],
});

export const GET = handler.GET;
export const POST = handler.POST;

export const PUT = async (req: Request) => {
  putCount++;

  // Allow only first 4 PUT requests, then block completely
  if (putCount > 4 || isBlocked) {
    if (!isBlocked) {
      console.log(
        `🚫 Blocking all further PUT requests after ${putCount} calls`
      );
      isBlocked = true;
    }
    return new Response('Blocked after limit reached', { status: 429 });
  }

  console.log(`✅ Allowing PUT request #${putCount} of 4`);
  return handler.PUT(req, undefined);
};

// Reset function to be called when user takes action
export const POST_RESET = async () => {
  putCount = 0;
  isBlocked = false;
  console.log('🔄 Reset PUT counter - allowing new requests');
  return new Response('Reset successful', { status: 200 });
};
