/** Progressive enhancement: content is always visible, including without JavaScript. */
export function initSiteMotion() {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const active = new Set<Animation>();
  // Browsers without native page-reveal transitions still get a short arrival fade.
  // Normal links, history, focus and scroll restoration remain browser-owned.
  if (!Reflect.has(window, 'onpagereveal')) {
    window.addEventListener('pageshow', event => {
      if (preference.matches || event.persisted) return;
      const main = document.querySelector('main');
      if (!main) return;
      const animation = main.animate([{ opacity: .8 }, { opacity: 1 }], { duration: 220 });
      active.add(animation);
      animation.finished.then(() => active.delete(animation), () => active.delete(animation));
    }, { once: true });
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (preference.matches) continue;
      const animation = entry.target.animate(
        [{ opacity: .88, translate: '0 8px' }, { opacity: 1, translate: '0 0' }],
        { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
      active.add(animation);
      animation.finished.then(() => active.delete(animation), () => active.delete(animation));
    }
  }, { threshold: .06 });
  // Only below-fold sections: never delay the hero, LCP image, or reading a deep link.
  for (const section of document.querySelectorAll('main section')) {
    if (section.parentElement?.closest('main section')) continue;
    if (section.getBoundingClientRect().top > innerHeight) observer.observe(section);
  }
  const cancel = () => {
    observer.disconnect();
    for (const animation of active) animation.cancel();
    active.clear();
  };
  preference.addEventListener('change', cancel);
  window.addEventListener('pagehide', cancel, { once: true });
}

