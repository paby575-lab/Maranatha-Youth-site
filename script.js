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
  const navLinks = document.querySelectorAll('.main-nav a, .panel-link, .btn');

  function navigateTo(targetId) {
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

      navigateTo(href);
    });
  });
});
