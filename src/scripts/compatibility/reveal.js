export function initReveal() {
  const items = document.querySelectorAll('.rk-card, .rk-imported-content section, .rk-imported-content .container');

  if (!items.length || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' }
  );

  items.forEach((item) => {
    item.classList.add('rk-reveal');
    observer.observe(item);
  });
}
