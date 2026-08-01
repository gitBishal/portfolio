/*===== MOBILE MENU TOGGLE =====*/
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.innerHTML = isOpen ? "<i class='bx bx-x'></i>" : "<i class='bx bx-menu'></i>";
  });
}

document.querySelectorAll('[data-nav]').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', false);
      navToggle.innerHTML = "<i class='bx bx-menu'></i>";
    }
  });
});

/*===== HEADER SCROLL STATE =====*/
const header = document.getElementById('header');
const onScrollHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};
onScrollHeader();
window.addEventListener('scroll', onScrollHeader, { passive: true });

/*===== SCROLLSPY (active nav link) =====*/
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav__link[data-nav]');

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);
sections.forEach((section) => spy.observe(section));

/*===== SCROLL REVEAL =====*/
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealItems.forEach((item) => revealObserver.observe(item));

/*===== ANIMATED STAT COUNTERS =====*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('.stat__value').forEach((el) => statObserver.observe(el));

/*===== SPOTLIGHT CURSOR (hero background glow) =====*/
if (!prefersReducedMotion) {
  const spotlight = document.getElementById('spotlight');
  window.addEventListener('pointermove', (e) => {
    spotlight.style.setProperty('--x', `${e.clientX}px`);
    spotlight.style.setProperty('--y', `${e.clientY}px`);
  });

  /*===== SPOTLIGHT CARDS (per-card cursor glow) =====*/
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

/*===== COPY EMAIL =====*/
const copyEmailBtn = document.getElementById('copy-email');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = copyEmailBtn.dataset.email;
    const label = copyEmailBtn.querySelector('span');
    const originalText = label.textContent;
    try {
      await navigator.clipboard.writeText(email);
      label.textContent = 'Copied!';
    } catch {
      label.textContent = email;
    }
    setTimeout(() => { label.textContent = originalText; }, 2000);
  });
}

/*===== FOOTER YEAR =====*/
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
