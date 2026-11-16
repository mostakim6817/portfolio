/**
 * Md. Mostakim — Portfolio Scripts
 * Lightweight vanilla JavaScript for navigation, active section indicator,
 * scroll reveals, email copy utility, and accessible certificate preview modal.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------------------------------------------------
     1. Sticky Header Scroll State
     ------------------------------------------------------------------------ */
  const header = document.getElementById('site-header');

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = mobileNav
    ? Array.from(mobileNav.querySelectorAll('.mobile-nav-link'))
    : [];

  function setMobileMenuOpen(isOpen) {
    if (!menuToggle || !mobileNav || !header) return;

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    mobileNav.classList.toggle('is-open', isOpen);
    header.classList.toggle('menu-open', isOpen);

    mobileNavLinks.forEach((link) => {
      link.setAttribute('tabindex', isOpen ? '0' : '-1');
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenuOpen(!expanded);
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => setMobileMenuOpen(false));
    });

    document.addEventListener('click', (event) => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (expanded && header && !header.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        menuToggle.getAttribute('aria-expanded') === 'true'
      ) {
        setMobileMenuOpen(false);
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        setMobileMenuOpen(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Smooth In-Page Anchor Navigation & Active Section Tracking
     ------------------------------------------------------------------------ */
  const inPageLinks = Array.from(
    document.querySelectorAll('a[href^="#"]:not([href="#"]):not(.skip-link)')
  );

  inPageLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      event.preventDefault();
      setMobileMenuOpen(false);

      const headerHeight = header ? header.offsetHeight : 72;
      const top =
        targetId === 'home'
          ? 0
          : Math.max(
              0,
              targetEl.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                4
            );

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', `#${targetId}`);
      }
    });
  });

  const navSectionIds = [
    'home',
    'about',
    'skills',
    'projects',
    'interests',
    'education',
    'certificates',
    'contact',
  ];

  const trackedSections = navSectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const allNavLinks = Array.from(
    document.querySelectorAll('.nav-link, .mobile-nav-link')
  );

  let currentActiveId = 'home';

  function setActiveNav(sectionId) {
    if (!sectionId || sectionId === currentActiveId) return;
    currentActiveId = sectionId;

    allNavLinks.forEach((link) => {
      const isMatch = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function computeActiveSection() {
    if (!trackedSections.length) return;

    // If user reached bottom of document, highlight the final Contact section
    const scrollBottom = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (docHeight - scrollBottom <= 48) {
      setActiveNav('contact');
      return;
    }

    const headerOffset = (header ? header.offsetHeight : 72) + 64;
    const referenceY = window.scrollY + headerOffset;

    let activeId = trackedSections[0].id;
    for (let i = 0; i < trackedSections.length; i += 1) {
      if (trackedSections[i].offsetTop <= referenceY) {
        activeId = trackedSections[i].id;
      } else {
        break;
      }
    }

    setActiveNav(activeId);
  }

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateHeaderState();
      computeActiveSection();
      scrollTicking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', computeActiveSection, { passive: true });
  updateHeaderState();
  computeActiveSection();

  /* ------------------------------------------------------------------------
     4. Viewport Reveal Animations (Intersection Observer)
     ------------------------------------------------------------------------ */
  const revealElements = Array.from(document.querySelectorAll('.reveal'));

  if (
    prefersReducedMotion ||
    !('IntersectionObserver' in window) ||
    !revealElements.length
  ) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     5. Copy Email Address Utility
     ------------------------------------------------------------------------ */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailLabel = document.getElementById('copy-email-label');
  const copyEmailStatus = document.getElementById('copy-email-status');

  if (copyEmailBtn && copyEmailLabel) {
    let resetTimer = null;

    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || '';
      if (!email) return;

      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch (_err) {
          copied = false;
        }
      }

      if (!copied) {
        const tempInput = document.createElement('textarea');
        tempInput.value = email;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          copied = document.execCommand('copy');
        } catch (_err) {
          copied = false;
        }
        document.body.removeChild(tempInput);
      }

      if (resetTimer) window.clearTimeout(resetTimer);

      if (copied) {
        copyEmailLabel.textContent = 'Email Copied';
        if (copyEmailStatus) {
          copyEmailStatus.textContent = 'Email address copied to clipboard.';
        }
      } else {
        copyEmailLabel.textContent = email;
        if (copyEmailStatus) {
          copyEmailStatus.textContent = 'Email address: ' + email;
        }
      }

      resetTimer = window.setTimeout(() => {
        copyEmailLabel.textContent = 'Copy Email Address';
        if (copyEmailStatus) copyEmailStatus.textContent = '';
      }, 2400);
    });
  }

  /* ------------------------------------------------------------------------
     6. Accessible Certificate Lightbox Modal
     ------------------------------------------------------------------------ */
  const certTriggers = Array.from(
    document.querySelectorAll('.certificate-preview-btn')
  );
  const lightbox = document.getElementById('certificate-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxMeta = document.getElementById('lightbox-meta');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');

  if (lightbox && certTriggers.length && lightboxImg) {
    const certificates = certTriggers.map((btn) => {
      const img = btn.querySelector('img');
      return {
        src: btn.getAttribute('data-cert-src') || (img ? img.src : ''),
        alt: img ? img.alt : '',
        title: btn.getAttribute('data-cert-title') || '',
        meta: btn.getAttribute('data-cert-meta') || '',
        trigger: btn,
      };
    });

    let activeCertIndex = 0;
    let lastFocusedElement = null;

    function renderCertificate(index) {
      const total = certificates.length;
      activeCertIndex = ((index % total) + total) % total;
      const item = certificates[activeCertIndex];

      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      if (lightboxTitle) lightboxTitle.textContent = item.title;
      if (lightboxMeta) lightboxMeta.textContent = item.meta;
      if (lightboxCounter) {
        lightboxCounter.textContent = `${activeCertIndex + 1} / ${total}`;
      }
    }

    function openLightbox(index) {
      setMobileMenuOpen(false);
      lastFocusedElement = document.activeElement;
      renderCertificate(index);

      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');

      window.requestAnimationFrame(() => {
        lightbox.classList.add('is-visible');
      });

      if (lightboxCloseBtn) {
        lightboxCloseBtn.focus();
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('is-visible');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      const finishClose = () => {
        lightbox.hidden = true;
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        }
      };

      if (prefersReducedMotion) {
        finishClose();
      } else {
        window.setTimeout(finishClose, 200);
      }
    }

    certTriggers.forEach((btn, idx) => {
      btn.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox);
    });

    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', () => {
        renderCertificate(activeCertIndex - 1);
      });
    }

    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', () => {
        renderCertificate(activeCertIndex + 1);
      });
    }

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        renderCertificate(activeCertIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        renderCertificate(activeCertIndex + 1);
      } else if (event.key === 'Tab') {
        const focusables = [
          lightboxCloseBtn,
          lightboxPrevBtn,
          lightboxNextBtn,
        ].filter(Boolean);
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
})();
