const fs = require('fs');

const schoolsJson = fs.readFileSync('./data/schools.json', 'utf8');
const legacyUrlMapJson = fs.readFileSync('./data/legacyUrlMap.json', 'utf8');

const jsContent = `// Canonical schools data for backend services & test validation
const schools = ${schoolsJson};

const legacyUrlMap = ${legacyUrlMapJson};

function getSchoolBySlug(slug) {
  return schools.find(s => s.slug === slug) || null;
}

function resolveLegacyUrl(url) {
  const normalized = (url || '').trim().replace(/^\\//, '');
  const slug = legacyUrlMap[normalized] || legacyUrlMap['/' + normalized] || legacyUrlMap[url] || null;
  return slug ? getSchoolBySlug(slug) : null;
}

module.exports = {
  schools,
  legacyUrlMap,
  getSchoolBySlug,
  resolveLegacyUrl,
};
`;

fs.writeFileSync('./school-website-backend/data/schoolsData.js', jsContent, 'utf8');
console.log('Successfully updated school-website-backend/data/schoolsData.js');
