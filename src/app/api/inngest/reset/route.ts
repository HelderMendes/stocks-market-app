export async function POST() {
  // This will reset the PUT counter when called from browser
  try {
    const response = await fetch(
      'http://localhost:3000/api/inngest/reset-internal',
      {
        method: 'POST',
      }
    );
    return Response.json({ success: true, message: 'Inngest counter reset' });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Reset failed' },
      { status: 500 }
    );
  }
}
