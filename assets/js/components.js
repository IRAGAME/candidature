/**
 * Composants partagés (header / footer) injectés dans chaque page.
 * Évite la duplication du code HTML.
 */
(function () {
  function inject(component, htmlPromise) {
    if (!document.getElementById(component)) return;
    htmlPromise.then(function (html) {
      var holder = document.getElementById(component);
      holder.innerHTML = html;

      // Injecter le nom du site dynamiquement
      if (window.APP_CONFIG) {
        var els = holder.querySelectorAll("[data-site-name]");
        els.forEach(function (el) {
          el.textContent = APP_CONFIG.SITE_NAME;
        });
      }
    });
  }

  var headerPromise = fetch("assets/js/partials/header.html").then(function (r) {
    return r.text();
  });
  var footerPromise = fetch("assets/js/partials/footer.html").then(function (r) {
    return r.text();
  });

  inject("sg-header-placeholder", headerPromise);
  inject("sg-footer-placeholder", footerPromise);
})();
