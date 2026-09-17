const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/components/school/SchoolDirectory.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the URL sync effect and state initialization
// We need to sync state FROM URL when URL changes via back/forward
const oldEffect = `  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedBoard) params.set('board', selectedBoard);
    if (selectedArea) params.set('area', selectedArea);
    if (selectedFeeTier !== 'all') params.set('fee', selectedFeeTier);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    const newUrl = \\\`\\\${pathname}\\\${params.toString() ? '?' + params.toString() : ''}\\\`;
    // We use window.history.replaceState to avoid triggering a full Next.js navigation cycle for every keystroke, keeping it fast and purely client-side while still preserving the URL.
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedBoard, selectedArea, selectedFeeTier, sortBy, pathname]);`;

const newEffect = `
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedBoard) params.set('board', selectedBoard);
    if (selectedArea) params.set('area', selectedArea);
    if (selectedFeeTier !== 'all') params.set('fee', selectedFeeTier);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    const newUrl = \`\${pathname}\${params.toString() ? '?' + params.toString() : ''}\`;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedBoard, selectedArea, selectedFeeTier, sortBy, pathname]);

  React.useEffect(() => {
    // Read from search params when they change (e.g. user hits back button)
    // but don't overwrite if it's our own replaceState (we don't get a re-render from replaceState anyway)
    setSearchQuery(searchParams.get('q') || '');
    setSelectedBoard(searchParams.get('board') || '');
    setSelectedArea(searchParams.get('area') || '');
    setSelectedFeeTier(searchParams.get('fee') || 'all');
    
    const sortParam = searchParams.get('sort');
    if (sortParam === 'featured' || sortParam === 'name' || sortParam === 'fee-asc' || sortParam === 'fee-desc' || sortParam === 'rating' || sortParam === 'distance') {
       setSortBy(sortParam);
    }
    
    if (searchParams.get('focus') === 'true') {
       // Focus search input
       const searchInput = document.getElementById('main-school-search');
       if (searchInput) {
          searchInput.focus();
       }
    }
  }, [searchParams]);
`;

content = content.replace(oldEffect.replace(/\\\`/g, '`'), newEffect);

// Add id to search input
content = content.replace('type="text"', 'id="main-school-search"\n              type="text"');

fs.writeFileSync(filePath, content);
console.log('Done sync');
