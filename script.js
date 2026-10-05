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

  // Section navigation with a centered-logo loading transition
  const pageLoader = document.getElementById('pageLoader');
  const navLinks = document.querySelectorAll('a[href^="#"]');

  function navigateTo(targetId, onComplete) {
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    if (pageLoader) {
      pageLoader.classList.add('is-active');
      document.body.classList.add('loader-active');
      document.body.style.overflow = 'hidden';
    }

    const delay = 650;
    setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });

      setTimeout(() => {
        if (pageLoader) {
          pageLoader.classList.remove('is-active');
          pageLoader.classList.add('is-leaving');
          document.body.classList.remove('loader-active');
          document.body.style.overflow = '';
        }
        setTimeout(() => {
          if (pageLoader) pageLoader.classList.remove('is-leaving');
          if (onComplete) onComplete();
        }, 650);
      }, 700);
    }, delay);
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
});
