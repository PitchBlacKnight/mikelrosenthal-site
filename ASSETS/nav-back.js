/* nav-back.js
   Keeps the visitor's place. Every page that loads this remembers where it was
   scrolled when you leave. A link marked data-back brings you back to that spot
   instead of the top. Browser back/forward is handled the same way. */
(function () {
  var here = location.pathname.replace(/index\.html$/, '');
  var POS = 'mr:pos:' + here;
  var RET = 'mr:return';
  var read = function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  var store = function (k, v) { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) {} };

  /* remember where we were when leaving this page */
  addEventListener('pagehide', function () { store(POS, String(Math.round(window.scrollY))); });

  /* back links: flag the target page so it restores its saved spot, then navigate normally */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[data-back]') : null;
    if (!a) return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin) return;
    store(RET, u.pathname.replace(/index\.html$/, ''));
  });

  /* decide whether this load should land on the saved spot */
  var ret = read(RET);
  if (ret) store(RET, null);
  var saved = read(POS);
  if (saved == null) return;
  var y = +saved;
  var entry = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  var viaBackLink = ret === here;
  var viaHistory = !!entry && entry.type === 'back_forward' && !location.hash;
  if (!viaBackLink && !viaHistory) return;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (viaBackLink && location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  window.__restoreY = y;

  var touched = false;
  var mark = function () { touched = true; };
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) { addEventListener(ev, mark, { passive: true, once: true }); });
  /* jump straight there: a page with scroll-behavior:smooth would otherwise animate up from the top */
  var jump = function () {
    var root = document.documentElement, was = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    root.style.scrollBehavior = was;
  };
  var apply = function () { if (!touched) jump(); };
  document.addEventListener('DOMContentLoaded', apply);
  addEventListener('load', function () {
    apply();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);
  });
})();
