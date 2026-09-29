const fs = require('fs');
const path = require('path');

function patch(file, transform) {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const next = transform(content);
  if (next !== content) {
    fs.writeFileSync(filePath, next);
    console.log(`patched ${file}`);
  } else {
    console.log(`already patched ${file}`);
  }
}

patch('src/components/school/SchoolDirectory.tsx', content => {
  if (!content.includes('const getExactSectorQuery =')) {
    const anchor = "  // Helper to match search query across name, alternateNames, location, board, tagline, summary, sports\n";
    const helper = `  const getExactSectorQuery = (query: string): number | null => {\n    const match = query.trim().match(/^sector\\s*[-#]?\\s*(\\d+)$/i);\n    return match ? Number(match[1]) : null;\n  };\n\n`;
    content = content.replace(anchor, helper + anchor);
  }

  const oldSector = "      (school.location?.sector || '').toLowerCase().includes(q) ||";
  const newSector = `      (getExactSectorQuery(q) !== null\n        ? /\\bsector\\s*[-#]?\\s*(\\d+)\\b/i.test(school.location?.sector || '') && Number((school.location?.sector || '').match(/\\bsector\\s*[-#]?\\s*(\\d+)\\b/i)?.[1]) === getExactSectorQuery(q)\n        : (school.location?.sector || '').toLowerCase().includes(q)) ||`;
  if (content.includes(oldSector)) content = content.replace(oldSector, newSector);

  if (!content.includes('const nearbySectorSuggestions = useMemo')) {
    const anchor = `  const activeFiltersCount =\n`;
    const helper = `  const nearbySectorSuggestions = useMemo(() => {\n    if (filteredSchools.length > 0) return [];\n    const targetSector = getExactSectorQuery(searchQuery);\n    if (targetSector === null) return [];\n\n    const ranked = initialSchools\n      .filter(school => {\n        const match = (school.location?.sector || '').match(/\\bsector\\s*[-#]?\\s*(\\d+)\\b/i);\n        if (!match) return false;\n        const sectorNumber = Number(match[1]);\n        const difference = Math.abs(sectorNumber - targetSector);\n        return difference > 0 && difference <= 25;\n      })\n      .sort((a, b) => {\n        const sectorA = Number((a.location?.sector || '').match(/\\bsector\\s*[-#]?\\s*(\\d+)\\b/i)?.[1] || 9999);\n        const sectorB = Number((b.location?.sector || '').match(/\\bsector\\s*[-#]?\\s*(\\d+)\\b/i)?.[1] || 9999);\n        return Math.abs(sectorA - targetSector) - Math.abs(sectorB - targetSector);\n      })\n      .slice(0, 6);\n\n    return ranked;\n  }, [filteredSchools.length, initialSchools, searchQuery]);\n\n`;
    content = content.replace(anchor, helper + anchor);
  }

  const oldEmpty = `          ) : (\n            <EmptyState\n              title="No schools match your filters"\n              description="No schools match all your active search and filter criteria. Try clearing some filters or broadening your search parameters."\n              actionLabel="Clear All Filters"\n              onAction={resetAllFilters}\n            />\n          )}`;
  const newEmpty = `          ) : nearbySectorSuggestions.length > 0 ? (\n            <div className="space-y-5">\n              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">\n                <div className="text-sm font-black text-slate-900">No exact schools found for “{searchQuery}”</div>\n                <p className="text-xs sm:text-sm text-slate-600 mt-1.5">We don’t want to leave you at a dead end. Here are schools in nearby numbered sectors from our current directory.</p>\n              </div>\n              <div>\n                <div className="flex items-center justify-between mb-3">\n                  <h3 className="text-base font-black text-[var(--color-content)]">Nearby schools to explore</h3>\n                  <span className="text-[11px] font-bold text-slate-400">Based on sector proximity</span>\n                </div>\n                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">\n                  {nearbySectorSuggestions.map((school, index) => (\n                    <div key={school.id} className="reveal-on-scroll" data-reveal-delay={String((index % 3) + 1)}>\n                      <SchoolCard school={school} distanceKm={schoolDistances.get(school.id)} />\n                    </div>\n                  ))}\n                </div>\n              </div>\n              <button type="button" onClick={resetAllFilters} className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-black shadow-warm-xs hover:opacity-95">\n                Show all listed schools\n              </button>\n            </div>\n          ) : (\n            <EmptyState\n              title="No exact schools found"\n              description="We couldn’t find an exact match for this search. Try a broader area, school name, or clear the search to explore all listed schools."\n              actionLabel="Show All Listed Schools"\n              onAction={resetAllFilters}\n            />\n          )}`;
  if (content.includes(oldEmpty)) content = content.replace(oldEmpty, newEmpty);
  return content;
});

patch('src/app/admin/page.tsx', content => {
  const anchor = `  useEffect(() => {\n    if (isAuthenticated && activeTab !== 'overview') {\n      void fetchTabData(activeTab);\n    }\n  }, [activeTab, isAuthenticated]);\n`;
  if (!content.includes('const ADMIN_REALTIME_REFRESH_MS =')) {
    const addition = `\n  const ADMIN_REALTIME_REFRESH_MS = 15000;\n\n  useEffect(() => {\n    if (!isAuthenticated) return;\n    const timer = window.setInterval(() => {\n      void fetchTabData(activeTab, true);\n    }, ADMIN_REALTIME_REFRESH_MS);\n    return () => window.clearInterval(timer);\n  }, [activeTab, isAuthenticated, timeRange]);\n`;
    content = content.replace(anchor, anchor + addition);
  }
  return content;
});

patch('src/components/admin/SchoolManagerTab.tsx', content => {
  const anchor = `  useEffect(() => {\n    const timer = window.setTimeout(() => void loadSchools(), 180);\n    return () => window.clearTimeout(timer);\n  }, [loadSchools]);\n`;
  if (!content.includes('DIRECTORY_REALTIME_REFRESH_MS')) {
    const addition = `\n  const DIRECTORY_REALTIME_REFRESH_MS = 12000;\n\n  useEffect(() => {\n    const timer = window.setInterval(() => {\n      void loadSchools(true, true);\n    }, DIRECTORY_REALTIME_REFRESH_MS);\n    return () => window.clearInterval(timer);\n  }, [loadSchools]);\n`;
    content = content.replace(anchor, anchor + addition);
  }
  return content;
});
