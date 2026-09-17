const emailUser = (process.env.EMAIL_USER || process.env.SMTP_USER || '').trim();
console.log("EMAIL_USER:", emailUser === 'admissionpitara@gmail.com' ? 'correct' : emailUser);
