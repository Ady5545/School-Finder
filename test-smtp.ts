import { getEmailCredentials } from './src/lib/emailService';
import nodemailer from 'nodemailer';

async function test() {
  const creds = getEmailCredentials();
  console.log('hasUser:', creds.hasUser);
  console.log('hasPass:', creds.hasPass);
  
  if (!creds.hasUser || !creds.hasPass) {
    console.error('Credentials missing');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: creds.smtpHost,
    port: creds.smtpPort,
    secure: creds.smtpSecure,
    auth: {
      user: creds.emailUser,
      pass: creds.emailPass,
    },
    pool: false,
  });

  try {
    const success = await transporter.verify();
    console.log('SMTP Verify Success:', success);
  } catch (err) {
    console.error('SMTP Verify Error:', err);
  }
}

test();
