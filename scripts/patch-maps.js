const fs = require('fs');
const path = require('path');

// 1. DirectoryInteractiveMap.tsx
let dirMapPath = path.join(__dirname, '../src/components/school/DirectoryInteractiveMap.tsx');
let dirMap = fs.readFileSync(dirMapPath, 'utf8');

// The original logic:
// const validSchools = useMemo(() => {
//   return schools.map(s => {
//     const lat = s.location.coordinates?.lat;
//     const lng = s.location.coordinates?.lng;
//     return { ...s, _mapCoords: { lat: lat || 28.58, lng: lng || 77.45 } };
//   });
// }, [schools]);

// Change to filter out schools without coordinates
dirMap = dirMap.replace(
  /const validSchools = useMemo\(\(\) => \{[\s\S]*?return \{ \.\.\.s, _mapCoords: \{ lat: lat \|\| 28\.58, lng: lng \|\| 77\.45 \} \};[\s\S]*?\}, \[schools\]\);/,
  `const validSchools = useMemo(() => {
    return schools
      .filter(s => s.location.coordinates && typeof s.location.coordinates.lat === 'number')
      .map(s => {
        return { ...s, _mapCoords: { lat: s.location.coordinates.lat, lng: s.location.coordinates.lng } };
      });
  }, [schools]);`
);
fs.writeFileSync(dirMapPath, dirMap);

// 2. CampusInteractiveMap.tsx
let capMapPath = path.join(__dirname, '../src/components/school/CampusInteractiveMap.tsx');
let capMap = fs.readFileSync(capMapPath, 'utf8');

// original:
//  const lat = school.location.coordinates?.lat || 28.58;
//  const lng = school.location.coordinates?.lng || 77.45;

capMap = capMap.replace(
  /const lat = school\.location\.coordinates\?\.lat \|\| 28\.58;\s*const lng = school\.location\.coordinates\?\.lng \|\| 77\.45;/,
  `const lat = school.location.coordinates?.lat;
  const lng = school.location.coordinates?.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl border border-slate-200">
        <p className="text-sm font-medium">Map coordinates pending verification.</p>
      </div>
    );
  }`
);
fs.writeFileSync(capMapPath, capMap);
console.log('Map patches done');
