/*
 * Injects the shared icon navigation from /nav_bar.html into #nav_bar and marks
 * the current page. Plain fetch, no jQuery — the site pages load no JS
 * libraries and the nav should not be the reason to add one.
 *
 * Usage on every page:
 *     <div id="nav_bar"></div>
 *     <link rel="stylesheet" href="/css/site.css">
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

      // Normalise "/" and "/foo/" to the index file they actually serve.
      var here = location.pathname;
      if (here === '/' || here.charAt(here.length - 1) === '/') here += 'index.html';

      var links = mount.querySelectorAll('a[href]');
      for (var i = 0; i < links.length; i++) {
        var raw = links[i].getAttribute('href');
        // Anchors point at a section of a page, not at a page — marking them
        // current would light up both "Home" and "Papers" on the home page.
        if (raw.indexOf('#') !== -1) continue;
        var href = raw;
        if (href.charAt(href.length - 1) === '/') href += 'index.html';
        if (href === here) links[i].className += ' is-current';
      }
    })
    .catch(function () {
      /* Nav is chrome, not content — a failure here must not break the page. */
    });
})();
