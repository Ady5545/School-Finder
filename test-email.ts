import { sendOtpEmail } from './src/lib/emailService';

async function test() {
  console.log("Starting test email...");
  const res = await sendOtpEmail({
    to: 'testparent@example.com',
    otp: '123456',
    parentName: 'Test Parent',
    purpose: 'register'
  });
  console.log(res);
}

test().catch(console.error);
