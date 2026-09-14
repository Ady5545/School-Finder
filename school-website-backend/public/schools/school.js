// ====== AOS Init ======
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') AOS.init({ duration: 1000, once: true });

  // ====== Wishlist Heart Toggle ======
  document.querySelectorAll('.wishlist .heart').forEach(heart => {
      heart.addEventListener('click', () => {
          if (heart.classList.contains('added')) {
              heart.classList.remove('added');
              heart.style.stroke = "#ccc";
          } else {
              heart.classList.add('added');
              heart.style.stroke = "red";
          }
      });
  });

  // ====== Gallery Scroll (Left/Right Buttons) ======
  document.querySelectorAll('.school-gallery-container').forEach(container => {
      const gallery = container.querySelector('.school-gallery');
      const prev = container.querySelector('.gallery-btn.left');
      const next = container.querySelector('.gallery-btn.right');

      if (next && prev && gallery) {
          next.addEventListener('click', () => {
              gallery.scrollBy({ left: 300, behavior: 'smooth' });
          });

          prev.addEventListener('click', () => {
              gallery.scrollBy({ left: -300, behavior: 'smooth' });
          });
      }
  });

  // ====== Fullscreen Gallery Viewer ======
  document.querySelectorAll('.school-gallery-container').forEach(container => {
      const galleryImages = container.querySelectorAll('.school-gallery img');
      const viewer = container.querySelector('#galleryViewer');
      const viewerImg = container.querySelector('#viewerImg');
      const closeViewer = container.querySelector('#closeViewer');

      if (viewer && viewerImg && closeViewer) {
          galleryImages.forEach(img => {
              img.addEventListener('click', () => {
                  viewer.style.display = "flex";
                  viewerImg.src = img.src;
              });
          });

          closeViewer.addEventListener('click', () => {
              viewer.style.display = "none";
          });

          // Close on clicking outside the image
          viewer.addEventListener('click', (e) => {
              if (e.target === viewer) viewer.style.display = "none";
          });
      }
  });
});