const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcRoot = path.join(root, 'src');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx|ts|jsx|js)$/.test(entry.name) ? [full] : [];
  });
}

const failures = [];
for (const file of walk(srcRoot)) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/<img\b[\s\S]*?>/gi)) {
    if (!/\balt\s*=/.test(match[0])) {
      failures.push(path.relative(root, file) + ': <img> without alt');
    }
  }
}

const layout = fs.readFileSync(path.join(srcRoot, 'app', 'layout.tsx'), 'utf8');
const required = [
  ['CookieConsent', layout.includes('CookieConsent')],
  ['ConsentAwareAnalytics', layout.includes('ConsentAwareAnalytics')],
  ['robots.ts', fs.existsSync(path.join(srcRoot, 'app', 'robots.ts'))],
  ['sitemap.ts', fs.existsSync(path.join(srcRoot, 'app', 'sitemap.ts'))],
  ['opengraph-image.tsx', fs.existsSync(path.join(srcRoot, 'app', 'opengraph-image.tsx'))],
  ['favicon', fs.existsSync(path.join(root, 'public', 'favicon.svg')) || fs.existsSync(path.join(root, 'public', 'favicon.png'))],
];
required.forEach(([name, ok]) => { if (!ok) failures.push('Missing ' + name); });

if (failures.length) {
  console.error('Site polish validation failed:');
  failures.forEach(item => console.error('- ' + item));
  process.exit(1);
}
console.log('Site polish validation passed.');
