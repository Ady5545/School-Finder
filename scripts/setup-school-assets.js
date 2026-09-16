const fs = require('fs');
const path = require('path');

const schools = JSON.parse(fs.readFileSync('./data/schools.json', 'utf8'));

const sourceFeatured = './public/assets/schools/delhi-world-public-school-kp-5/featured/featured.jpeg';
const sourceHero = './public/assets/schools/delhi-world-public-school-kp-5/hero/hero.jpg';

const sampleFeaturedBuf = fs.readFileSync(sourceFeatured);
const sampleHeroBuf = fs.readFileSync(sourceHero);

schools.forEach(s => {
  const frontDirFeat = path.join('./public/assets/schools', s.slug, 'featured');
  const frontDirHero = path.join('./public/assets/schools', s.slug, 'hero');
  const backDirFeat = path.join('./school-website-backend/public/assets/schools', s.slug, 'featured');
  const backDirHero = path.join('./school-website-backend/public/assets/schools', s.slug, 'hero');

  [frontDirFeat, frontDirHero, backDirFeat, backDirHero].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const featFile = path.join(frontDirFeat, 'featured.jpg');
  const heroFile = path.join(frontDirHero, 'hero.jpg');
  const backFeatFile = path.join(backDirFeat, 'featured.jpg');
  const backHeroFile = path.join(backDirHero, 'hero.jpg');

  // Check if existing featured exists in frontDirFeat
  const existingFrontFeat = fs.readdirSync(frontDirFeat);
  if (existingFrontFeat.length === 0) {
    fs.writeFileSync(featFile, sampleFeaturedBuf);
    fs.writeFileSync(backFeatFile, sampleFeaturedBuf);
    s.assets.featured = `/assets/schools/${s.slug}/featured/featured.jpg`;
  } else {
    // Keep whatever existing format
    s.assets.featured = `/assets/schools/${s.slug}/featured/${existingFrontFeat[0]}`;
    if (!fs.existsSync(backFeatFile)) {
      const existingBuf = fs.readFileSync(path.join(frontDirFeat, existingFrontFeat[0]));
      fs.writeFileSync(path.join(backDirFeat, existingFrontFeat[0]), existingBuf);
    }
  }

  const existingFrontHero = fs.readdirSync(frontDirHero);
  if (existingFrontHero.length === 0) {
    fs.writeFileSync(heroFile, sampleHeroBuf);
    fs.writeFileSync(backHeroFile, sampleHeroBuf);
    s.assets.hero = `/assets/schools/${s.slug}/hero/hero.jpg`;
  } else {
    s.assets.hero = `/assets/schools/${s.slug}/hero/${existingFrontHero[0]}`;
    if (!fs.existsSync(backHeroFile)) {
      const existingHeroBuf = fs.readFileSync(path.join(frontDirHero, existingFrontHero[0]));
      fs.writeFileSync(path.join(backDirHero, existingFrontHero[0]), existingHeroBuf);
    }
  }
});

// Update data/schools.json
fs.writeFileSync('./data/schools.json', JSON.stringify(schools, null, 2), 'utf8');
console.log('Successfully configured assets for all', schools.length, 'schools.');
