const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/school/SchoolDirectory.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
content = content.replace("import { useSchoolStore }", "import { useRouter, usePathname, useSearchParams } from 'next/navigation';\nimport { useSchoolStore }");

// 2. Add useEffect for URL sync
const hookStart = "  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);";
const urlSyncLogic = `
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedBoard) params.set('board', selectedBoard);
    if (selectedArea) params.set('area', selectedArea);
    if (selectedFeeTier !== 'all') params.set('fee', selectedFeeTier);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    
    const newUrl = \`\${pathname}\${params.toString() ? '?' + params.toString() : ''}\`;
    // We use window.history.replaceState to avoid triggering a full Next.js navigation cycle for every keystroke, keeping it fast and purely client-side while still preserving the URL.
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedBoard, selectedArea, selectedFeeTier, sortBy, pathname]);
`;
content = content.replace(hookStart, hookStart + '\n' + urlSyncLogic);

// 3. Layout changes
// Find:
//      {/* Interactive Map Component with Proximity Filtering */}
//      {showMap && (
//        <DirectoryInteractiveMap

// We want to replace the whole sequence of Map -> Header -> Results with a flex container.
const replaceStart = "      {/* Interactive Map Component with Proximity Filtering */}";
const replaceEnd = "      {/* Floating Action Button: Back to Top */}";

const mainContent = content.substring(content.indexOf(replaceStart), content.indexOf(replaceEnd));

// Parse the content carefully
const newLayout = `
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 lg:w-3/5 xl:w-2/3 flex flex-col order-2 lg:order-1">
          {/* Results Header Status */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-[var(--color-content)]">
                {filteredSchools.length} {filteredSchools.length === 1 ? 'School' : 'Schools'} Found
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-xs bg-[var(--color-accent-light)] text-[var(--color-accent)] font-bold px-2.5 py-0.5 rounded-full border border-[var(--color-accent)]/20">
                  {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
                </span>
              )}
              {selectedRadiusKm && proximityCoords && (
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  Within {selectedRadiusKm} km
                </span>
              )}
              {sortBy === 'rating' && (
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>Top Rated</span>
                  <button
                    type="button"
                    onClick={() => setSortBy('featured')}
                    className="ml-1 text-amber-800 hover:text-amber-950 p-0.5 transition-colors cursor-pointer"
                    title="Reset to default order"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>
            
            {/* Mobile Map Toggle */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer",
                  showMap ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs" : "bg-white text-[var(--color-primary)] border-[var(--color-primary)]/30 hover:border-[var(--color-primary)]"
                )}
              >
                <MapPin className="w-3.5 h-3.5" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>
          
          {/* Promoted / Sponsored Partner Placement if Active */}
          <SponsoredPlacementCard placement="featured_card" className="mb-6" />

          {/* Results Grid / List */}
          {filteredSchools.length > 0 ? (
            <div
              className={cn(
                'gap-6',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
                  : 'flex flex-col space-y-4'
              )}
            >
              {filteredSchools.map((school, index) => (
                <div
                  key={school.id}
                  className="reveal-on-scroll"
                  data-reveal-delay={String((index % 3) + 1)}
                >
                  <SchoolCard
                    school={school}
                    distanceKm={schoolDistances.get(school.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No schools match your filters"
              description="Try broadening your sector selection, changing fee ranges, expanding proximity radius, or clearing search criteria to view all available institutions."
              actionLabel="Clear All Filters"
              onAction={resetAllFilters}
            />
          )}
        </div>
        
        <div className={cn("w-full lg:w-2/5 xl:w-1/3 order-1 lg:order-2", !showMap && "hidden lg:block")}>
          <div className="sticky top-24">
            {/* Interactive Map Component with Proximity Filtering */}
            <DirectoryInteractiveMap
              schools={initialSchools}
              selectedProximityArea={selectedProximityArea}
              selectedRadiusKm={selectedRadiusKm}
              onProximityChange={handleProximityChange}
              activeSchoolSlug={activeMapSchoolSlug}
              onSelectSchool={school => setActiveMapSchoolSlug(school.slug)}
            />
          </div>
        </div>
      </div>
`;
content = content.replace(mainContent, newLayout);

fs.writeFileSync(filePath, content);
console.log('SchoolDirectory layout patched');
