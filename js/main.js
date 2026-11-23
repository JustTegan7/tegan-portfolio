const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── HAMBURGER / MOBILE NAV ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

const setMenu = (open) => {
  hamburger.classList.toggle('open', open);
  mobileNav.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
};

hamburger.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
document.querySelectorAll('.mob-link').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ── SMOOTH SCROLL ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

// ── NAV STATE, ACTIVE LINK, SCROLL PROGRESS (one rAF-throttled handler) ──
const nav = document.getElementById('siteNav');
const progress = document.getElementById('scrollProgress');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60);

  let current = '';
  sections.forEach(sec => { if (y >= sec.offsetTop - 140) current = sec.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// ── SCROLL REVEAL ───────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(r => io.observe(r));

// ── SKILL BARS ──────────────────────────────────────────
const bio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      bio.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-fill').forEach(b => bio.observe(b));

// ── COUNT-UP STATS ──────────────────────────────────────
// The real number is already in the HTML, so anyone without JS (or with
// reduced motion) sees it. With JS we count up to it with an ease-out curve.
const easeOut = t => 1 - Math.pow(1 - t, 3);
const countUp = el => {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 1100;
  const start = performance.now();
  const step = now => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(t) * target) + (t === 1 ? suffix : '');
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
if (!reduceMotion) {
  const nio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); nio.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num[data-target]').forEach(n => nio.observe(n));
}

// ── CONTACT FORM ────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = form.querySelector('.form-btn');
    const btnText = form.querySelector('.form-btn-text');
    const btnSending = form.querySelector('.form-btn-sending');
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnSending.style.display = 'inline';
    success.style.display = 'none';
    error.style.display = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        success.style.display = 'block';
        form.reset();
      } else {
        error.style.display = 'block';
      }
    } catch (err) {
      error.style.display = 'block';
    } finally {
      btn.disabled = false;
      btnText.style.display = 'inline';
      btnSending.style.display = 'none';
    }
  });
}
