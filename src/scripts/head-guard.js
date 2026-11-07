// head-guard: inline, before first paint. Skips the load veil on return visits, restores the BB/$ choice and marks the page as having script.
(function () {
  var root = document.documentElement;
  var home = location.pathname === '/' || location.pathname === '/index.html';
  // html[data-js] lets CSS show script-only controls (burger, unit switch, pop-up buttons) from first paint, and hide them without script.
  root.dataset.js = '';
  root.dataset.unit = 'bb';
  // A module that fails to load puts the page back on its no-script layout, where everything shows.
  addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'SCRIPT') delete root.dataset.js;
  }, true);
  try {
    if (sessionStorage.getItem('hs-veil')) root.dataset.veil = 'seen';
    else if (home) sessionStorage.setItem('hs-veil', '1');
  } catch (e) {}
  try {
    if (localStorage.getItem('hs-unit') === 'usd') root.dataset.unit = 'usd';
  } catch (e) {}
})();
