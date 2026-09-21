(function(){
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const desktop = () => innerWidth >= 900;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  /* ------- vanilla behaviours (always on) ------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  const onScrollNav = y => {
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 700 && y > lastY + 4);
    if (Math.abs(y - lastY) > 4) lastY = y;
  };
  addEventListener('scroll', () => onScrollNav(scrollY), {passive:true});

  document.querySelectorAll('.proc').forEach(proc => {
    const head = proc.querySelector('.proc-head');
    const body = proc.querySelector('.proc-body');
    const set = open => {
      proc.classList.toggle('open', open);
      head.setAttribute('aria-expanded', open);
      body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    };
    set(proc.classList.contains('open'));
    const toggle = () => {
      const opening = !proc.classList.contains('open');
      document.querySelectorAll('.proc.open').forEach(p => { if(p !== proc){
        p.classList.remove('open');
        p.querySelector('.proc-head').setAttribute('aria-expanded','false');
        p.querySelector('.proc-body').style.maxHeight = '0px';
      }});
      set(opening);
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); } });
  });
  addEventListener('resize', () => {
    document.querySelectorAll('.proc.open .proc-body').forEach(b => b.style.maxHeight = b.scrollHeight + 'px');
  });


  /* featured carousel */
  const featSlides = [...document.querySelectorAll('.feat-slide')];
  if (featSlides.length){
    const cur = document.getElementById('featCur');
    const bar = document.getElementById('featBar');
    const FEAT_MS = 7000;
    let fi = 0, ftimer = null;
    const runBar = () => {
      if (reduced || !bar) return;
      bar.style.transition = 'none'; bar.style.width = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.transition = `width ${FEAT_MS}ms linear`; bar.style.width = '100%';
      }));
    };
    const fgo = n => {
      featSlides[fi].classList.remove('on');
      fi = (n + featSlides.length) % featSlides.length;
      featSlides[fi].classList.add('on');
      cur.textContent = String(fi + 1).padStart(2, '0');
      runBar();
    };
    const fstart = () => { if (!reduced && !ftimer) { ftimer = setInterval(() => fgo(fi + 1), FEAT_MS); runBar(); } };
    const fstop = () => { clearInterval(ftimer); ftimer = null; if (bar){ bar.style.transition = 'none'; } };
    document.getElementById('featNext').addEventListener('click', () => { fstop(); fgo(fi + 1); fstart(); });
    document.getElementById('featPrev').addEventListener('click', () => { fstop(); fgo(fi - 1); fstart(); });
    const featEl = document.getElementById('feat');
    featEl.addEventListener('mouseenter', fstop);
    featEl.addEventListener('mouseleave', fstart);
    fstart();
  }

  /* case files */
  const openCase = id => {
    const cf = document.getElementById(id);
    if (!cf) return;
    cf.classList.add('open');
    cf.scrollTop = 0;
    document.body.classList.add('cf-lock');
    if (window.__lenis) window.__lenis.stop();
  };
  const closeCase = cf => {
    cf.classList.remove('open');
    document.body.classList.remove('cf-lock');
    if (window.__lenis) window.__lenis.start();
  };
  document.querySelectorAll('[data-case]').forEach(card => {
    const open = () => openCase(card.dataset.case);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });
  });
  document.querySelectorAll('[data-href]').forEach(card => {
    const go = () => { location.href = card.dataset.href; };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); go(); } });
  });
  document.querySelectorAll('.casefile').forEach(cf => {
    cf.querySelector('.cf-close').addEventListener('click', () => closeCase(cf));
    cf.addEventListener('click', e => { if (e.target === cf) closeCase(cf); });
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.casefile.open').forEach(closeCase);
  });

  /* deep links: work.html#cf-fiber opens that case file */
  const hashCase = () => { if (/^#cf-/.test(location.hash)) openCase(location.hash.slice(1)); };
  hashCase();
  addEventListener('hashchange', hashCase);

  /* hero background: 'gif' (Forever wonder) or 'video' — flip DEFAULT_HERO to switch, or preview via ?hero=video */
  const DEFAULT_HERO = 'gif';
  const heroMode = new URLSearchParams(location.search).get('hero') || DEFAULT_HERO;
  document.body.dataset.hero = heroMode;

  /* motion art: <video> replaces GIF — attach src only as each nears the viewport */
  const mvs = [...document.querySelectorAll('video.mv')];
  if (mvs.length) {
    const load = v => {
      if (v.dataset.src) { v.src = v.dataset.src; delete v.dataset.src; }
      if (!reduced) v.play().catch(() => {});
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { load(e.target); obs.unobserve(e.target); } });
      }, { rootMargin: '400px 0px' });
      mvs.forEach(v => io.observe(v));
    } else {
      mvs.forEach(load);
    }
  }

  const heroVideo = document.querySelector('.hero-bg video:not(.hero-gif)');
  if (heroVideo && heroMode === 'video' && !reduced) {
    heroVideo.preload = 'auto';
    heroVideo.play().catch(() => {});
  }

  /* PitchBlacKnight banner reel — same crossfade cadence as pitchblacknight.com */
  const pbkReel = [...document.querySelectorAll('.pbk-reel video')];
  if (pbkReel.length > 1 && !reduced) {
    let pbkAt = 0;
    setInterval(() => {
      pbkReel[pbkAt].classList.remove('on');
      pbkAt = (pbkAt + 1) % pbkReel.length;
      pbkReel[pbkAt].classList.add('on');
    }, 7000);
  }

  if (!hasGSAP || reduced) return;   // graceful static fallback

  /* ------- motion mode ------- */
  document.documentElement.classList.add('js-motion');
  gsap.registerPlugin(ScrollTrigger);

  /* Lenis smooth scroll */
  let lenis = null;
  const noSmooth = new URLSearchParams(location.search).has('nosmooth');
  if (typeof Lenis !== 'undefined' && !touch && !noSmooth){
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    lenis.on('scroll', e => { ScrollTrigger.update(); onScrollNav(e.scroll); });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- text splitting ---- */
  const splitChars = el => {
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3){
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)){ frag.appendChild(document.createTextNode(' ')); return; }
            const wrap = document.createElement('span');
            wrap.className = 'chw';
            w.split('').forEach(c => {
              const s = document.createElement('span');
              s.className = 'ch'; s.textContent = c;
              wrap.appendChild(s);
            });
            frag.appendChild(wrap);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
    return el.querySelectorAll('.ch');
  };
  const splitWords = el => {
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3){
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)){ frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'wd'; s.textContent = w;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
      });
    };
    walk(el);
    return el.querySelectorAll('.wd');
  };

  if (document.getElementById('loader') && document.getElementById('heroTitle')) {
  /* ---- preloader ---- */
  const loader = document.getElementById('loader');
  const nameEl = document.getElementById('loaderName');
  'Mikel Rosenthal'.split('').forEach((c,i) => {
    const s = document.createElement('span');
    if (c === ' '){ s.innerHTML = '&nbsp;'; }
    else if (i > 5){ const em = document.createElement('em'); em.textContent = c; s.appendChild(em); }
    else s.textContent = c;
    nameEl.appendChild(s);
  });
  if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';

  const heroChars = [];
  document.querySelectorAll('#heroTitle .split-l > span').forEach(line => heroChars.push(splitChars(line)));
  heroChars.forEach(set => gsap.set(set, {yPercent: 120, rotate: 5}));
  gsap.set('#heroEyebrow', {opacity: 0, x: -30});
  gsap.set('#heroSub', {opacity: 0, y: 30});

  const heroIntro = gsap.timeline({paused: true});
  heroIntro
    .to('#heroEyebrow', {opacity: 1, x: 0, duration: .8, ease: 'power3.out'})
    .to(heroChars[0], {yPercent: 0, rotate: 0, stagger: .022, duration: 1.15, ease: 'expo.out'}, .05)
    .to(heroChars[1], {yPercent: 0, rotate: 0, stagger: .022, duration: 1.15, ease: 'expo.out'}, .2)
    .to(heroChars[2], {yPercent: 0, rotate: 0, stagger: .022, duration: 1.15, ease: 'expo.out'}, .35)
    .to('#heroSub', {opacity: 1, y: 0, duration: .9, ease: 'power3.out'}, .75);

  const count = {v: 0};
  const countEl = document.getElementById('loaderCount');
  const barEl = document.getElementById('loaderBar');
  let loaded = false;
  addEventListener('load', () => loaded = true);

  const loadTl = gsap.timeline();
  loadTl
    .to('#loaderName span', {y: 0, yPercent: -0, stagger: .035, duration: 1, ease: 'expo.out',
        onStart(){ gsap.set('#loaderName span', {yPercent: 120}); gsap.to('#loaderName span', {yPercent: 0, stagger: .035, duration: 1, ease: 'expo.out'}); }}, 0)
    .to('#loaderTag', {opacity: 1, duration: .7}, .5)
    .to(count, {v: 100, duration: 2.1, ease: 'power2.inOut',
        onUpdate(){
          const n = Math.round(count.v);
          countEl.textContent = String(n).padStart(2,'0');
          barEl.style.width = n + '%';
        }}, 0)
    .add(() => {}, '+=0.15')
    .to(loader, {clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'expo.inOut',
        onStart(){ loader.style.clipPath = 'inset(0 0 0% 0)'; },
        onComplete(){ revealHero(); }});

  /* ---- failsafe: the hero must never depend on the preloader finishing ----
     If the tab is backgrounded during load, rAF throttling stalls the loader
     timeline and the intro would never fire — leaving a visitor on a hero with
     no headline, eyebrow, or copy. revealHero() is idempotent and also runs on
     a timer, so the page always arrives. */
  let heroRevealed = false;
  function revealHero(){
    if (heroRevealed) return;
    heroRevealed = true;
    loadTl.kill();
    loader.style.display = 'none';
    if (lenis) lenis.start(); else document.body.style.overflow = '';
    heroIntro.play();
  }
  setTimeout(revealHero, 6000);
  addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') setTimeout(revealHero, 1200);
  });
  /* last resort: if the intro itself never rendered, snap the hero to its end state */
  setTimeout(() => {
    const sub = document.getElementById('heroSub');
    if (sub && parseFloat(getComputedStyle(sub).opacity) === 0) {
      gsap.set('#heroEyebrow', {opacity: 1, x: 0});
      gsap.set('#heroSub', {opacity: 1, y: 0});
      heroChars.forEach(set => gsap.set(set, {yPercent: 0, rotate: 0}));
    }
  }, 10000);

  /* ---- hero: pinned kinetic scrub (desktop) ---- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const heroScrub = gsap.timeline({
      scrollTrigger: {trigger: '#top', start: 'top top', end: '+=70%', scrub: .6, pin: true, anticipatePin: 1}
    });
    document.querySelectorAll('#heroTitle .split-l').forEach(line => {
      heroScrub.to(line, {xPercent: parseFloat(line.dataset.kinetic), opacity: .92, ease: 'none'}, 0);
    });
    heroScrub
      .to('#heroBg', {scale: 1.18, yPercent: 8, ease: 'none'}, 0)
      /* fromTo + immediateRender:false — a plain .to() captures its start value at
         runtime, so a ScrollTrigger refresh while scrolled down locked these at
         opacity 0 and they never came back on scroll-up */
      .fromTo('#heroSub', {opacity: 1, y: 0}, {opacity: 0, y: -24, ease: 'none', immediateRender: false}, 0)
      .fromTo('#heroEyebrow', {opacity: 1}, {opacity: 0, ease: 'none', immediateRender: false}, 0);
  });
  mm.add('(max-width: 899px)', () => {
    gsap.to('#heroBg', {yPercent: 10, ease: 'none', scrollTrigger: {trigger: '#top', start: 'top top', end: 'bottom top', scrub: true}});
  });

  }

  /* ---- velocity-reactive marquees ---- */
  const marquee = (el, dur) => {
    if (!el) return null;
    const tween = gsap.to(el, {xPercent: -50, repeat: -1, duration: dur, ease: 'none', paused: true});
    const skew = gsap.quickTo(el, 'skewX', {duration: .5, ease: 'power3'});
    let settle = null;
    /* only animate while on screen — animated GIF strips are expensive */
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onToggle: self => self.isActive ? tween.play() : tween.pause()
    });
    ScrollTrigger.create({
      onUpdate(self){
        if (tween.paused()) return;
        const v = self.getVelocity();
        tween.timeScale(gsap.utils.clamp(-4, 4, 1 + v / 900));
        skew(gsap.utils.clamp(-8, 8, v / 220));
        if (settle) settle.restart(true);
        else settle = gsap.delayedCall(.15, () => {
          gsap.to(tween, {timeScale: 1, duration: .6, ease: 'power2.out', overwrite: 'auto'});
          skew(0);
        });
      }
    });
    return tween;
  };
  marquee(document.getElementById('tickerTrack'), 44);
  marquee(document.getElementById('gifRiver'), 58);

  if (document.getElementById('maniState')) {
  /* ---- manifesto: scroll-scrubbed word fill + strikethrough ---- */
  const maniWords = splitWords(document.getElementById('maniState'));
  gsap.set(maniWords, {opacity: .13});
  gsap.to(maniWords, {
    opacity: 1, stagger: .06, ease: 'none',
    scrollTrigger: {trigger: '#maniState', start: 'top 82%', end: 'bottom 45%', scrub: .5}
  });
  document.querySelectorAll('.mani-state .strike').forEach((s, i) => {
    gsap.to(s, {'--sx': 1, ease: 'none',
      scrollTrigger: {trigger: s, start: 'top 70%', end: 'top 40%', scrub: .5}});
  });

  }

  /* ---- generic reveals ---- */
  gsap.utils.toArray('.reveal').forEach(el => {
    /* bottom-of-page elements can never cross 'top 88%' — key them to their section instead */
    const fin = el.closest('.final');
    gsap.fromTo(el, {opacity: 0, y: 44}, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: {trigger: fin || el, start: fin ? 'top 70%' : 'top 88%', once: true}
    });
  });

  /* section tag rules draw in */
  gsap.utils.toArray('.sec-tag').forEach(tag => {
    gsap.fromTo(tag, {opacity: 0, x: -24}, {opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: {trigger: tag, start: 'top 90%', once: true}});
  });

  /* ---- work titles: char rise ---- */
  gsap.utils.toArray('.work-title').forEach(t => {
    const chars = splitChars(t);
    gsap.fromTo(chars, {yPercent: 110, opacity: 0}, {
      yPercent: 0, opacity: 1, stagger: .025, duration: .9, ease: 'expo.out',
      scrollTrigger: {trigger: t, start: 'top 88%', once: true}
    });
  });

  /* ---- work shots: clip reveal + inner parallax + hover tilt ---- */
  gsap.utils.toArray('.shot').forEach(shot => {
    const img = shot.querySelector('img');
    gsap.fromTo(shot, {clipPath: 'inset(12% 6% 88% 6% round 3px)', opacity: 0}, {
      clipPath: 'inset(0% 0% 0% 0% round 3px)', opacity: 1, duration: 1.35, ease: 'expo.inOut',
      scrollTrigger: {trigger: shot, start: 'top 86%', once: true}
    });
    gsap.fromTo(img, {yPercent: -3}, {yPercent: 3, ease: 'none',
      scrollTrigger: {trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true}});
    if (!touch){
      const rX = gsap.quickTo(shot, 'rotationX', {duration: .6, ease: 'power3'});
      const rY = gsap.quickTo(shot, 'rotationY', {duration: .6, ease: 'power3'});
      shot.addEventListener('mousemove', e => {
        const b = shot.getBoundingClientRect();
        rY(gsap.utils.mapRange(0, b.width, -1.5, 1.5, e.clientX - b.left));
        rX(gsap.utils.mapRange(0, b.height, 1.2, -1.2, e.clientY - b.top));
      });
      shot.addEventListener('mouseleave', () => { rX(0); rY(0); });
    }
  });

  /* work numbers drift */
  gsap.utils.toArray('.work-no').forEach(n => {
    gsap.fromTo(n, {y: 80}, {y: -40, ease: 'none',
      scrollTrigger: {trigger: n.closest('.work-item'), start: 'top bottom', end: 'bottom top', scrub: true}});
  });

  /* ---- stat counters ---- */
  gsap.utils.toArray('[data-count]').forEach(el => {
    const end = +el.dataset.count, obj = {v: 0};
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(obj, {v: end, duration: 1.8, ease: 'power4.out',
        onUpdate(){ el.textContent = Math.round(obj.v); }})
    });
  });

  if (document.getElementById('finalTitle')) {
  /* ---- final section ---- */
  const finalChars = splitChars(document.getElementById('finalTitle'));
  gsap.fromTo(finalChars, {yPercent: 120, rotate: 4}, {
    yPercent: 0, rotate: 0, stagger: .02, duration: 1.1, ease: 'expo.out',
    scrollTrigger: {trigger: '#finalTitle', start: 'top 82%', once: true}
  });
  gsap.fromTo('#finalBg', {yPercent: -10}, {yPercent: 6, ease: 'none',
    scrollTrigger: {trigger: '#contact', start: 'top bottom', end: 'bottom top', scrub: true}});

  }

  /* ---- ledger hover: floating preview follows cursor ---- */
  if (!touch){
    const peek = document.getElementById('ledgerPeek');
    if (peek){
      const pxq = gsap.quickTo(peek, 'left', {duration: .45, ease: 'power3'});
      const pyq = gsap.quickTo(peek, 'top', {duration: .45, ease: 'power3'});
      document.querySelectorAll('[data-peek]').forEach(row => {
        row.addEventListener('mouseenter', () => { peek.src = row.dataset.peek; peek.classList.add('is-on'); });
        row.addEventListener('mouseleave', () => peek.classList.remove('is-on'));
        row.addEventListener('mousemove', e => { pxq(e.clientX + 30); pyq(e.clientY); });
      });
    }
  }

  /* ---- custom cursor + magnetic (desktop pointer only) ---- */
  if (!touch){
    document.documentElement.classList.add('js-cursor','has-cursor');
    const dot = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    const label = document.getElementById('cursorLabel');
    const dx = gsap.quickTo(dot, 'x', {duration: .08, ease: 'power2'});
    const dy = gsap.quickTo(dot, 'y', {duration: .08, ease: 'power2'});
    const rxq = gsap.quickTo(ring, 'x', {duration: .38, ease: 'power3'});
    const ryq = gsap.quickTo(ring, 'y', {duration: .38, ease: 'power3'});
    addEventListener('mousemove', e => { dx(e.clientX); dy(e.clientY); rxq(e.clientX); ryq(e.clientY); });
    document.querySelectorAll('.shot, .gif-cell, .idx-card, .sys-card').forEach(el => {
      el.addEventListener('mouseenter', () => { label.textContent = el.classList.contains('gif-cell') ? 'Play' : el.classList.contains('sys-card') ? 'Read' : 'View'; ring.classList.add('is-view'); });
      el.addEventListener('mouseleave', () => ring.classList.remove('is-view'));
    });
    document.querySelectorAll('a, .proc-head').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-link'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-link'));
    });
    /* magnetic pull */
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const mx = gsap.quickTo(el, 'x', {duration: .4, ease: 'power3'});
      const my = gsap.quickTo(el, 'y', {duration: .4, ease: 'power3'});
      el.addEventListener('mousemove', e => {
        const b = el.getBoundingClientRect();
        mx((e.clientX - (b.left + b.width/2)) * .32);
        my((e.clientY - (b.top + b.height/2)) * .32);
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)'});
      });
    });
  }

  /* anchor links through Lenis */
  if (lenis){
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target){ e.preventDefault(); lenis.scrollTo(target, {offset: 0, duration: 1.4}); }
      });
    });
  }

  ScrollTrigger.refresh();
})();
