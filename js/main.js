/* ============================================================
   مزه کباب — main.js
   All frontend interactions (vanilla JS + optional GSAP)
   ============================================================ */
(function () {
  'use strict';

  var D = window.MZKB || { restaurant: {}, categories: [], dishes: [], gallery: [] };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
  var useGsap = hasGsap && !RM;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function toFa(str) { return String(str).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[+d]; }); }

  var body = document.body;
  function lockScroll(on) { body.classList.toggle('is-locked', on); }
  body.classList.add('js');

  /* ---------------- Preloader ---------------- */
  var preloader = $('#preloader');
  function killPreloader() {
    if (!preloader) return;
    preloader.classList.add('is-done');
    setTimeout(function () { preloader.remove(); }, 700);
    window.dispatchEvent(new CustomEvent('mzkb:ready'));
  }
  if (RM) {
    killPreloader();
  } else {
    var preDone = false;
    function tryPreDone() {
      if (preDone) return; preDone = true;
      setTimeout(killPreloader, 350);
    }
    window.addEventListener('load', tryPreDone);
    setTimeout(tryPreDone, 2200); // safety: never block the user
  }

  /* ---------------- Header scroll state ---------------- */
  var header = $('#site-header');
  var navLinks = $all('[data-navlink]');
  function onScrollHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    // at the very top of the page no section link is "active"
    if (window.scrollY < 320) {
      navLinks.forEach(function (a) { a.classList.remove('is-active'); });
    }
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Mobile navigation ---------------- */
  var mnav = $('#mobile-nav');
  var mnavToggle = $('.nav-toggle');
  var mnavClosing = false;

  function openMnav() {
    if (mnav.hidden) mnav.hidden = false;
    void mnav.offsetWidth; // reflow for clip-path transition
    mnav.classList.add('is-open');
    mnavToggle.setAttribute('aria-expanded', 'true');
    lockScroll(true);
  }
  function closeMnav() {
    if (mnavClosing || mnav.hidden) return;
    mnavClosing = true;
    mnav.classList.remove('is-open');
    mnavToggle.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    setTimeout(function () {
      if (!mnav.classList.contains('is-open')) mnav.hidden = true;
      mnavClosing = false;
    }, 600);
  }
  mnavToggle.addEventListener('click', function () {
    mnav.classList.contains('is-open') ? closeMnav() : openMnav();
  });
  $all('.mobile-nav a[href^="#"], .mobile-nav [data-open-reserve]').forEach(function (el) {
    el.addEventListener('click', closeMnav);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && mnav.classList.contains('is-open')) closeMnav();
  });

  /* ---------------- Reveal on scroll ----------------
     Scroll-position based (no IntersectionObserver) so very fast
     scrolling / keyboard jumps can never skip elements. */
  var rvEls = $all('[data-rv]');
  if (useGsap) {
    // hero items are animated by the GSAP timeline instead
    rvEls.forEach(function (el) {
      if (el.closest('.hero')) el.classList.add('no-cv', 'is-in');
    });
  }
  var lastSweep = 0;
  function revealSweep(force) {
    var now = Date.now();
    if (!force && now - lastSweep < 50) return;
    lastSweep = now;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < rvEls.length; i++) {
      var el = rvEls[i];
      if (el.classList.contains('is-in')) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh + 90 && r.bottom > 0) el.classList.add('is-in');
    }
  }
  window.addEventListener('scroll', function () { revealSweep(false); }, { passive: true });
  window.addEventListener('resize', function () { revealSweep(true); });
  window.addEventListener('load', function () { revealSweep(true); });
  // safety net: also sweep periodically so no element can be missed
  // (covers smooth-scroll animations, fast flicks, odd rAF throttling)
  window.setInterval(function () { revealSweep(false); }, 180);
  revealSweep(true);

  /* ---------------- GSAP: hero intro + parallax ---------------- */
  if (useGsap) {
    var gsap = window.gsap;

    gsap.fromTo('#hero-img',
      { scale: 1.14 },
      { scale: 1.08, duration: 1.6, ease: 'power2.out' }
    );
    gsap.to('#hero-img', {
      yPercent: -3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    var intro = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.9 }
    });
    intro.from('.hero-eyebrow', { y: 26, opacity: 0 }, 0.15)
      .from('.ht-line > span', { yPercent: 110, opacity: 0, duration: 1.05, stagger: 0.12 }, 0.3)
      .from('.hero-lead', { y: 24, opacity: 0 }, 0.75)
      .from('.hero-slogan', { y: 20, opacity: 0 }, 0.95)
      .from('.hero-cta .btn', { y: 18, opacity: 0, stagger: 0.1 }, 1.1)
      .from('.hero-meta-item', { y: 14, opacity: 0, stagger: 0.08 }, 1.3);

    // mask reveal for the signature figure
    gsap.from('#sig-fig', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.1, ease: 'power3.inOut',
      scrollTrigger: { trigger: '#signature', start: 'top 70%' }
    });

    // gentle parallax on the catering photo
    gsap.to('#cater-img', {
      yPercent: -7, ease: 'none',
      scrollTrigger: { trigger: '#catering', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* ---------------- Menu rendering ---------------- */
  var cardsEl = $('#menu-cards');
  var fullEl = $('#menu-full');
  var tabs = $all('.menu-tab');
  var dishById = {};
  D.dishes.forEach(function (d) { dishById[d.id] = d; });
  var catById = {};
  D.categories.forEach(function (c) { catById[c.id] = c; });

  function priceHtml(price) {
    return price
      ? '<span class="dish-price">' + price + '</span>'
      : '<span class="dish-price is-ask">استعلام قیمت</span>';
  }

  function cardHtml(d, i) {
    var media = d.img
      ? '<figure class="dish-media">' +
          '<img src="' + d.img + '" width="800" height="600" loading="lazy" decoding="async" alt="' + d.alt + '">' +
          (d.name.indexOf('مخصوس') > -1 ? '<span class="dish-badge">مخصوس</span>' : '') +
        '</figure>'
      : '<div class="dish-media"><div class="dish-orn"><img src="assets/logo/emblem.svg" width="88" height="88" alt=""></div></div>';

    return (
      '<article class="dish-card" data-dish="' + d.id + '" tabindex="0" role="button" ' +
      'aria-label="' + d.name + ' — مشاهده جزئیات" style="animation-delay:' + (i * 70) + 'ms">' +
        media +
        '<div class="dish-body">' +
          '<h3 class="dish-name">' + d.name + '</h3>' +
          '<p class="dish-note">' + d.note + '</p>' +
          '<div class="dish-foot">' +
            priceHtml(d.price) +
            '<span class="dish-more">جزئیات <svg class="ic" aria-hidden="true"><use href="#ic-arrow"/></svg></span>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function rowHtml(d) {
    return (
      '<button class="dish-row" type="button" data-dish="' + d.id + '">' +
        '<span class="dish-row-name">' + d.name + '</span>' +
        '<span class="dish-row-dots" aria-hidden="true"></span>' +
        '<span class="dish-row-price">' + (d.price ? toFa(d.price) : 'استعلام') + '</span>' +
      '</button>'
    );
  }

  function groupHtml(cat) {
    var items = D.dishes.filter(function (d) { return d.cat === cat.id; });
    return (
      '<div class="menu-group">' +
        '<h3 class="menu-group-title"><svg class="ic" aria-hidden="true"><use href="#orn-star"/></svg>' + cat.label + '</h3>' +
        '<ul>' + items.map(function (d) {
          return '<li>' + rowHtml(d) + '</li>';
        }).join('') + '</ul>' +
      '</div>'
    );
  }

  function renderMenu(cat) {
    var list = cat === 'all' ? D.dishes : D.dishes.filter(function (d) { return d.cat === cat; });
    var photoItems = list.filter(function (d) { return d.img; });

    cardsEl.innerHTML = photoItems.map(cardHtml).join('');
    fullEl.innerHTML = (cat === 'all' ? D.categories : [catById[cat]])
      .map(groupHtml)
      .join('');
  }

  function activateTab(btn) {
    tabs.forEach(function (t) {
      var on = t === btn;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    var panels = $('.menu-panels');
    panels.classList.add('is-fading');
    setTimeout(function () {
      renderMenu(btn.dataset.cat);
      panels.classList.remove('is-fading');
    }, RM ? 0 : 200);
  }

  tabs.forEach(function (t) { t.addEventListener('click', function () { activateTab(t); }); });
  // arrow-key navigation between tabs
  $('.menu-tabs').addEventListener('keydown', function (e) {
    var idx = tabs.indexOf(document.activeElement);
    if (idx === -1) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); }
  });

  renderMenu('all');

  /* ---------------- Dish modal ---------------- */
  var dishModal = $('#dish-modal');
  var lastFocus = null;

  function openDish(id) {
    var d = dishById[id];
    if (!d) return;
    var img = $('#dm-img');
    var orn = $('.dm-orn', dishModal);
    var media = $('.dm-media', dishModal);
    if (d.img) {
      img.src = d.img;
      img.alt = d.alt || d.name;
      img.hidden = false;
      orn.hidden = true;
      media.classList.remove('is-orn');
    } else {
      img.hidden = true;
      orn.hidden = false;
      media.classList.add('is-orn');
    }
    $('#dm-name').textContent = d.name;
    $('#dm-cat').textContent = catById[d.cat].label;
    $('#dm-note').textContent = d.note;
    var priceEl = $('#dm-price');
    if (d.price) {
      priceEl.textContent = d.price;
      priceEl.classList.remove('is-ask');
    } else {
      priceEl.textContent = 'قیمت به‌صورت تلفنی اعلام می‌شود';
      priceEl.classList.add('is-ask');
    }
    lastFocus = document.activeElement;
    dishModal.hidden = false;
    lockScroll(true);
    var closeBtn = $('.modal-close', dishModal);
    if (closeBtn) closeBtn.focus();
  }
  function closeDish() {
    dishModal.hidden = true;
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
  }

  /* ---------------- Reservation modal ---------------- */
  var reserveModal = $('#reserve-modal');
  var reserveForm = $('#reserve-form');
  var reserveSuccess = $('#reserve-success');

  function openReserve() {
    lastFocus = document.activeElement;
    reserveForm.hidden = false;
    reserveSuccess.hidden = true;
    reserveModal.hidden = false;
    lockScroll(true);
    var d = $('#rf-date');
    var today = new Date();
    var iso = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
    d.min = iso;
    var name = $('#rf-name');
    setTimeout(function () { name.focus(); }, 60);
  }
  function closeReserve() {
    reserveModal.hidden = true;
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
    // reset after the exit animation
    setTimeout(function () {
      reserveForm.reset();
      $all('.err-msg', reserveForm).forEach(function (m) { m.textContent = ''; });
      $all('.is-err', reserveForm).forEach(function (i) { i.classList.remove('is-err'); });
    }, 350);
  }

  function setErr(inputId, errId, msg) {
    var input = $('#' + inputId);
    var err = $('#' + errId);
    err.textContent = msg || '';
    input.classList.toggle('is-err', !!msg);
    return !msg;
  }

  reserveForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#rf-name').value.trim();
    var phone = $('#rf-phone').value.replace(/[\s-]/g, '');
    var date = $('#rf-date').value;

    var ok = true;
    ok = setErr('rf-name', 'err-name', name.length < 3 ? 'لطفاً نام خود را کامل بنویسید.' : '') && ok;
    ok = setErr('rf-phone', 'err-phone', /^09\d{9}$/.test(phone) ? '' : 'شماره باید با ۰۹ شروع شود و ۱۱ رقم باشد.') && ok;
    var minDate = $('#rf-date').min;
    ok = setErr('rf-date', 'err-date', (!date || date < minDate) ? 'لطفاً تاریخ معتبر (از امروز به بعد) انتخاب کنید.' : '') && ok;

    if (ok) {
      reserveForm.hidden = true;
      reserveSuccess.hidden = false;
      var btn = $('.btn', reserveSuccess);
      if (btn) btn.focus();
    } else {
      var firstErr = $('.is-err', reserveForm);
      if (firstErr) firstErr.focus();
    }
  });

  // live-clear errors while typing
  [['rf-name', 'err-name'], ['rf-phone', 'err-phone'], ['rf-date', 'err-date']].forEach(function (pair) {
    $('#' + pair[0]).addEventListener('input', function () {
      setErr(pair[0], pair[1], '');
    });
  });

  /* ---------------- Modal wiring + focus trap ---------------- */
  $all('[data-open-reserve]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeMnav();
      openReserve();
    });
  });

  [dishModal, reserveModal].forEach(function (modal) {
    $all('[data-close]', modal).forEach(function (el) {
      el.addEventListener('click', function () {
        modal === dishModal ? closeDish() : closeReserve();
      });
    });
  });

  // global dish openers (cards, list rows, signature rows)
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-dish]');
    if (t) openDish(t.dataset.dish);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target.closest ? e.target.closest('[data-dish].dish-card') : null;
    if (t) { e.preventDefault(); openDish(t.dataset.dish); }
  });

  // focus trap + escape for whichever overlay is open
  function trapFocus(e) {
    var open = null;
    if (!dishModal.hidden) open = dishModal;
    else if (!reserveModal.hidden) open = reserveModal;
    else if (!lightbox.hidden) open = lightbox;
    if (!open) return;
    if (e.key === 'Escape') {
      closeOverlay(open);
      return;
    }
    if (e.key !== 'Tab') return;
    var focusables = $all(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      open
    ).filter(function (el) { return el.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
  function closeOverlay(open) {
    if (open === dishModal) closeDish();
    else if (open === reserveModal) closeReserve();
    else if (open === lightbox) closeLightbox();
  }
  document.addEventListener('keydown', trapFocus);

  /* ---------------- Lightbox ---------------- */
  var lightbox = $('#lightbox');
  var lbImg = $('#lb-img');
  var lbCap = $('#lb-cap');
  var lbCount = $('#lb-count');
  var lbIndex = 0;
  var galItems = $all('.gal-item');

  function showLb(i) {
    lbIndex = (i + D.gallery.length) % D.gallery.length;
    var g = D.gallery[lbIndex];
    lbImg.src = g.src;
    lbImg.alt = g.alt;
    lbImg.style.animation = 'none';
    void lbImg.offsetWidth;
    lbImg.style.animation = '';
    lbCap.textContent = g.caption;
    lbCount.textContent = toFa(lbIndex + 1) + ' / ' + toFa(D.gallery.length);
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    showLb(i);
    lightbox.hidden = false;
    lockScroll(true);
    $('.lb-close', lightbox).focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lockScroll(false);
    if (lastFocus) lastFocus.focus();
  }
  galItems.forEach(function (el) {
    el.addEventListener('click', function () { openLightbox(+el.dataset.gal); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(+el.dataset.gal);
      }
    });
  });
  $('.lb-close', lightbox).addEventListener('click', closeLightbox);
  // RTL: prev sits on the right, next on the left
  $('.lb-prev', lightbox).addEventListener('click', function () { showLb(lbIndex - 1); });
  $('.lb-next', lightbox).addEventListener('click', function () { showLb(lbIndex + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------------- Active nav link ---------------- */
  var sections = ['menu', 'about', 'signature', 'gallery', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------------- FAB (mobile action bar) ---------------- */
  var fab = $('#fab');
  function onFab() {
    var show = window.scrollY > 520 && window.innerWidth < 1024;
    fab.hidden = !show;
    fab.classList.toggle('is-on', show);
  }
  window.addEventListener('scroll', onFab, { passive: true });
  window.addEventListener('resize', onFab);
  onFab();

  /* ---------------- Back to top ---------------- */
  $('.to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
  });

  /* ---------------- Marquee: duplicate track for seamless loop ---------------- */
  var track = $('#marquee-track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------------- body scroll lock helper ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mnav.classList.contains('is-open')) closeMnav();
  });
})();
