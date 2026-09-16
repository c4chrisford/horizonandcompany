/* =========================================================
   HORIZON & COMPANY
   HOMEPAGE JAVASCRIPT

   Homepage-only interactions:
   - Rotating hero testimonials
   - Subtle hero video movement
   - Promise story: free-scrolling copy + sticky crossfading images
   - Standard reveal animations
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DESKTOP_BREAKPOINT = 900;

  function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
  }

  function isDesktop() {
    return window.innerWidth > DESKTOP_BREAKPOINT;
  }

  /* =====================================================
     HERO TESTIMONIALS
     ===================================================== */

  const hero = document.querySelector('.home-hero');
  const heroVideo = document.querySelector('.home-hero-video');

  const heroReviews = Array.from(
    document.querySelectorAll('.home-hero-review')
  );

  const heroReviewProgress = document.querySelector(
    '.home-hero-proof-progress span'
  );

  const HERO_REVIEW_DURATION = 6500;

  let heroReviewIndex = 0;
  let heroReviewTimer = null;
  let heroProgressAnimation = null;


  function setHeroReview(index) {

    if (!heroReviews.length) {
      return;
    }

    heroReviewIndex =
      (index + heroReviews.length) %
      heroReviews.length;

    heroReviews.forEach(function (review, i) {

      const active =
        i === heroReviewIndex;

      review.classList.toggle(
        'is-active',
        active
      );

      review.setAttribute(
        'aria-hidden',
        active
          ? 'false'
          : 'true'
      );

    });

  }


  function stopHeroProgress() {

    if (heroProgressAnimation) {

      heroProgressAnimation.cancel();

      heroProgressAnimation = null;

    }

    if (heroReviewProgress) {

      heroReviewProgress.style.width =
        '0%';

    }

  }


  function startHeroProgress() {

    if (
      !heroReviewProgress ||
      reduceMotion ||
      document.hidden
    ) {

      return;

    }

    stopHeroProgress();

    if (
      typeof heroReviewProgress.animate ===
      'function'
    ) {

      heroProgressAnimation =
        heroReviewProgress.animate(
          [
            {
              width: '0%'
            },
            {
              width: '100%'
            }
          ],
          {
            duration: HERO_REVIEW_DURATION,
            easing: 'linear',
            fill: 'forwards'
          }
        );

    }

  }


  function stopHeroReviews() {

    if (heroReviewTimer) {

      window.clearTimeout(
        heroReviewTimer
      );

      heroReviewTimer = null;

    }

    stopHeroProgress();

  }


  function scheduleHeroReview() {

    stopHeroReviews();

    if (
      reduceMotion ||
      heroReviews.length < 2 ||
      document.hidden
    ) {

      return;

    }

    startHeroProgress();

    heroReviewTimer =
      window.setTimeout(
        function () {

          setHeroReview(
            heroReviewIndex + 1
          );

          scheduleHeroReview();

        },
        HERO_REVIEW_DURATION
      );

  }


  if (heroReviews.length) {

    setHeroReview(0);

    scheduleHeroReview();

  }


  document.addEventListener(
    'visibilitychange',
    function () {

      if (document.hidden) {

        stopHeroReviews();

      } else {

        scheduleHeroReview();

      }

    }
  );


  /* =====================================================
     SUBTLE HERO VIDEO MOVEMENT
     ===================================================== */

  function updateHeroVideo() {

    if (
      !hero ||
      !heroVideo
    ) {

      return;

    }

    if (
      !isDesktop() ||
      reduceMotion
    ) {

      heroVideo.style.transform =
        '';

      return;

    }

    const rect =
      hero.getBoundingClientRect();

    if (
      rect.bottom <= 0 ||
      rect.top >= window.innerHeight
    ) {

      return;

    }

    const progress =
      clamp(
        (
          window.innerHeight -
          rect.top
        ) /
        (
          window.innerHeight +
          rect.height
        )
      );

    const scale =
      1.015 +
      (
        progress *
        0.01
      );

    heroVideo.style.transform =
      'scale(' +
      scale +
      ')';

  }


  /* =====================================================
     PROMISE STORY

     LEFT:
     Text scrolls naturally through the page.

     RIGHT:
     Image stage remains sticky.

     The image only changes once the next text chapter
     becomes the dominant section around the middle
     of the viewport.
     ===================================================== */

  const promiseStory =
    document.querySelector(
      '.promise-story'
    );

  const promiseCopyBlocks =
    Array.from(
      document.querySelectorAll(
        '.promise-copy-block'
      )
    );

  const promiseImages =
    Array.from(
      document.querySelectorAll(
        '.promise-sticky-image'
      )
    );

  const promiseProgress =
    document.getElementById(
      'promise-progress-bar'
    );

  let promiseActiveIndex = -1;


  function setPromiseActive(index) {

    if (
      !promiseCopyBlocks.length ||
      !promiseImages.length
    ) {

      return;

    }

    const maxIndex =
      Math.min(
        promiseCopyBlocks.length,
        promiseImages.length
      ) - 1;

    index =
      Math.max(
        0,
        Math.min(
          index,
          maxIndex
        )
      );

    if (
      index ===
      promiseActiveIndex
    ) {

      return;

    }

    promiseActiveIndex =
      index;


    promiseCopyBlocks.forEach(
      function (block, i) {

        block.classList.toggle(
          'is-active',
          i === index
        );

      }
    );


    promiseImages.forEach(
      function (image, i) {

        const active =
          i === index;

        image.classList.toggle(
          'is-active',
          active
        );

        image.setAttribute(
          'aria-hidden',
          active
            ? 'false'
            : 'true'
        );

      }
    );

  }


  function updatePromiseStory() {

    if (
      !promiseStory ||
      !promiseCopyBlocks.length ||
      !promiseImages.length
    ) {

      return;

    }


    /*
       MOBILE / REDUCED MOTION

       Text sections simply remain visible.

       Sticky image behaviour is desktop only.
    */

    if (
      !isDesktop() ||
      reduceMotion
    ) {

      promiseCopyBlocks.forEach(
        function (block) {

          block.classList.add(
            'is-active'
          );

        }
      );

      promiseImages.forEach(
        function (image, i) {

          image.classList.toggle(
            'is-active',
            i === 0
          );

        }
      );

      return;

    }


    /*
       Focus point for deciding which text section
       currently owns the sticky image.

       Slightly above true centre works better
       because users naturally read into the
       upper-middle part of the screen.
    */

    const focusY =
      window.innerHeight *
      0.48;

    let bestIndex = 0;
    let bestDistance = Infinity;


    promiseCopyBlocks.forEach(
      function (block, index) {

        const rect =
          block.getBoundingClientRect();

        const centre =
          rect.top +
          (
            rect.height *
            0.5
          );

        const distance =
          Math.abs(
            centre -
            focusY
          );

        if (
          distance <
          bestDistance
        ) {

          bestDistance =
            distance;

          bestIndex =
            index;

        }

      }
    );


    setPromiseActive(
      bestIndex
    );


    /*
       STORY PROGRESS LINE
    */

    if (promiseProgress) {

      const rect =
        promiseStory.getBoundingClientRect();

      const scrollable =
        promiseStory.offsetHeight -
        window.innerHeight;

      const progress =
        scrollable > 0
          ? clamp(
              -rect.top /
              scrollable
            )
          : 0;

      promiseProgress.style.width =
        (
          progress *
          100
        ) +
        '%';

    }

  }


  /*
     Start with chapter 01.
  */

  setPromiseActive(0);


  /* =====================================================
     STANDARD REVEALS
     ===================================================== */

  const revealItems =
    Array.from(
      document.querySelectorAll(
        '[data-reveal]'
      )
    );


  if (reduceMotion) {

    revealItems.forEach(
      function (item) {

        item.classList.add(
          'is-visible'
        );

      }
    );

  } else if (
    'IntersectionObserver' in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (
                !entry.isIntersecting
              ) {

                return;

              }

              entry.target
                .classList
                .add(
                  'is-visible'
                );

              revealObserver.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.12,

          rootMargin:
            '0px 0px -5% 0px'
        }
      );


    revealItems.forEach(
      function (item) {

        revealObserver.observe(
          item
        );

      }
    );

  } else {

    revealItems.forEach(
      function (item) {

        item.classList.add(
          'is-visible'
        );

      }
    );

  }


  /* =====================================================
     SCROLL / RESIZE ENGINE

     One requestAnimationFrame loop handles the
     homepage scroll effects efficiently.
     ===================================================== */

  let ticking = false;


  function updateScrollEffects() {

    updateHeroVideo();

    updatePromiseStory();

  }


  function requestScrollUpdate() {

    if (ticking) {

      return;

    }

    ticking = true;

    window.requestAnimationFrame(
      function () {

        updateScrollEffects();

        ticking = false;

      }
    );

  }


  window.addEventListener(
    'scroll',
    requestScrollUpdate,
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    requestScrollUpdate
  );


  /* =====================================================
     INITIALISE
     ===================================================== */

  updateScrollEffects();

});
