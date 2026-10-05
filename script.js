document.addEventListener('DOMContentLoaded', function () {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const menuToggle = document.getElementById('menuToggle');
  const sidePanel = document.getElementById('sidePanel');
  const menuBackdrop = document.getElementById('menuBackdrop');

  function toggleMenu() {
    const isOpen = document.body.classList.toggle('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', function () {
      document.body.classList.remove('menu-open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const button = contactForm.querySelector('button');
      const originalText = button.textContent;

      button.textContent = 'Message Sent';
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
      }, 2000);
    });
  }

  // ---- Minimal page loader (first-paint friendly) ----
  const pageLoader = document.getElementById('pageLoader');
  const loaderBar = document.getElementById('loaderBar');
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const reducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawProgress(frac) {
    if (!loaderBar) return;
    loaderBar.style.width = Math.round(Math.max(0, Math.min(1, frac)) * 100) + '%';
  }

  function lockScroll() {
    document.body.classList.add('loader-active');
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('aria-busy', 'true');
  }

  function unlockScroll() {
    document.body.classList.remove('loader-active');
    document.body.style.overflow = '';
    document.body.setAttribute('aria-busy', 'false');
  }

  function showLoader() {
    if (!pageLoader) return;
    pageLoader.classList.remove('is-leaving');
    requestAnimationFrame(function () {
      pageLoader.classList.add('is-active');
    });
    drawProgress(0);
  }

  function hideLoader() {
    if (!pageLoader) return;
    pageLoader.classList.remove('is-active');
    pageLoader.classList.add('is-leaving');
    unlockScroll();
    setTimeout(function () {
      pageLoader.classList.remove('is-leaving');
    }, 500);
  }

  function animateProgress(duration, onDone) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      drawProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) {
        requestAnimationFrame(step);
      } else if (onDone) {
        onDone();
      }
    }
    requestAnimationFrame(step);
  }

  function runInitialLoader() {
    document.documentElement.classList.remove('page-loading');
    if (reducedMotion || !pageLoader) return;
    showLoader();
    lockScroll();
    animateProgress(850, function () {
      setTimeout(hideLoader, 220);
    });
  }

  runInitialLoader();

  // Section navigation with a lightweight loading transition
  function navigateTo(targetId, onComplete) {
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    showLoader();
    lockScroll();

    const scrollToTarget = function () {
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    if (reducedMotion) {
      scrollToTarget();
      hideLoader();
      if (onComplete) onComplete();
      return;
    }

    animateProgress(480, function () {
      scrollToTarget();
      setTimeout(function () {
        drawProgress(1);
        setTimeout(hideLoader, 180);
        if (onComplete) onComplete();
      }, 150);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;

      event.preventDefault();

      if (document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }

      link.classList.add('nav-loading');

      navigateTo(href, function () {
        link.classList.remove('nav-loading');
      });
    });
  });

  // ---- Aesthetic enhancements ----

  // Scroll reveal on sections & cards
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Sticky header state + back-to-top visibility
  const siteHeader = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const y = window.scrollY;
    if (siteHeader) siteHeader.classList.toggle('is-scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 600);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll spy — highlight the active section in the main nav
  const spySections = document.querySelectorAll('main section[id]');
  const spyLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if ('IntersectionObserver' in window && spySections.length && spyLinks.length) {
    const spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            spyLinks.forEach(function (link) {
              const isActive = link.getAttribute('href') === '#' + entry.target.id;
              link.classList.toggle('is-active', isActive);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    spySections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  // Mobile tap ripple feedback
  const rippleHosts = document.querySelectorAll(
    '.btn, .menu-toggle, .back-to-top, .panel-link, .link-arrow, .footer-col a'
  );

  if (window.PointerEvent && !reducedMotion && rippleHosts.length) {
    rippleHosts.forEach(function (host) {
      // Never override fixed/absolute placements (e.g. the hamburger button):
      // only upgrade static elements to "relative" (which moves nothing).
      if (getComputedStyle(host).position === 'static') {
        host.style.position = 'relative';
      }

      // Clip the ink to the control so it looks like a native material ripple.
      // "link-arrow" is excluded so its arrow can still slide on hover.
      if (!host.classList.contains('link-arrow')) {
        host.style.overflow = 'hidden';
      }

      function clearInks() {
        host.querySelectorAll('.ripple-ink').forEach(function (ink) {
          ink.remove();
        });
      }

      host.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;

        clearInks();
        const rect = host.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.4;
        const ink = document.createElement('span');
        ink.className = 'ripple-ink';
        ink.style.width = size + 'px';
        ink.style.height = size + 'px';
        ink.style.left = event.clientX - rect.left - size / 2 + 'px';
        ink.style.top = event.clientY - rect.top - size / 2 + 'px';
        host.appendChild(ink);

        window.setTimeout(function () {
          ink.remove();
        }, 600);
      });

      // Cancel the ink cleanly if the browser takes over the gesture (scroll/drag).
      host.addEventListener('pointercancel', clearInks);
    });
  }
});
