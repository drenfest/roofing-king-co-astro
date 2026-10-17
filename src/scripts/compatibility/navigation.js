const DESKTOP_QUERY = '(min-width: 1061px)';
const DESKTOP_OPEN_DELAY = 100;
const DESKTOP_SWITCH_DELAY = 260;
const DESKTOP_CLOSE_DELAY = 700;

function directChild(element, selector) {
  if (!element) {
    return null;
  }

  return Array.from(element.children).find((child) => child.matches(selector)) || null;
}

function addMediaListener(mediaQuery, callback) {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', callback);
    return;
  }

  mediaQuery.addListener(callback);
}

export function initNavigation() {
  const toggle = document.querySelector('[data-rk-nav-toggle]');
  const nav = document.querySelector('[data-rk-nav]');

  if (!toggle || !nav) {
    return;
  }

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  const submenuToggles = Array.from(nav.querySelectorAll('[data-rk-submenu-toggle]'));
  const navList = nav.querySelector('[data-rk-nav-list]');
  const topLevelItems = navList
    ? Array.from(navList.children).filter((item) => item.matches('[data-rk-menu-item]'))
    : [];

  let desktopOpenTimer = 0;
  let desktopCloseTimer = 0;
  let activeDesktopItem = null;
  let openedAutomatically = false;

  const getItemToggle = (item) => directChild(directChild(item, '.rk-menu-row'), '[data-rk-submenu-toggle]');
  const getItemSubmenu = (item) => directChild(item, '[data-rk-submenu]');

  const clearDesktopTimers = () => {
    window.clearTimeout(desktopOpenTimer);
    window.clearTimeout(desktopCloseTimer);
  };

  const setNavOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    nav.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('rk-nav-open', isOpen);
  };

  const setSubmenuOpen = (item, isOpen) => {
    const itemToggle = getItemToggle(item);

    item.classList.toggle('is-submenu-open', isOpen);
    if (itemToggle) {
      itemToggle.setAttribute('aria-expanded', String(isOpen));
    }
  };

  const closeSubmenus = (root = nav) => {
    root.querySelectorAll('.is-submenu-open').forEach((item) => {
      setSubmenuOpen(item, false);
    });
  };

  const closeSiblingSubmenus = (item) => {
    const parent = item.parentElement;

    if (!parent) {
      return;
    }

    Array.from(parent.children).forEach((sibling) => {
      if (sibling !== item && sibling.matches('[data-rk-menu-item]')) {
        setSubmenuOpen(sibling, false);
      }
    });
  };

  const openDesktopSubmenu = (item, automatic = true) => {
    if (!desktopQuery.matches || !getItemSubmenu(item)) {
      return;
    }

    clearDesktopTimers();
    closeSiblingSubmenus(item);
    setSubmenuOpen(item, true);
    activeDesktopItem = item;
    openedAutomatically = automatic;
  };

  const scheduleDesktopOpen = (item) => {
    if (!desktopQuery.matches || !getItemSubmenu(item)) {
      return;
    }

    window.clearTimeout(desktopCloseTimer);
    window.clearTimeout(desktopOpenTimer);

    desktopOpenTimer = window.setTimeout(() => {
      openDesktopSubmenu(item);
    }, activeDesktopItem ? DESKTOP_SWITCH_DELAY : DESKTOP_OPEN_DELAY);
  };

  const scheduleDesktopClose = () => {
    if (!desktopQuery.matches) {
      return;
    }

    window.clearTimeout(desktopOpenTimer);
    window.clearTimeout(desktopCloseTimer);

    desktopCloseTimer = window.setTimeout(() => {
      closeSubmenus();
      activeDesktopItem = null;
    }, DESKTOP_CLOSE_DELAY);
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!isOpen);
  });

  submenuToggles.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const item = button.closest('[data-rk-menu-item]');
      if (!item) {
        return;
      }

      const isOpen = item.classList.contains('is-submenu-open');

      if (desktopQuery.matches && item.classList.contains('rk-menu-depth-0')) {
        // Hover/focus can open the panel immediately before the first click.
        if (isOpen && openedAutomatically) {
          openedAutomatically = false;
          clearDesktopTimers();
          return;
        }
        if (isOpen) {
          clearDesktopTimers();
          setSubmenuOpen(item, false);
          activeDesktopItem = null;
        } else {
          openDesktopSubmenu(item, false);
        }

        return;
      }

      if (!isOpen) {
        closeSiblingSubmenus(item);
      }

      setSubmenuOpen(item, !isOpen);
    });
  });

  topLevelItems.forEach((item) => {
    const row = directChild(item, '.rk-menu-row');
    const submenu = getItemSubmenu(item);

    if (!row || !submenu) {
      return;
    }

    row.addEventListener('pointerenter', () => scheduleDesktopOpen(item));
    row.addEventListener('mouseenter', () => scheduleDesktopOpen(item));
    row.addEventListener('focusin', () => openDesktopSubmenu(item));
    submenu.addEventListener('pointerenter', () => {
      window.clearTimeout(desktopCloseTimer);
    });
    submenu.addEventListener('mouseenter', () => {
      window.clearTimeout(desktopCloseTimer);
    });
    submenu.addEventListener('pointerleave', scheduleDesktopClose);
    submenu.addEventListener('mouseleave', scheduleDesktopClose);
  });

  nav.addEventListener('pointerenter', () => {
    window.clearTimeout(desktopCloseTimer);
  });
  nav.addEventListener('mouseenter', () => {
    window.clearTimeout(desktopCloseTimer);
  });
  nav.addEventListener('pointerleave', scheduleDesktopClose);
  nav.addEventListener('mouseleave', scheduleDesktopClose);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!desktopQuery.matches) {
        setNavOpen(false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (nav.contains(event.target) || toggle.contains(event.target)) {
      return;
    }

    clearDesktopTimers();
    setNavOpen(false);
    closeSubmenus();
    activeDesktopItem = null;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    clearDesktopTimers();
    setNavOpen(false);
    closeSubmenus();
    activeDesktopItem = null;
    toggle.focus();
  });

  addMediaListener(desktopQuery, () => {
    clearDesktopTimers();
    setNavOpen(false);
    closeSubmenus();
    activeDesktopItem = null;
  });
}
