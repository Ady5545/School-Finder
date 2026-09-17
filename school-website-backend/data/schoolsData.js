// Canonical schools data for backend services & test validation
// Single source of truth loaded from /data/schools.json & /data/legacyUrlMap.json
const schools = require("../../data/schools.json");
const legacyUrlMap = require("../../data/legacyUrlMap.json");

function getSchoolBySlug(slug) {
  return schools.find(s => s.slug === slug) || null;
}

function resolveLegacyUrl(url) {
  const normalized = (url || "").trim().replace(/^\//, "");
  const slug = legacyUrlMap[normalized] || legacyUrlMap["/" + normalized] || legacyUrlMap[url] || null;
  return slug ? getSchoolBySlug(slug) : null;
}

module.exports = {
  schools,
  legacyUrlMap,
  getSchoolBySlug,
  resolveLegacyUrl,
};
