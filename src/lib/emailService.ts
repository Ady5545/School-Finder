import nodemailer, { type Transporter } from 'nodemailer';

export type EmailErrorCode =
  | 'EMAIL_CONFIG_MISSING'
  | 'SMTP_AUTH_ERROR'
  | 'SMTP_CONNECTION_ERROR'
  | 'INVALID_RECIPIENT'
  | 'EMAIL_SEND_ERROR';

interface SendOtpEmailOptions {
  to: string;
  otp: string;
  parentName?: string;
  purpose?: 'register' | 'login' | 'reset';
  expiresInMinutes?: number;
}

export interface SendOtpEmailResult {
  success: boolean;
  error?: string;
  category?: EmailErrorCode;
  devMode?: boolean;
}

interface SmtpCredentials {
  emailUser: string;
  emailPass: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpFrom: string;
  hasUser: boolean;
  hasPass: boolean;
}

export function getEmailCredentials(): SmtpCredentials {
  const emailUser = (process.env.EMAIL_USER || '').trim();
  // Strip all whitespace from App Passwords (e.g. Google generates "abcd efgh ijkl mnop")
  const rawPass = (process.env.EMAIL_PASS || '').trim();
  const emailPass = rawPass.replace(/\s+/g, '');

  const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const smtpPort = Number(process.env.SMTP_PORT) || (smtpHost.includes('gmail') ? 465 : 587);
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : smtpPort === 465;

  const smtpFrom = (process.env.SMTP_FROM || `"Admission Pitara" <${emailUser}>`).trim();

  return {
    emailUser,
    emailPass,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpFrom,
    hasUser: Boolean(emailUser),
    hasPass: Boolean(emailPass),
  };
}

function logSmtpDiagnostics(
  context: string,
  details: {
    category: EmailErrorCode;
    hasUser: boolean;
    hasPass: boolean;
    smtpHost: string;
    smtpPort: number;
    errorSnippet?: string;
  }
) {
  // Never log passwords, tokens, or raw secrets. Log clean operational telemetry only.
  console.error(
    `[EMAIL_DIAGNOSTIC] ${context} -> Category: ${details.category} | EMAIL_USER configured: ${details.hasUser} | EMAIL_PASS configured: ${details.hasPass} | Host: ${details.smtpHost}:${details.smtpPort}${details.errorSnippet ? ` | Detail: ${details.errorSnippet}` : ''}`
  );
}

function classifySmtpError(err: unknown): { category: EmailErrorCode; detail: string; safeUserMessage: string } {
  const rawMsg = err instanceof Error ? err.message : String(err || '');
  const code = (err as { code?: string })?.code || '';
  const response = (err as { response?: string })?.response || '';
  const responseCode = (err as { responseCode?: number })?.responseCode || 0;

  // 1. Authentication failures (535, EAUTH, BadCredentials, Invalid login)
  if (
    code === 'EAUTH' ||
    responseCode === 535 ||
    response.includes('535') ||
    /badcredentials|username and password not accepted|invalid login|auth/i.test(rawMsg)
  ) {
    return {
      category: 'SMTP_AUTH_ERROR',
      detail:
        'SMTP authentication failed. If using Gmail, ensure 2-Step Verification is enabled and a 16-character Google App Password is used as EMAIL_PASS (not your normal Google account password).',
      safeUserMessage: "We couldn't send the verification email right now. Please try again in a moment.",
    };
  }

  // 2. Connection / Network failures (timeout, DNS, connection refused, reset)
  if (
    code === 'ESOCKET' ||
    code === 'ETIMEDOUT' ||
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'EHOSTUNREACH' ||
    code === 'ECONNRESET' ||
    /timeout|connect econnrefused|getaddrinfo/i.test(rawMsg)
  ) {
    return {
      category: 'SMTP_CONNECTION_ERROR',
      detail: `Failed to connect to SMTP server at ${code || 'Connection issue'}. Verify outbound network access and port.`,
      safeUserMessage: "We couldn't send the verification email right now. Please try again in a moment.",
    };
  }

  // 3. Invalid recipient
  if (
    code === 'EENVELOPE' ||
    responseCode === 550 ||
    responseCode === 553 ||
    /recipient|mailbox not found|no such user/i.test(rawMsg)
  ) {
    return {
      category: 'INVALID_RECIPIENT',
      detail: 'Recipient address rejected by mail server.',
      safeUserMessage:
        'The email address could not receive verification messages. Please check for typos or enter a different email address.',
    };
  }

  // 4. Other send errors
  return {
    category: 'EMAIL_SEND_ERROR',
    detail: `SMTP delivery error: ${rawMsg.slice(0, 120)}`,
    safeUserMessage: "We couldn't send the verification email right now. Please try again in a moment.",
  };
}

function createTransporter(creds: SmtpCredentials): Transporter {
  return nodemailer.createTransport({
    host: creds.smtpHost,
    port: creds.smtpPort,
    secure: creds.smtpSecure,
    auth: {
      user: creds.emailUser,
      pass: creds.emailPass,
    },
    // Serverless optimization: disable pooling to prevent stale socket errors across cold starts
    pool: false,
    connectionTimeout: 10000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
  });
}

/**
 * Diagnostic utility to verify SMTP credentials and connectivity
 */
export async function verifySmtpConfig(): Promise<{
  success: boolean;
  category?: EmailErrorCode;
  message: string;
  diagnostics: {
    hasUser: boolean;
    hasPass: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
  };
}> {
  const creds = getEmailCredentials();
  const diagnostics = {
    hasUser: creds.hasUser,
    hasPass: creds.hasPass,
    smtpHost: creds.smtpHost,
    smtpPort: creds.smtpPort,
    smtpSecure: creds.smtpSecure,
  };

  if (!creds.hasUser || !creds.hasPass) {
    return {
      success: false,
      category: 'EMAIL_CONFIG_MISSING',
      message: `Missing ${!creds.hasUser ? 'EMAIL_USER' : ''}${!creds.hasUser && !creds.hasPass ? ' and ' : ''}${!creds.hasPass ? 'EMAIL_PASS' : ''} in environment variables.`,
      diagnostics,
    };
  }

  try {
    const transporter = createTransporter(creds);
    await transporter.verify();
    return {
      success: true,
      message: 'SMTP configuration verified successfully.',
      diagnostics,
    };
  } catch (err) {
    const classified = classifySmtpError(err);
    logSmtpDiagnostics('verifySmtpConfig', {
      category: classified.category,
      hasUser: creds.hasUser,
      hasPass: creds.hasPass,
      smtpHost: creds.smtpHost,
      smtpPort: creds.smtpPort,
      errorSnippet: classified.detail,
    });
    return {
      success: false,
      category: classified.category,
      message: classified.detail,
      diagnostics,
    };
  }
}

export async function sendOtpEmail({
  to,
  otp,
  parentName = 'Parent',
  purpose = 'register',
  expiresInMinutes = 10,
}: SendOtpEmailOptions): Promise<SendOtpEmailResult> {
  const creds = getEmailCredentials();
  const isProd = process.env.NODE_ENV === 'production';

  if (!creds.hasUser || !creds.hasPass) {
    const missingVar =
      !creds.hasUser && !creds.hasPass
        ? 'EMAIL_USER and EMAIL_PASS'
        : !creds.hasUser
        ? 'EMAIL_USER'
        : 'EMAIL_PASS';

    logSmtpDiagnostics('sendOtpEmail', {
      category: 'EMAIL_CONFIG_MISSING',
      hasUser: creds.hasUser,
      hasPass: creds.hasPass,
      smtpHost: creds.smtpHost,
      smtpPort: creds.smtpPort,
      errorSnippet: `Missing environment variable(s): ${missingVar}`,
    });

    if (isProd) {
      return {
        success: false,
        category: 'EMAIL_CONFIG_MISSING',
        error: "We couldn't send the verification email right now. Please try again in a moment.",
      };
    } else {
      // In local development, allow developer testing with console notice
      console.warn(
        `[DEVELOPMENT NOTICE] ${missingVar} not set in local environment. Dev OTP for ${to}: ${otp}`
      );
      return {
        success: true,
        devMode: true,
      };
    }
  }

  try {
    const transporter = createTransporter(creds);

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

    await transporter.sendMail({
      from: creds.smtpFrom,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    const maskedTo = to.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    console.log(`[EMAIL_SUCCESS] Verification code dispatched to ${maskedTo} via ${creds.smtpHost}`);

    return { success: true };
  } catch (err: unknown) {
    const classified = classifySmtpError(err);
    logSmtpDiagnostics('sendOtpEmail', {
      category: classified.category,
      hasUser: creds.hasUser,
      hasPass: creds.hasPass,
      smtpHost: creds.smtpHost,
      smtpPort: creds.smtpPort,
      errorSnippet: classified.detail,
    });

    return {
      success: false,
      category: classified.category,
      error: classified.safeUserMessage,
    };
  }
}

export interface AdmissionAlertEmailItem {
  schoolName: string;
  slug: string;
  deadlineDate: string;
  daysRemaining: number;
  process?: string;
  area?: string;
  verifiedFee?: number;
}

export interface SendAdmissionAlertEmailOptions {
  to: string;
  parentName?: string;
  alerts: AdmissionAlertEmailItem[];
}

export async function sendAdmissionDeadlineAlertEmail({
  to,
  parentName = 'Parent',
  alerts,
}: SendAdmissionAlertEmailOptions): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  const creds = getEmailCredentials();
  const isProd = process.env.NODE_ENV === 'production';

  if (!creds.hasUser || !creds.hasPass) {
    if (isProd) {
      return {
        success: false,
        error: 'Email notification service is not configured on the server. Please check EMAIL_USER and EMAIL_PASS.',
      };
    } else {
      console.warn(
        `[DEVELOPMENT NOTICE] EMAIL_USER / EMAIL_PASS not configured in local environment. Simulated admission alert for ${to} (${alerts.length} schools within 7-day deadline).`
      );
      return {
        success: true,
        devMode: true,
      };
    }
  }

  try {
    const transporter = createTransporter(creds);
    const urgentCount = alerts.length;
    const subject = `⚠️ Admission Deadline Alert: ${urgentCount} Shortlisted School${urgentCount > 1 ? 's' : ''} Closing Within 7 Days`;

    const schoolRowsHtml = alerts
      .map(
        item => `
      <div style="background-color: #ffffff; border: 1px solid #fed7aa; border-left: 4px solid #f97316; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0;">${item.schoolName}</h3>
          <span style="display: inline-block; background-color: #fff7ed; color: #c2410c; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; border: 1px solid #ffedd5;">
            ${item.daysRemaining <= 0 ? 'Closes Today' : `${item.daysRemaining} days remaining`}
          </span>
        </div>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 6px 0;">
          <strong>Deadline Date:</strong> ${item.deadlineDate} • <strong>Location:</strong> ${item.area || 'Greater Noida West'}
        </p>
        ${item.process ? `<p style="font-size: 12px; color: #475569; margin: 0 0 8px 0;"><em>${item.process}</em></p>` : ''}
        ${item.verifiedFee ? `<p style="font-size: 12px; color: #047857; margin: 0 0 8px 0;"><strong>Verified First Year Fee:</strong> ₹${item.verifiedFee.toLocaleString('en-IN')}</p>` : ''}
        <a href="https://admissionpitara.com/schools/${item.slug}" style="display: inline-block; font-size: 12px; font-weight: 700; color: #1e3a8a; text-decoration: none;">
          View School Profile & Admissions &rarr;
        </a>
      </div>
    `
      )
      .join('');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf8f5; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background-color: #1e3a8a; padding: 24px 32px; text-align: left; border-bottom: 3px solid #f97316;">
      <div style="display: inline-block; background-color: #ffffff; color: #1e3a8a; font-weight: 900; font-size: 12px; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em; margin-bottom: 8px;">
        ADMISSION PITARA
      </div>
      <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; line-height: 1.3;">
        Urgent Admission Deadline Alert
      </h1>
      <p style="color: #cbd5e1; font-size: 13px; margin: 4px 0 0 0;">
        Greater Noida West School Admissions 2026-2027
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px;">
      <p style="font-size: 15px; line-height: 1.5; color: #334155; margin: 0 0 16px 0;">
        Dear <strong>${parentName}</strong>,
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        You have <strong>${urgentCount} school${urgentCount > 1 ? 's' : ''}</strong> in your saved shortlist with application or verification deadlines approaching within <strong>7 days</strong>. Please submit required documents and complete the school forms before registrations conclude:
      </p>

      <!-- Schools List -->
      ${schoolRowsHtml}

      <!-- Next Steps Notice -->
      <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 14px 16px; margin: 24px 0 16px 0;">
        <h4 style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0;">Recommended Next Steps:</h4>
        <ul style="font-size: 12px; color: #64748b; margin: 0; padding-left: 18px; line-height: 1.6;">
          <li>Review audited fee breakdowns and seat availability on Admission Pitara.</li>
          <li>Prepare mandatory child documents (Birth Certificate, Address Proof, Recent Photos).</li>
          <li>Submit online applications directly through the school portal links.</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">
        Admission Pitara • Independent Directory &amp; Audited Fees for Greater Noida West
      </p>
      <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
        You received this notification because you shortlisted these schools in your parent account.
      </p>
    </div>

  </div>
</body>
</html>
    `.trim();

    const textContent = `
Urgent Admission Deadline Alert - Admission Pitara

Dear ${parentName},

You have ${urgentCount} school(s) in your saved shortlist with registration or interaction deadlines within the next 7 days:

${alerts.map(a => `- ${a.schoolName}: ${a.deadlineDate} (${a.daysRemaining <= 0 ? 'Closes Today' : `${a.daysRemaining} days left`}) - Process: ${a.process || 'Online application'}`).join('\n')}

Review verified fees and application guides at: https://admissionpitara.com/dashboard

Admission Pitara - Greater Noida West
    `.trim();

    await transporter.sendMail({
      from: creds.smtpFrom,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown SMTP delivery error';
    console.error('Failed to send admission deadline alert email:', errorMsg);
    return {
      success: false,
      error: `Failed to deliver admission deadline alert email: ${errorMsg}`,
    };
  }
}

