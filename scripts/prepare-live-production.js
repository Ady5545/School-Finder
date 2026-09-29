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
