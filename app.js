/* Vökuland Vellíðan — motion transplant of Vita Travel's MEASURED vocabulary (probe 2026-08-07):
   93 line-mask reveals (inner rests translateY(45px) in an overflow:hidden wrap, translate-only),
   h2 char stagger, about-paragraph char-BRIGHTEN (white-40 -> white, scrubbed), per-card child
   choreography (illustration -> head -> properties -> cost), drawing hairlines, fade-down nav,
   fade-up-big hero. Native scroll, no Lenis (reference runs none).
   Reduced motion or no-JS: fully static page. After a real resize, split texts render final. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var lenis = null;   // assigned in the motion block; the menu closes over it

  /* ---------- nav scrolled state via top sentinel (no scroll listeners) ---------- */
  var nav = document.querySelector('.nav');
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:32px;width:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  new IntersectionObserver(function (entries) {
    nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
  }).observe(sentinel);

  /* ---------- burger menu (ledger #29 pattern) ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Loka valmynd' : 'Opna valmynd');
    if (open) {
      menu.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      if (hasGsap && !reduce) {
        gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: .35, ease: 'power2.out' });
        gsap.fromTo(menu.querySelectorAll('nav a'),
          { y: 42, opacity: 0 },
          { y: 0, opacity: 1, duration: .7, stagger: .06, ease: 'power3.out', delay: .08 });
      }
    } else {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      if (hasGsap && !reduce) {
        gsap.to(menu, { opacity: 0, duration: .25, ease: 'power2.in', onComplete: function () { menu.hidden = true; gsap.set(menu, { opacity: 1 }); } });
      } else {
        menu.hidden = true;
      }
    }
  }
  burger.addEventListener('click', function () { setMenu(!menuOpen); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); } });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------- motion ---------- */
  if (!hasGsap || reduce) return; // static page: everything already visible

  document.documentElement.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll (NOTE: a deliberate departure — the reference
       runs native scroll. Wired per the required pairing: lenis drives ScrollTrigger,
       gsap.ticker drives lenis, lagSmoothing off, nested scrollers opt out via
       data-lenis-prevent, and anchors route through lenis.scrollTo.) ---------- */
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.05, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    var navH = 92;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      a.addEventListener('click', function (e) {
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -navH, duration: 1.1 });
      });
    });
  }

  var EASE = 'power3.out';
  var LINE_Y = 45;      // measured: Vita .split-line rests at translateY(45px)
  var LINE_DUR = .9;
  var LINE_STAG = .09;

  /* == split utilities ==
     wrapMask(el): ONE mask around existing children (preserves inline markup, single line)
     splitLines(el): word-split plain text, group by offsetTop into per-line masks
     Both: translate-only (mask clips, no opacity), aria-safe (aria-label + aria-hidden inner) */
  function wrapMask(el) {
    var lm = document.createElement('span');
    lm.className = 'lm';
    var inner = document.createElement('span');
    inner.className = 'lm-in';
    while (el.firstChild) inner.appendChild(el.firstChild);
    lm.appendChild(inner);
    el.appendChild(lm);
    return [inner];
  }

  function splitLines(el) {
    if (el.children.length > 0) return wrapMask(el); // markup inside: single mask
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    var words = text.split(/\s+/).filter(Boolean);
    el.textContent = '';
    var probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.textContent = w + (i < words.length - 1 ? ' ' : '');
      s.style.display = 'inline-block';
      s.style.whiteSpace = 'pre';
      probe.appendChild(s);
    });
    el.appendChild(probe);
    // group words into lines by offsetTop
    var lines = [], last = null;
    [].forEach.call(probe.children, function (w) {
      if (w.offsetTop !== last) { lines.push([]); last = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.removeChild(probe);
    var inners = [];
    lines.forEach(function (lineWords) {
      var lm = document.createElement('span');
      lm.className = 'lm';
      lm.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.className = 'lm-in';
      inner.textContent = lineWords.join('');
      lm.appendChild(inner);
      el.appendChild(lm);
      inners.push(inner);
    });
    return inners;
  }

  function maskRise(inners, trigger, extra) {
    gsap.from(inners, Object.assign({
      y: LINE_Y, duration: LINE_DUR, ease: EASE, stagger: LINE_STAG,
      scrollTrigger: { trigger: trigger, start: 'top 88%', once: true }
    }, extra || {}));
  }

  /* == h2 char-split (typewriter, measured on Vita h2s) == */
  document.querySelectorAll('.tw').forEach(function (h) {
    var text = h.textContent;
    h.setAttribute('aria-label', text);
    var frag = document.createDocumentFragment();
    text.split('').forEach(function (ch) {
      if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
      var s = document.createElement('span');
      s.className = 'tw-char';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch;
      frag.appendChild(s);
    });
    h.textContent = '';
    h.appendChild(frag);
    gsap.from(h.querySelectorAll('.tw-char'), {
      opacity: 0, duration: .5, ease: 'none', stagger: .018,
      scrollTrigger: { trigger: h, start: 'top 86%', once: true }
    });
  });

  /* == data-split="lines": the universal Vita line-mask == */
  document.querySelectorAll('[data-split="lines"]:not(.hero-sub)').forEach(function (el) {
    var inners = splitLines(el);
    maskRise(inners, el);
  });

  /* == data-split="brighten": about paragraph char colour scrub (white-40 -> white) == */
  document.querySelectorAll('[data-split="brighten"]').forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    var frag = document.createDocumentFragment();
    text.split('').forEach(function (ch) {
      if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
      var s = document.createElement('span');
      s.className = 'br-char';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch;
      s.style.color = 'rgba(242, 247, 245, .4)';
      frag.appendChild(s);
    });
    el.textContent = '';
    el.appendChild(frag);
    gsap.to(el.querySelectorAll('.br-char'), {
      color: '#F2F7F5', ease: 'none', stagger: .35,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true }
    });
  });

  /* == REVEAL — THE HANDOVER ==
     Rebuilt from the toono version, which did too much: 50 animated SVG nodes across three
     phases, a full-viewport mask repainting every frame, and 2.5s of locked scroll with no
     way out. The lesson borrowed from the Gilligogg gate is that the strongest reveal has
     no wipe and no cut. Here the wordmark rises once, into the exact position it keeps, and
     the valley settles in behind it. The cover lives INSIDE the hero, so the page is never
     blocked: scroll, keyboard and menu all work from the first frame. GPU-only (opacity +
     transform), ~1.4s, and it cannot trap anyone because it never held them. */
  var hero = document.querySelector('.hero');
  var heroMedia = document.querySelector('.hero-media');
  var cover = document.createElement('div');
  cover.className = 'hero-cover';
  cover.setAttribute('aria-hidden', 'true');
  hero.insertBefore(cover, document.querySelector('.hero-inner'));

  /* == hero + nav load choreography (starts as the aperture opens) == */
  gsap.from(nav, { y: -24, opacity: 0, duration: .8, ease: 'power2.out', delay: .55 });
  var heroTl = gsap.timeline({ delay: .15 });
  // the valley settles in behind a mark that never moves
  heroTl.to(cover, { opacity: 0, duration: 1.15, ease: 'power2.inOut' }, .3)
    .from(heroMedia, { scale: 1.06, duration: 1.9, ease: 'power2.out' }, 0)
    .from('.hero-word', { y: 40, opacity: 0, duration: .95, ease: EASE }, 0)
    .from('.hero-line2', { y: 40, opacity: 0, duration: .95, ease: EASE }, '-=.75');
  var heroSub = document.querySelector('.hero-sub');
  if (heroSub) {
    var subLines = splitLines(heroSub);
    // remove the scroll trigger the generic pass would add: hero-sub is handled here
    heroTl.from(subLines, { y: LINE_Y, duration: LINE_DUR, ease: EASE, stagger: LINE_STAG }, '-=.55');
  }
  heroTl.from('.hero-cta', { y: 32, opacity: 0, duration: .8, ease: EASE }, '-=.6');

  /* == per-card choreography (Vita: illustration -> head -> properties -> cost) == */
  document.querySelectorAll('.cards .card').forEach(function (card) {
    var media = card.querySelector('.card-media');
    var title = card.querySelector('.mask-inner');
    var meta = card.querySelector('.card-meta');
    var price = card.querySelector('.card-price');
    var metaIn = wrapMask(meta);
    var priceIn = wrapMask(price);
    var tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: 'top 90%', once: true }
    });
    tl.from(media, { y: 28, opacity: 0, duration: .85, ease: EASE })
      .from(title, { yPercent: 110, duration: .8, ease: 'expo.out' }, '-=.5')
      .from(metaIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.6')
      .from(priceIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.68');
  });

  /* == category cards: header masks + image rise (ref: label row + illustration) == */
  document.querySelectorAll('.cat-cards .cat-card').forEach(function (card, i) {
    var nameIn = wrapMask(card.querySelector('.cat-name'));
    var metaIn = wrapMask(card.querySelector('.cat-meta'));
    var tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      delay: (i % 3) * .1
    });
    tl.from(nameIn, { y: LINE_Y, duration: .85, ease: EASE })
      .from(metaIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.68')
      .from(card.querySelector('.cat-media'), { y: 34, opacity: 0, duration: .9, ease: EASE }, '-=.6');
  });

  /* == stats: hairline draws, then number + label rise per item == */
  var stats = document.querySelector('.stats');
  if (stats) {
    stats.style.position = 'relative';
    stats.style.borderTopColor = 'transparent';
    var rule = document.createElement('span');
    rule.className = 'rule-line';
    rule.setAttribute('aria-hidden', 'true');
    stats.appendChild(rule);
    gsap.from(rule, {
      scaleX: 0, duration: 1.1, ease: 'power2.inOut',
      scrollTrigger: { trigger: stats, start: 'top 88%', once: true }
    });
    stats.querySelectorAll('.stat').forEach(function (stat, i) {
      var nIn = wrapMask(stat.querySelector('.stat-n'));
      var lIn = wrapMask(stat.querySelector('.stat-l'));
      var tl = gsap.timeline({
        scrollTrigger: { trigger: stats, start: 'top 86%', once: true },
        delay: i * .1
      });
      tl.from(nIn, { y: LINE_Y, duration: .9, ease: EASE })
        .from(lIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.65');
    });
  }

  /* == steps: block rise + title/desc line-mask inside == */
  document.querySelectorAll('.steps .step').forEach(function (step, i) {
    var tIn = wrapMask(step.querySelector('.step-t'));
    var pIn = wrapMask(step.querySelector('p'));
    var tl = gsap.timeline({
      scrollTrigger: { trigger: step, start: 'top 92%', once: true },
      delay: (i % 4) * .08
    });
    tl.from(step, { y: 36, opacity: 0, duration: .85, ease: EASE })
      .from(tIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.55')
      .from(pIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.66');
  });

  /* == tiles: media rise + title/desc masks == */
  document.querySelectorAll('.tiles .tile').forEach(function (tile, i) {
    var tIn = wrapMask(tile.querySelector('.tile-t'));
    var dIn = wrapMask(tile.querySelector('.tile-d'));
    var tl = gsap.timeline({
      scrollTrigger: { trigger: tile, start: 'top 92%', once: true },
      delay: (i % 2) * .08
    });
    tl.from(tile.querySelector('.tile-media'), { y: 30, opacity: 0, duration: .85, ease: EASE })
      .from(tIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.55')
      .from(dIn, { y: LINE_Y, duration: .8, ease: EASE }, '-=.66');
  });

  /* == quotes: per-quote line-masked text + cite == */
  document.querySelectorAll('.quotes .quote').forEach(function (q, i) {
    var bLines = splitLines(q.querySelector('blockquote'));
    var cIn = wrapMask(q.querySelector('cite'));
    var tl = gsap.timeline({
      scrollTrigger: { trigger: q, start: 'top 92%', once: true },
      delay: (i % 2) * .09
    });
    tl.from(bLines, { y: LINE_Y, duration: .85, ease: EASE, stagger: LINE_STAG })
      .from(cIn, { y: LINE_Y, duration: .75, ease: EASE }, '-=.55');
  });

  /* == remaining block reveals (apt strip, media bands, booking bits) == */
  [
    { sel: '.apt-strip li', y: 40 },
    { sel: '.voices-media', y: 40 },
    { sel: '.booking-actions', y: 32 },
    { sel: '.hours', y: 28 }
  ].forEach(function (g) {
    gsap.utils.toArray(g.sel).forEach(function (el, i) {
      gsap.from(el, {
        y: g.y, opacity: 0, duration: .85, ease: EASE, delay: (i % 3) * .08,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });
  });

  /* == resize recovery: after a real width change, settle all masks/chars to final state ==
     (ledger #75: no stale one-time width gates; splits are width-dependent, so a resized
     page renders everything resolved rather than re-choreographing half-fired states) */
  var lastW = window.innerWidth;
  var rT;
  window.addEventListener('resize', function () {
    clearTimeout(rT);
    rT = setTimeout(function () {
      if (Math.abs(window.innerWidth - lastW) < 60) return;
      lastW = window.innerWidth;
      gsap.set('.lm-in, .tw-char, .br-char, .rule-line, [data-anim], .card-media, .cat-media, .tile-media, .steps .step, .apt-strip li, .voices-media, .booking-actions, .hours', { clearProps: 'transform,opacity' });
      document.querySelectorAll('.br-char').forEach(function (s) { s.style.color = ''; });
      ScrollTrigger.getAll().forEach(function (st) { if (st.vars && st.vars.once) st.kill(); });
      if (lenis) lenis.resize();
      ScrollTrigger.refresh();
    }, 280);
  });

  /* refresh once images settle so trigger positions are true (document grows) */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
