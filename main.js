(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  // Ladebildschirm nur einmal pro Sitzung
  try {
    var pre = document.getElementById('global-preloader');
    if (pre) {
      if (sessionStorage.getItem('ed_pre')) pre.classList.add('is-hidden');
      else sessionStorage.setItem('ed_pre', '1');
    }
  } catch (e) {}

  // Kontakt-Overlay
  var overlay = document.getElementById('contact-overlay');
  var openBtn = document.getElementById('open-contact');
  var closeBtn = document.getElementById('close-contact');
  var lastFocus = null;
  function setOverlay(open) {
    if (!overlay) return;
    overlay.classList.toggle('is-open', open);
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) { lastFocus = document.activeElement; closeBtn.focus(); }
    else if (lastFocus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setOverlay(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setOverlay(false); });
  if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) setOverlay(false); });

  // Scroll-Hinweis blendet weich aus
  var ind = document.getElementById('global-scroll-indicator');
  if (ind) {
    var onScroll = function () {
      var o = Math.max(0, 1 - (window.scrollY || 0) / 250);
      ind.style.opacity = o;
      ind.style.visibility = o <= 0 ? 'hidden' : 'visible';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Grid: Querformat über 2 Spalten, Einblend-Effekt
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.work-image-wrap img'));
  imgs.forEach(function (img) {
    var done = function () {
      if (img.naturalWidth > img.naturalHeight) img.closest('.work-item').classList.add('is-landscape');
      img.classList.add('is-loaded');
    };
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', function () { img.classList.add('is-loaded'); }, { once: true }); }
  });

  // Lightbox (ohne externe Bibliothek)
  var lb = document.getElementById('lightbox');
  var links = Array.prototype.slice.call(document.querySelectorAll('.work-item-link'));
  if (lb && links.length) {
    var lbImg = lb.querySelector('img'), idx = 0, lbFocus = null;
    var show = function (i) {
      idx = (i + links.length) % links.length;
      var im = links[idx].querySelector('img');
      lbImg.src = links[idx].getAttribute('href');
      lbImg.alt = im ? im.alt : '';
    };
    var open = function (i) { lbFocus = document.activeElement; show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lb.querySelector('.lb-close').focus(); };
    var close = function () { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); if (lbFocus) lbFocus.focus(); };
    links.forEach(function (a, i) { a.addEventListener('click', function (e) { e.preventDefault(); open(i); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (lb && lb.classList.contains('is-open')) lb.querySelector('.lb-close').click();
    else if (overlay && overlay.classList.contains('is-open')) setOverlay(false);
  });
})();
