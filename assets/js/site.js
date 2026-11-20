/*! Based on jekyll-theme-chirpy 7.6.0 | (c) 2019 Cotes Chung | MIT License | https://github.com/cotes2020/jekyll-theme-chirpy */
(function () {
  'use strict';
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  // mode: 'light' | 'dark' | 'system'. Light/dark are persisted, system follows the OS.
  function applyMode(mode) {
    var label = { system: 'System', light: 'Hell', dark: 'Dunkel' }[mode];
    try {
      if (mode === 'system') localStorage.removeItem('theme');
      else localStorage.setItem('theme', mode);
    } catch (e) {}
    if (mode === 'system') {
      root.removeAttribute('data-theme-persisted');
      root.setAttribute('data-bs-theme', mq.matches ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme-persisted', '');
      root.setAttribute('data-bs-theme', mode);
    }
    var btn = document.getElementById('mode-toggle');
    if (btn) btn.setAttribute('aria-label', 'Darstellung: ' + label);
  }

  function currentMode() {
    var t = stored();
    return t === 'light' || t === 'dark' ? t : 'system';
  }

  var toggle = document.getElementById('mode-toggle');
  if (toggle) {
    toggle.setAttribute('aria-label', 'Darstellung: ' + { system: 'System', light: 'Hell', dark: 'Dunkel' }[currentMode()]);
    toggle.addEventListener('click', function () {
      var next = { system: 'light', light: 'dark', dark: 'system' }[currentMode()];
      applyMode(next);
    });
  }
  function onSystemChange() {
    if (currentMode() === 'system') root.setAttribute('data-bs-theme', mq.matches ? 'dark' : 'light');
  }
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);

  // Mobile sidebar: Chirpy's CSS keys on the `sidebar-display` attribute of <body>.
  var mask = document.getElementById('mask');
  function setSidebar(open) {
    document.body.toggleAttribute('sidebar-display', open);
    if (mask) mask.classList.toggle('d-none', !open);
  }
  var trigger = document.getElementById('sidebar-trigger');
  if (trigger) trigger.addEventListener('click', function () {
    setSidebar(!document.body.hasAttribute('sidebar-display'));
  });
  if (mask) mask.addEventListener('click', function () { setSidebar(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setSidebar(false); });

  var top = document.getElementById('back-to-top');
  if (top) {
    window.addEventListener('scroll', function () {
      top.classList.toggle('show', window.scrollY > 50);
    }, { passive: true });
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Heading anchors, same markup Chirpy generated at build time.
  document.querySelectorAll('main .content :is(h2, h3, h4, h5)[id]').forEach(function (h) {
    var span = document.createElement('span');
    span.className = 'me-2';
    while (h.firstChild) span.appendChild(h.firstChild);
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.className = 'anchor text-muted';
    a.innerHTML = '<i class="fas fa-hashtag"></i>';
    h.appendChild(span);
    h.appendChild(a);
  });
})();
