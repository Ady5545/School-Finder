const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/components/layout/ScrollRevealManager.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The main issue might be that elements are rendering and immediately intersecting 
// or root margin is wrong.
// We want to remove the rect.top < vh - 40 logic and let the observer handle everything.
// And we'll just add `is-pending` to all elements that are below the viewport 
// BUT we should do it safely. Actually, the easiest way to ensure they don't reveal early 
// is to check if they are truly below the viewport.

// Let's replace scanAndObserve and observer setup.
const replaceBlock = `    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);
            el.classList.remove('is-pending');
            el.classList.add('is-revealed');
            // Calculate exact settle duration based on stagger delay + animation duration
            const delayAttr = el.getAttribute('data-reveal-delay');
            const delayIdx = delayAttr ? Math.max(0, parseInt(delayAttr, 10) || 0) : 0;
            const settleDuration = 680 + (delayIdx * 90) + 100;
            setTimeout(() => {
              el.classList.add('is-settled');
            }, settleDuration);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const scanAndObserve = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
      elements.forEach((el) => {
        // If already settled or revealed, skip
        if (el.classList.contains('is-settled') || el.classList.contains('is-revealed')) {
          return;
        }

        const rect = el.getBoundingClientRect();
        // If already armed and observed, do not eagerly reveal in mutationObserver/rescan
        if (el.classList.contains('is-pending')) {
          return;
        }

        // Only reveal immediately if already visible inside initial viewport on mount
        if (rect.top < vh - 40 && rect.bottom > 0) {
          el.classList.remove('is-pending');
          el.classList.add('is-revealed', 'is-settled');
        } else {
          // Strictly below the viewport: arm for progressive reveal on scroll
          el.classList.add('is-pending');
          observer.observe(el);
        }
      });
    };`;

const newBlock = `    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            observer.unobserve(el);
            
            // Small delay to ensure it actually paints before removing pending
            requestAnimationFrame(() => {
              el.classList.remove('is-pending');
              el.classList.add('is-revealed');
              
              const delayAttr = el.getAttribute('data-reveal-delay');
              const delayIdx = delayAttr ? Math.max(0, parseInt(delayAttr, 10) || 0) : 0;
              const settleDuration = 800 + (delayIdx * 90) + 100;
              
              setTimeout(() => {
                el.classList.add('is-settled');
              }, settleDuration);
            });
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const scanAndObserve = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
      
      elements.forEach((el) => {
        if (el.classList.contains('is-settled') || el.classList.contains('is-revealed')) return;
        if (el.classList.contains('is-pending')) return;

        const rect = el.getBoundingClientRect();
        
        // Ensure strictly below the fold
        if (rect.top > vh - 50) {
          el.classList.add('is-pending');
          observer.observe(el);
        } else {
          // Already above fold on load
          el.classList.remove('is-pending');
          el.classList.add('is-revealed', 'is-settled');
        }
      });
    };`;

content = content.replace(replaceBlock, newBlock);

fs.writeFileSync(filePath, content);
console.log('Done scroll manager');
