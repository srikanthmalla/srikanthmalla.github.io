/*
 * Injects the shared navigation from /nav_bar.html into #nav_bar and marks the
 * current page. Plain fetch, no jQuery — index.html deliberately loads no JS
 * libraries, and the nav should not be the reason to add one.
 *
 * Usage on every page:
 *     <div id="nav_bar"></div>
 *     <script src="/js/nav.js"></script>
 */
(function () {
  var mount = document.getElementById('nav_bar');
  if (!mount) return;

  fetch('/nav_bar.html')
    .then(function (r) {
      return r.ok ? r.text() : Promise.reject(r.status);
    })
    .then(function (html) {
      mount.innerHTML = html;

      // Mark the current page. Normalise "/" and "/index.html" to the same thing.
      var here = location.pathname.replace(/\/$/, '/index.html');
      var links = mount.querySelectorAll('.navbar-nav a, .navbar-brand');

      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href').split('#')[0];
        if (href !== here) continue;
        var li = links[i].closest('li');
        if (li) li.className = (li.className + ' active').trim();
      }
    })
    .catch(function () {
      /* Nav is chrome, not content — a failure here must not break the page. */
    });
})();
