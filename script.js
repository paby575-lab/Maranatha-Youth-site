script.js    document.addEventListener('DOMContentLoaded', function () {
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

  document.querySelectorAll('.panel-link').forEach(function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('menu-open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

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
});
