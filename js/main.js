// ── HAMBURGER / MOBILE NAV ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── SMOOTH SCROLL ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── ACTIVE NAV HIGHLIGHT ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activateLink = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', activateLink, { passive: true });
activateLink();

// ── NAV SHRINK ON SCROLL ────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.padding = window.scrollY > 60 ? '.8rem 5rem' : '1.2rem 5rem';
}, { passive: true });

// ── SCROLL REVEAL ───────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
reveals.forEach(r => io.observe(r));

// ── SKILL BARS ──────────────────────────────────────────
const bars = document.querySelectorAll('.skill-fill');
const bio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      bio.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach(b => bio.observe(b));

// ── COUNT-UP STATS ──────────────────────────────────────
const nums = document.querySelectorAll('.stat-num[data-target]');
const nio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.target;
      let cur = 0;
      const inc = target / 40;
      const t = setInterval(() => {
        cur += inc;
        if (cur >= target) { cur = target; clearInterval(t); }
        e.target.textContent = Math.round(cur) + (target > 1 ? '+' : '');
      }, 40);
      nio.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
nums.forEach(n => nio.observe(n));

// ── CONTACT FORM ────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function(e) {
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
