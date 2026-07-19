import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

const FROM_EMAIL = process.env.SENDGRID_FROM || 'noreply@example.com';

export async function sendVerificationEmail(email: string, token: string, baseUrl: string) {
  if (!apiKey) {
    console.warn('SENDGRID_API_KEY is not set. Email verification skipped.');
    // Fallback for development if API key isn't present
    console.log(`Verification Link: ${baseUrl}/verify?token=${token}`);
    return;
  }

  const verifyUrl = `${baseUrl}/verify?token=${token}`;

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: 'Verify your UniEvent Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to UniEvent!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create this account, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Failed to send verification email');
  }
}
