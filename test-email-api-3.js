const http = require('http');
const data = JSON.stringify({ email: "knightdaygamingyt@gmail.com", purpose: "register", name: "Test User" });
const req = http.request({
  hostname: 'localhost', port: 3000, path: '/api/auth/send-otp', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});
req.on('error', e => console.error('Error:', e.message));
req.write(data); req.end();
