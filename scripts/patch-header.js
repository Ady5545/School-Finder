const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/components/layout/Header.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('<Link href="/schools">', '<Link href="/schools?focus=true">');
content = content.replace('<Link href="/schools" aria-label="Search schools">', '<Link href="/schools?focus=true" aria-label="Search schools">');

fs.writeFileSync(filePath, content);
console.log('Done header patch');
