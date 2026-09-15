import nodemailer, { type Transporter } from 'nodemailer';

interface SendOtpEmailOptions {
  to: string;
  otp: string;
  parentName?: string;
  purpose?: 'register' | 'login' | 'reset';
  expiresInMinutes?: number;
}

let transporter: Transporter | null = null;

function getEmailTransporter(): { transporter: Transporter | null; error?: string } {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return {
      transporter: null,
      error: 'Email verification service is not configured (missing EMAIL_USER or EMAIL_PASS in environment variables).',
    };
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  return { transporter };
}

export async function sendOtpEmail({
  to,
  otp,
  parentName = 'Parent',
  purpose = 'register',
  expiresInMinutes = 10,
}: SendOtpEmailOptions): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const isProd = process.env.NODE_ENV === 'production';

  if (!emailUser || !emailPass) {
    if (isProd) {
      return {
        success: false,
        error: 'Email verification service is not configured on the server. Please check EMAIL_USER and EMAIL_PASS environment variables.',
      };
    } else {
      // In local development mode only, log a clear notice
      console.warn(
        `[DEVELOPMENT NOTICE] EMAIL_USER / EMAIL_PASS not configured in local environment. OTP for ${to}: ${otp}`
      );
      return {
        success: true,
        devMode: true,
      };
    }
  }

  try {
    const { transporter: activeTransporter, error: transporterError } = getEmailTransporter();
    if (transporterError || !activeTransporter) {
      return { success: false, error: transporterError || 'Failed to initialize email transport.' };
    }

    const actionText =
      purpose === 'login'
        ? 'sign in to your Admission Pitara account'
        : 'verify your parent account and access school admissions data';

    const subject = `Your Admission Pitara Verification Code: ${otp}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admission Pitara Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background-color: #0f2b48; padding: 28px 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
        ADMISSION PITARA
      </h1>
      <p style="color: #93c5fd; margin: 4px 0 0 0; font-size: 13px; font-weight: 500;">
        Parent School Discovery & Admission Intelligence • Greater Noida West
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px;">
      <p style="font-size: 15px; margin: 0 0 16px 0; color: #334155;">
        Dear <strong>${parentName}</strong>,
      </p>
      
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; color: #475569;">
        Please use the 6-digit verification code below to ${actionText}:
      </p>

      <!-- OTP Box -->
      <div style="background-color: #f1f5f9; border-radius: 12px; border: 1px dashed #cbd5e1; padding: 20px; text-align: center; margin: 0 0 24px 0;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0f2b48; font-family: monospace;">
          ${otp}
        </span>
        <p style="font-size: 12px; color: #64748b; margin: 8px 0 0 0;">
          This code is valid for <strong>${expiresInMinutes} minutes</strong> and can only be used once.
        </p>
      </div>

      <!-- Security Notice -->
      <div style="background-color: #fffbeb; border-radius: 8px; border: 1px solid #fef3c7; padding: 12px 16px; margin: 0 0 24px 0;">
        <p style="font-size: 12px; line-height: 1.5; color: #92400e; margin: 0;">
          🔒 <strong>Security Tip:</strong> Never share this code with anyone. Admission Pitara representatives will never ask for your verification code.
        </p>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0 0 8px 0;">
        If you did not request this verification code, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">
        Admission Pitara • Empowering parents with verified school fees & admission intelligence
      </p>
      <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
        Greater Noida West & Noida Extension, Uttar Pradesh
      </p>
    </div>

  </div>
</body>
</html>
    `.trim();

    const textContent = `
Admission Pitara - Parent Verification Code

Dear ${parentName},

Please use the following 6-digit verification code to ${actionText}:

VERIFICATION CODE: ${otp}

This code will expire in ${expiresInMinutes} minutes and can only be used once.

Security Notice: Never share this verification code with anyone. Admission Pitara staff will never call or ask for your OTP.

If you did not make this request, please disregard this email.

---
Admission Pitara - Greater Noida West School Discovery
    `.trim();

    await activeTransporter.sendMail({
      from: `"Admission Pitara" <${emailUser}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown SMTP delivery error';
    console.error('Failed to send verification email via Nodemailer:', errorMsg);
    return {
      success: false,
      error: `Failed to deliver verification email: ${errorMsg}`,
    };
  }
}
