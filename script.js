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
    const methodBtns = contactForm.querySelectorAll('.send-method-btn');
    const fieldWhatsapp = document.getElementById('fieldWhatsapp');
    const fieldEmail = document.getElementById('fieldEmail');
    const phoneInput = document.getElementById('cfPhone');
    const emailInput = document.getElementById('cfEmail');
    const submitIcon = document.getElementById('submitIcon');
    const submitLabel = document.getElementById('submitLabel');
    const formNote = document.getElementById('formNote');

    const WHATSAPP_NUMBER = '233531857423';
    const CONTACT_EMAIL = 'eacquahappiah@gmail.com';
    let sendMethod = 'whatsapp';

    function setSendMethod(next) {
      sendMethod = next;
      methodBtns.forEach(function (btn) {
        const isActive = btn.dataset.method === next;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      fieldWhatsapp.hidden = next !== 'whatsapp';
      fieldEmail.hidden = next !== 'email';
      phoneInput.required = next === 'whatsapp';
      emailInput.required = next === 'email';

      const icon = contactForm.querySelector(
        '.send-method-btn[data-method="' + next + '"] .send-method-icon'
      );
      if (submitIcon && icon) submitIcon.innerHTML = icon.outerHTML;

      if (submitLabel) {
        submitLabel.textContent = next === 'whatsapp' ? 'Send via WhatsApp' : 'Send via Email';
      }
      if (formNote) {
        formNote.textContent =
          next === 'whatsapp'
            ? 'Opens WhatsApp with your message ready to send.'
            : 'Opens your email app, addressed to eacquahappiah@gmail.com.';
      }
    }

    methodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSendMethod(btn.dataset.method);
      });
    });

    setSendMethod('whatsapp');

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const name = document.getElementById('cfName').value.trim();
      const message = document.getElementById('cfMessage').value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();

      if (!name || !message) return;
      if (sendMethod === 'whatsapp' && !phone) return;
      if (sendMethod === 'email' && !email) return;

      const button = contactForm.querySelector('button[type="submit"]');
      if (button) button.disabled = true;

      const restoreNote = function () {
        if (formNote) {
          formNote.textContent =
            sendMethod === 'whatsapp'
              ? 'Opens WhatsApp with your message ready to send.'
              : 'Opens your email app, addressed to eacquahappiah@gmail.com.';
        }
      };

      if (sendMethod === 'whatsapp') {
        const text = 'Hello Maranatha Society! My name is ' + name + '.\n' + message;
        const link = document.createElement('a');
        link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
        link.target = '_blank';
        link.rel = 'noopener,noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();
        if (formNote) formNote.textContent = 'Opening WhatsApp with your message…';
      } else {
        const subject = 'Message from ' + name + ' (Maranatha Society)';
        const body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
        window.location.href =
          'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        if (formNote) formNote.textContent = 'Opening your email app…';
      }

      setTimeout(function () {
        if (button) button.disabled = false;
        contactForm.reset();
        setSendMethod(sendMethod);
        restoreNote();
      }, 1500);
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

  // ---- Hymnal: full Methodist Hymn Book (MHB) search engine ----
  const hymnGrid = document.getElementById('hymnGrid');
  const hymnSearch = document.getElementById('hymnSearch');
  const hymnCount = document.getElementById('hymnCount');
  const hymnView = document.getElementById('hymnView');
  const hymnViewNum = document.getElementById('hymnViewNum');
  const hymnViewTitle = document.getElementById('hymnViewTitle');
  const hymnViewAuthor = document.getElementById('hymnViewAuthor');
  const hymnViewBody = document.getElementById('hymnViewBody');
  const hymnViewClose = document.getElementById('hymnViewClose');
  const hymnPrev = document.getElementById('hymnPrev');
  const hymnNext = document.getElementById('hymnNext');
  const hymnViewPos = document.getElementById('hymnViewPos');

  // The complete MHB (hymns 1-984: number, title, author, verses) lives in
  // hymns.js as window.MHB_HYMNS. The tiny fallback below only kicks in if
  // that file could not load, so the section still works.
  const HYMNS =
    typeof window.MHB_HYMNS !== 'undefined' && window.MHB_HYMNS.length
      ? window.MHB_HYMNS
      : [
          {
            n: 1,
            t: 'O For A Thousand Tongues To Sing',
            a: 'Charles Wesley',
            v: [
              [
                'O for a thousand tongues to sing',
                'My great Redeemer\u2019s praise,',
                'The glories of my God and King,',
                'The triumphs of His grace!'
              ]
            ]
          },
          {
            n: 2,
            t: 'All People That on Earth Do Dwell',
            a: 'William Kethe',
            v: [
              [
                'All people that on earth do dwell,',
                'Sing to the Lord with cheerful voice;',
                'Him serve with mirth, His praise forth tell,',
                'Come ye before Him and rejoice.'
              ]
            ]
          },
          {
            n: 3,
            t: 'O Worship the King',
            a: 'Robert Grant',
            v: [
              [
                'O worship the King, all glorious above,',
                'O gratefully sing His power and His love:'
              ]
            ]
          }
        ];
  const HYMN_TOTAL = HYMNS.length;

  // Pre-built lowercase "haystack" (title + author + lyrics) per hymn for fast search.
  const hymnHaystacks = new Map();
  function hymnHaystack(h) {
    let s = hymnHaystacks.get(h.n);
    if (s === undefined) {
      const lyrics = (h.v || [])
        .map(function (st) { return st.join(' '); })
        .join(' ');
      s = (h.t + ' ' + (h.a || '') + ' ' + lyrics).toLowerCase();
      hymnHaystacks.set(h.n, s);
    }
    return s;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let currentResults = [];
  let currentIndex = 0;

  function renderHymns(list) {
    if (!hymnGrid) return;
    hymnGrid.innerHTML = '';
    currentResults = list;
    currentIndex = 0;

    if (!list.length) {
      const empty = document.createElement('p');
      empty.className = 'hymn-empty';
      empty.textContent =
        'No hymns match your search. Try a hymn number (e.g. “375”) or part of a title (e.g. “Abide with me”).';
      hymnGrid.appendChild(empty);
      if (hymnCount) {
        hymnCount.textContent = 'No matches found in the ' + HYMN_TOTAL + ' MHB hymns';
      }
      return;
    }

    list.forEach(function (hymn, index) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'hymn-card';
      card.setAttribute('data-number', hymn.n);
      card.innerHTML =
        '<span class="hymn-num">' + escapeHtml(hymn.n) + '</span>' +
        '<span class="hymn-title">' + escapeHtml(hymn.t) + '</span>';
      card.addEventListener('click', function () {
        openHymn(index);
      });
      hymnGrid.appendChild(card);
    });

    if (hymnCount) {
      hymnCount.textContent =
        list.length === HYMN_TOTAL
          ? 'All ' + HYMN_TOTAL + ' hymns of the Methodist Hymn Book'
          : 'Showing ' + list.length + ' of ' + HYMN_TOTAL + ' hymns';
    }
  }

  function openHymn(index, direction) {
    if (!hymnView || !currentResults.length) return;
    const hymn = currentResults[index];
    if (!hymn) return;
    currentIndex = index;

    const wasOpen = hymnView.classList.contains('is-open');

    if (wasOpen && hymnViewBody) {
      // Gentle crossfade: fade out, swap text, fade in.
      hymnViewBody.style.transition = 'opacity 0.22s ease';
      hymnViewBody.style.opacity = '0';

      setTimeout(function () {
        fillHymn(hymn);
        if (hymnViewBody) {
          hymnViewBody.style.transition = 'opacity 0.28s ease';
          hymnViewBody.style.opacity = '1';
        }
      }, 180);
    } else {
      fillHymn(hymn);
    }

    if (hymnViewPos) {
      hymnViewPos.textContent = (index + 1) + ' of ' + currentResults.length;
    }
    if (hymnPrev) hymnPrev.disabled = index <= 0;
    if (hymnNext) hymnNext.disabled = index >= currentResults.length - 1;

    if (!wasOpen) {
      document.body.classList.add('hymn-open');
      hymnView.classList.add('is-open');
      hymnView.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (hymnViewClose) hymnViewClose.focus();
    }
  }

  function fillHymn(hymn) {
    if (hymnViewNum) hymnViewNum.textContent = 'MHB ' + hymn.n;
    if (hymnViewTitle) hymnViewTitle.textContent = hymn.t;
    if (hymnViewAuthor) hymnViewAuthor.textContent = hymn.a || 'Methodist Hymn Book';
    if (hymnViewBody) {
      const allStanzas = hymn.v || [];
      hymnViewBody.innerHTML = allStanzas
        .map(function (stanza, i) {
          const label = labelStanza(i, stanza, allStanzas.length, allStanzas);
          return '<p class="hymn-stanza">' +
            (label ? '<span class="hymn-stanza-label">' + escapeHtml(label) + '</span>' : '') +
            stanza.map(escapeHtml).join('<br>') +
            '</p>';
        })
        .join('');
    }
  }

  // Heuristics for naming a stanza: CHORUS / VERSE / REFRAIN.
  function labelStanza(index, stanza, total, allStanzas) {
    const joined = stanza.join(' ').toLowerCase();

    // 1. Explicit markers in the text.
    if (/\b(refrain|chorus)\b/.test(joined)) return 'Chorus';

    // 2. If this stanza's text matches another stanza exactly, it's a repeated chorus.
    //    Build a normalized version (lowercase, stripped punctuation) for comparison.
    const normalized = joined.replace(/[.,;:!?'"-]/g, '').trim();
    if (normalized) {
      for (let i = 0; i < allStanzas.length; i++) {
        if (i === index) continue;
        const other = allStanzas[i].join(' ').toLowerCase()
          .replace(/[.,;:!?'"-]/g, '').trim();
        if (other === normalized) return 'Chorus';
      }
    }

    // 3. If this is the last stanza and it's shorter (chorus-like), treat as chorus.
    if (index === total - 1 && total > 2) {
      const avgLines = allStanzas.reduce((sum, s) => sum + s.length, 0) / total;
      if (stanza.length <= avgLines && stanza.length <= 4) return 'Chorus';
    }

    // 4. First stanza → Verse 1 (if more than one stanza).
    if (index === 0 && total > 1) return 'Verse 1';
    if (index === 0) return '';

    // Default: Verse N
    return 'Verse ' + (index + 1);
  }

  function closeHymn() {
    if (!hymnView) return;
    hymnView.classList.remove('is-open');
    hymnView.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('hymn-open');
    document.body.style.overflow = '';
  }

  if (hymnGrid && hymnSearch) {
    renderHymns(HYMNS);

    // Google-style live search: matches hymn numbers (e.g. "57", "MHB 375")
    // and words from the title, author, or full text.
    hymnSearch.addEventListener('input', function () {
      const q = hymnSearch.value.trim();
      if (!q) {
        renderHymns(HYMNS);
        return;
      }

      const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
      let numberToken = '';
      tokens.forEach(function (tok) {
        const digits = tok.replace(/^[#nobm\s]+/, '');
        if (/^\d+$/.test(digits)) numberToken = digits;
      });
      const textTokens = tokens.filter(function (tok) {
        const digits = tok.replace(/^[#nobm\s]+/, '');
        return !/^\d+$/.test(digits) && tok !== 'mhb' && tok !== 'no';
      });

      if (!numberToken && !textTokens.length) {
        renderHymns(HYMNS);
        return;
      }

      // Relevance scoring so the closest title/number match rises to the top.
      function relevance(h) {
        const s = String(h.n);
        const title = h.t.toLowerCase();
        const firstLine = ((h.v || [])[0] || []).join(' ').toLowerCase();
        const phrase = textTokens.join(' ');
        if (numberToken) {
          if (s === numberToken) return 0;
          if (s.indexOf(numberToken) === 0) return 1;
          return 2;
        }
        if (title === phrase) return 0;
        if (title.indexOf(phrase) >= 0) return 1;
        if (title.indexOf(textTokens[0]) >= 0) return 2;
        if (firstLine.indexOf(phrase) >= 0) return 3;
        return 4;
      }

      const filtered = HYMNS
        .filter(function (h) {
          if (numberToken && String(h.n).indexOf(numberToken) === 0) return true;
          if (!textTokens.length) return false;
          const hay = hymnHaystack(h);
          return textTokens.every(function (tok) {
            return hay.indexOf(tok) !== -1;
          });
        })
        .sort(function (a, b) {
          return relevance(a) - relevance(b) || a.n - b.n;
        });

      renderHymns(filtered);
    });

    if (hymnViewClose) {
      hymnViewClose.addEventListener('click', closeHymn);
    }
    if (hymnView) {
      hymnView.addEventListener('click', function (event) {
        if (event.target === hymnView) closeHymn();
      });
    }
    if (hymnPrev) {
      hymnPrev.addEventListener('click', function () {
        if (currentIndex > 0) openHymn(currentIndex - 1, 'prev');
      });
    }
    if (hymnNext) {
      hymnNext.addEventListener('click', function () {
        if (currentIndex < currentResults.length - 1) openHymn(currentIndex + 1, 'next');
      });
    }
    document.addEventListener('keydown', function (event) {
      if (!hymnView || !hymnView.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeHymn();
      if (event.key === 'ArrowLeft' && hymnPrev && !hymnPrev.disabled) openHymn(currentIndex - 1, 'prev');
      if (event.key === 'ArrowRight' && hymnNext && !hymnNext.disabled) openHymn(currentIndex + 1, 'next');
    });
  }

  // Mobile tap ripple feedback
  const rippleHosts = document.querySelectorAll(
    '.send-method-btn, .hymn-card, .btn, .menu-toggle, .back-to-top, .panel-link, .link-arrow, .footer-col a'
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
