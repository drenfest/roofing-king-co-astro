function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'rk-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Project gallery image');
  lightbox.innerHTML = `
    <div class="rk-lightbox-backdrop" data-rk-lightbox-close></div>
    <button class="rk-lightbox-close" type="button" aria-label="Close gallery" data-rk-lightbox-close>x</button>
    <button class="rk-lightbox-prev" type="button" aria-label="Previous gallery image" data-rk-lightbox-prev>&lt;</button>
    <figure class="rk-lightbox-figure">
      <img alt="">
      <figcaption></figcaption>
    </figure>
    <button class="rk-lightbox-next" type="button" aria-label="Next gallery image" data-rk-lightbox-next>&gt;</button>
  `;
  document.body.appendChild(lightbox);

  return lightbox;
}

function canAnimateGallery() {
  return (
    typeof Element !== 'undefined'
    && typeof Element.prototype.animate === 'function'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function itemMatchesFilter(item, filter) {
  const tags = (item.dataset.rkGalleryTags || '').split(/\s+/).filter(Boolean);

  return filter === 'all' || tags.includes(filter);
}

function visibleGalleryItems(items) {
  return items.filter((item) => !item.classList.contains('is-hidden'));
}

function animationFinished(animation) {
  return animation.finished.catch(() => undefined);
}

function waitForLayout() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function lockGridHeight(grid, height) {
  if (!grid) {
    return;
  }

  grid.style.height = `${height}px`;
}

function naturalGridHeight(grid) {
  if (!grid) {
    return 0;
  }

  const lockedHeight = grid.style.height;
  grid.style.height = 'auto';
  const height = grid.getBoundingClientRect().height;
  grid.style.height = lockedHeight;

  return height;
}

function initGalleryCrownParallax(gallery) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let frame = 0;

  const update = () => {
    frame = 0;
    const rect = gallery.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom < 0 || rect.top > viewportHeight) {
      return;
    }

    const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)));
    const offsetY = (progress - 0.5) * -220;
    const offsetX = (progress - 0.5) * 84;
    gallery.style.setProperty('--rk-gallery-crown-y', `${offsetY.toFixed(1)}px`);
    gallery.style.setProperty('--rk-gallery-crown-x', `${offsetX.toFixed(1)}px`);
  };

  const requestUpdate = () => {
    if (frame) {
      return;
    }

    frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  requestUpdate();
}

export function initProjectGallery() {
  const galleries = document.querySelectorAll('[data-rk-gallery]');
  const links = document.querySelectorAll('[data-rk-lightbox]');

  galleries.forEach((gallery) => {
    const filterButtons = Array.from(gallery.querySelectorAll('[data-rk-gallery-filter]'));
    const items = Array.from(gallery.querySelectorAll('[data-rk-gallery-item]'));
    const grid = gallery.querySelector('.rk-project-gallery-masonry');
    let filterRun = 0;

    initGalleryCrownParallax(gallery);

    filterButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const filter = button.dataset.rkGalleryFilter || 'all';
        const run = filterRun + 1;
        filterRun = run;

        filterButtons.forEach((candidate) => {
          candidate.classList.toggle('is-active', candidate === button);
          candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
        });

        const matchesByItem = new Map(items.map((item) => [item, itemMatchesFilter(item, filter)]));

        if (!canAnimateGallery()) {
          items.forEach((item) => {
            item.classList.toggle('is-hidden', !matchesByItem.get(item));
          });
          return;
        }

        gallery.classList.add('is-filtering');

        items.forEach((item) => {
          if (typeof item.getAnimations === 'function') {
            item.getAnimations().forEach((animation) => animation.cancel());
          }
        });
        grid?.getAnimations?.().forEach((animation) => animation.cancel());

        const startHeight = grid?.getBoundingClientRect().height || 0;
        const previouslyVisible = visibleGalleryItems(items);
        const previousRects = new Map(previouslyVisible.map((item) => [item, item.getBoundingClientRect()]));
        const exiting = previouslyVisible.filter((item) => !matchesByItem.get(item));

        await Promise.all(exiting.map((item) => {
          return animationFinished(item.animate([
            { opacity: 1 },
            { opacity: 0 },
          ], {
            duration: 240,
            easing: 'ease-out',
            fill: 'forwards',
          }));
        }));

        if (run !== filterRun) {
          return;
        }

        lockGridHeight(grid, startHeight);

        items.forEach((item) => {
          item.classList.toggle('is-hidden', !matchesByItem.get(item));
        });

        await waitForLayout();

        if (run !== filterRun) {
          return;
        }

        const endHeight = naturalGridHeight(grid);
        lockGridHeight(grid, startHeight);

        const heightAnimation = grid && Math.abs(startHeight - endHeight) > 1
          ? grid.animate([
            { height: `${startHeight}px` },
            { height: `${endHeight}px` },
          ], {
            duration: 680,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          })
          : null;

        const moveAnimations = visibleGalleryItems(items).map((item) => {
          const previousRect = previousRects.get(item);
          const currentRect = item.getBoundingClientRect();

          if (previousRect) {
            const deltaX = previousRect.left - currentRect.left;
            const deltaY = previousRect.top - currentRect.top;

            if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
              return item.animate([
                { transform: `translate(${deltaX}px, ${deltaY}px)` },
                { transform: 'translate(0, 0)' },
              ], {
                duration: 520,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              });
            }
          }

          return item.animate([
            { opacity: 0 },
            { opacity: 1 },
          ], {
            duration: 420,
            easing: 'ease-out',
          });
        });

        await Promise.all([heightAnimation, ...moveAnimations].filter(Boolean).map(animationFinished));

        if (run === filterRun) {
          if (grid) {
            grid.style.height = '';
          }
          gallery.classList.remove('is-filtering');
        }
      });
    });
  });

  if (!links.length) {
    return;
  }

  const lightbox = createLightbox();
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('figcaption');
  const closeButtons = lightbox.querySelectorAll('[data-rk-lightbox-close]');
  const previousButton = lightbox.querySelector('[data-rk-lightbox-prev]');
  const nextButton = lightbox.querySelector('[data-rk-lightbox-next]');
  let activeLinks = [];
  let activeIndex = 0;

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove('rk-lightbox-open');
  };

  const show = (index) => {
    if (!activeLinks.length) {
      return;
    }

    activeIndex = (index + activeLinks.length) % activeLinks.length;
    const link = activeLinks[activeIndex];
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || link.dataset.rkTitle || '';
    caption.textContent = link.dataset.rkTitle || image.alt;
    lightbox.hidden = false;
    document.body.classList.add('rk-lightbox-open');
    lightbox.querySelector('.rk-lightbox-close')?.focus();
  };

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const gallery = link.closest('[data-rk-gallery]');

      if (!gallery) {
        return;
      }

      event.preventDefault();
      activeLinks = Array.from(gallery.querySelectorAll('[data-rk-lightbox]')).filter((candidate) => {
        return !candidate.closest('[data-rk-gallery-item]')?.classList.contains('is-hidden');
      });
      show(activeLinks.indexOf(link));
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', close);
  });

  previousButton?.addEventListener('click', () => show(activeIndex - 1));
  nextButton?.addEventListener('click', () => show(activeIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      close();
    }

    if (event.key === 'ArrowLeft') {
      show(activeIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      show(activeIndex + 1);
    }
  });
}
