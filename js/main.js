/* ============================================================
   Номос — простые слайдеры-стрелки (без библиотек)
   ============================================================ */
(function () {
  'use strict';

  function initSlider(root) {
    if (!root) return;
    var track = root.querySelector('.specialists__grid, .reviews__grid');
    var prev  = root.querySelector('.slider-arr--left');
    var next  = root.querySelector('.slider-arr--right');
    if (!track || !prev || !next) return;

    // Shift by one card width including gap
    function step() {
      var first = track.firstElementChild;
      if (!first) return 300;
      var style = window.getComputedStyle(track);
      var gap = parseInt(style.columnGap || style.gap || '20', 10) || 20;
      return first.getBoundingClientRect().width + gap;
    }

    // Use scroll only on narrow viewports where grid overflows.
    // On wide layouts, fake a scroll by translating children.
    var offset = 0;
    function apply() {
      track.style.transform = 'translateX(' + offset + 'px)';
    }
    track.style.transition = 'transform .35s ease';

    prev.addEventListener('click', function () {
      var s = step();
      var min = -(track.scrollWidth - track.clientWidth);
      offset = Math.min(0, offset + s);
      if (offset < min) offset = min;
      apply();
    });

    next.addEventListener('click', function () {
      var s = step();
      var min = -(track.scrollWidth - track.clientWidth);
      offset = Math.max(min, offset - s);
      if (offset > 0) offset = 0;
      apply();
    });

    window.addEventListener('resize', function () {
      offset = 0;
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.specialists__wrap, .reviews__wrap')
      .forEach(initSlider);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        var href = link.getAttribute('href');
        if (!href || href[0] === '#' || href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) return;

        var target = new URL(href, window.location.href);
        if (target.origin !== window.location.origin || target.pathname === window.location.pathname && target.hash) return;

        event.preventDefault();
        document.body.classList.add('is-leaving');
        window.setTimeout(function () {
          window.location.href = target.href;
        }, 150);
      });
    });
  });
})();
