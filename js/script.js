const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function currentTheme() {
  return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    if (next === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    try { localStorage.setItem('ff-theme', next); } catch (e) {}
  });
}

// Cookie consent (Calendly)
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');
const cookieManage = document.getElementById('cookie-manage');
const calendlyPlaceholder = document.getElementById('calendly-placeholder');
const calendlyWidget = document.getElementById('calendly-widget');
const calendlyEnable = document.getElementById('calendly-enable');

function getConsent() {
  try { return localStorage.getItem('ff-cookie-consent'); } catch (e) { return null; }
}
function setConsent(value) {
  try { localStorage.setItem('ff-cookie-consent', value); } catch (e) {}
}

function loadCalendly() {
  if (!calendlyWidget || document.getElementById('calendly-script')) return;
  const script = document.createElement('script');
  script.id = 'calendly-script';
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  document.body.appendChild(script);
  if (calendlyPlaceholder) calendlyPlaceholder.hidden = true;
  calendlyWidget.style.display = '';
}

function applyConsent(value) {
  setConsent(value);
  if (cookieBanner) cookieBanner.hidden = true;
  if (value === 'accepted') loadCalendly();
}

if (cookieAccept) cookieAccept.addEventListener('click', () => applyConsent('accepted'));
if (cookieDecline) cookieDecline.addEventListener('click', () => applyConsent('declined'));
if (cookieManage) cookieManage.addEventListener('click', () => { if (cookieBanner) cookieBanner.hidden = false; });
if (calendlyEnable) calendlyEnable.addEventListener('click', () => applyConsent('accepted'));

const existingConsent = getConsent();
if (existingConsent === 'accepted') {
  loadCalendly();
} else if (existingConsent === 'declined') {
  // keep placeholder visible
} else if (cookieBanner) {
  cookieBanner.hidden = false;
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}
