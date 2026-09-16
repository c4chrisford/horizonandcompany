/* =========================================================
   HORIZON & COMPANY
   HOMEPAGE JAVASCRIPT

   Homepage-only interactions:
   - Rotating hero testimonials
   - Subtle hero video movement
   - Hero copy fade on scroll
   - Reveal animations
   - Sticky story chapter tracking
   - Subtle image movement inside story cards
   - Smooth internal anchor scrolling
   - Resize / Safari safeguards

   IMPORTANT:
   Package cards, FAQ interactions, contact form
   and shared navigation remain handled by /js/site.js.
   ========================================================= */


document.addEventListener('DOMContentLoaded', function () {


  /* =====================================================
     GLOBAL
     ===================================================== */

  const motionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  let reduceMotion = motionQuery.matches;

  const DESKTOP_BREAKPOINT = 900;


  function clamp(value, min = 0, max = 1) {
    return Math.min(
      Math.max(value, min),
      max
    );
  }


  function isDesktop() {
    return window.innerWidth > DESKTOP_BREAKPOINT;
  }


  function getNavHeight() {

    const styles = window.getComputedStyle(
      document.documentElement
    );

    const value = styles.getPropertyValue(
      '--nav-height'
    );

    return parseFloat(value) || 0;

  }



  /* =====================================================
     HERO ELEMENTS
     ===================================================== */

  const hero = document.querySelector(
    '.home-hero'
  );

  const heroVideo = document.querySelector(
    '.home-hero-video'
  );

  const heroMain = document.querySelector(
    '.home-hero-main'
  );

  const heroProof = document.querySelector(
    '.home-hero-proof'
  );

  const heroReviews = Array.from(
    document.querySelectorAll(
      '.home-hero-review'
    )
  );

  const heroReviewProgress = document.querySelector(
    '.home-hero-proof-progress span'
  );



  /* =====================================================
     HERO TESTIMONIALS
     ===================================================== */

  const HERO_REVIEW_DURATION = 6500;

  let heroReviewIndex = 0;
  let heroReviewTimer = null;
  let heroProgressAnimation = null;


  function setHeroReview(index) {

    if (!heroReviews.length) {
      return;
    }

    heroReviewIndex =
      (
        index +
        heroReviews.length
      ) %
      heroReviews.length;

    heroReviews.forEach(function (
      review,
      reviewIndex
    ) {

      const active =
        reviewIndex === heroReviewIndex;

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
      heroReviewProgress.style.width = '0%';
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

    heroReviewProgress.style.width = '0%';

    if (
      typeof heroReviewProgress.animate !==
      'function'
    ) {
      return;
    }

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



  /* =====================================================
     PAGE VISIBILITY

     Stop testimonial animation while the browser tab
     is hidden, then restart it when visible again.
     ===================================================== */

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
     HERO SCROLL EFFECT
     ===================================================== */

  function resetHeroEffects() {

    if (heroVideo) {
      heroVideo.style.transform = '';
    }

    if (heroMain) {
      heroMain.style.opacity = '';
      heroMain.style.transform = '';
    }

    if (heroProof) {
      heroProof.style.opacity = '';
    }

  }


  function updateHero() {

    if (!hero) {
      return;
    }

    if (
      !isDesktop() ||
      reduceMotion
    ) {

      resetHeroEffects();

      return;

    }

    const rect =
      hero.getBoundingClientRect();

    const heroHeight =
      Math.max(
        rect.height,
        1
      );

    const progress =
      clamp(
        -rect.top /
        heroHeight
      );


    /* -----------------------------------------------
       VIDEO MOVEMENT
       ----------------------------------------------- */

    if (heroVideo) {

      const scale =
        1.01 +
        (
          progress *
          0.025
        );

      heroVideo.style.transform =
        'scale(' +
        scale.toFixed(4) +
        ')';

    }


    /* -----------------------------------------------
       HERO COPY
       ----------------------------------------------- */

    if (heroMain) {

      const opacity =
        1 -
        clamp(
          progress *
          1.25
        );

      const translateY =
        progress *
        -18;

      heroMain.style.opacity =
        opacity.toFixed(3);

      heroMain.style.transform =
        'translate3d(0,' +
        translateY.toFixed(2) +
        'px,0)';

    }


    /* -----------------------------------------------
       HERO REVIEW
       ----------------------------------------------- */

    if (heroProof) {

      const opacity =
        1 -
        clamp(
          progress *
          1.55
        );

      heroProof.style.opacity =
        opacity.toFixed(3);

    }

  }



  /* =====================================================
     REVEAL ANIMATIONS
     ===================================================== */

  const revealItems = Array.from(
    document.querySelectorAll(
      '[data-reveal]'
    )
  );

  let revealObserver = null;


  function revealEverything() {

    revealItems.forEach(function (item) {

      item.classList.add(
        'is-visible'
      );

    });

  }


  function initialiseReveals() {

    if (reduceMotion) {

      revealEverything();

      return;

    }

    if (
      !(
        'IntersectionObserver'
        in window
      )
    ) {

      revealEverything();

      return;

    }

    revealObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              if (!entry.isIntersecting) {
                return;
              }

              entry.target.classList.add(
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
            '0px 0px -7% 0px'
        }
      );

    revealItems.forEach(
      function (item) {

        if (
          item.classList.contains(
            'is-visible'
          )
        ) {
          return;
        }

        revealObserver.observe(
          item
        );

      }
    );

  }


  initialiseReveals();



  /* =====================================================
     STORY CARDS
     ===================================================== */

  const promiseSection = document.querySelector(
    '.home-promise'
  );

  const promiseCards = Array.from(
    document.querySelectorAll(
      '.promise-card'
    )
  );

  let currentPromiseIndex = -1;


  function setCurrentPromiseCard(index) {

    if (
      index ===
      currentPromiseIndex
    ) {
      return;
    }

    currentPromiseIndex = index;

    promiseCards.forEach(
      function (
        card,
        cardIndex
      ) {

        const current =
          cardIndex === index;

        card.classList.toggle(
          'is-current',
          current
        );

        let state = 'future';

        if (current) {
          state = 'current';
        } else if (
          cardIndex < index
        ) {
          state = 'past';
        }

        card.setAttribute(
          'data-chapter-state',
          state
        );

      }
    );

  }


  function resetPromiseEffects() {

    promiseCards.forEach(
      function (card) {

        card.style.removeProperty(
          '--chapter-progress'
        );

        card.style.removeProperty(
          '--chapter-visible'
        );

        card.classList.remove(
          'is-current'
        );

        card.removeAttribute(
          'data-chapter-state'
        );

        const image =
          card.querySelector(
            '.promise-card-image img'
          );

        if (image) {
          image.style.transform = '';
        }

      }
    );

    currentPromiseIndex = -1;

  }


  function updatePromiseStory() {

    if (
      !promiseSection ||
      !promiseCards.length
    ) {
      return;
    }

    if (
      !isDesktop() ||
      reduceMotion
    ) {

      resetPromiseEffects();

      return;

    }

    const navHeight =
      getNavHeight();

    const stickyOffset =
      navHeight + 32;

    let nearestIndex = 0;
    let nearestDistance = Infinity;


    promiseCards.forEach(
      function (
        card,
        index
      ) {

        const rect =
          card.getBoundingClientRect();


        /* -------------------------------------------
           CURRENT CHAPTER
           ------------------------------------------- */

        const distance =
          Math.abs(
            rect.top -
            stickyOffset
          );

        if (
          distance <
          nearestDistance
        ) {

          nearestDistance =
            distance;

          nearestIndex =
            index;

        }


        /* -------------------------------------------
           CARD PROGRESS
           ------------------------------------------- */

        const travel =
          Math.max(
            window.innerHeight,
            rect.height
          );

        const progress =
          clamp(
            (
              stickyOffset -
              rect.top
            ) /
            travel
          );

        card.style.setProperty(
          '--chapter-progress',
          progress.toFixed(4)
        );


        /* -------------------------------------------
           VISIBLE RATIO
           ------------------------------------------- */

        const visibleTop =
          Math.max(
            rect.top,
            0
          );

        const visibleBottom =
          Math.min(
            rect.bottom,
            window.innerHeight
          );

        const visiblePixels =
          Math.max(
            0,
            visibleBottom -
            visibleTop
          );

        const divisor =
          Math.max(
            1,
            Math.min(
              rect.height,
              window.innerHeight
            )
          );

        const visibleRatio =
          clamp(
            visiblePixels /
            divisor
          );

        card.style.setProperty(
          '--chapter-visible',
          visibleRatio.toFixed(4)
        );


        /* -------------------------------------------
           SUBTLE IMAGE MOVEMENT
           ------------------------------------------- */

        const image =
          card.querySelector(
            '.promise-card-image img'
          );

        if (image) {

          const scale =
            1 +
            (
              progress *
              0.018
            );

          image.style.transform =
            'scale(' +
            scale.toFixed(4) +
            ')';

        }

      }
    );


    setCurrentPromiseCard(
      nearestIndex
    );

  }



  /* =====================================================
     SMOOTH INTERNAL ANCHOR SCROLLING
     ===================================================== */

  const internalLinks = Array.from(
    document.querySelectorAll(
      'a[href^="#"]'
    )
  );


  internalLinks.forEach(
    function (link) {

      link.addEventListener(
        'click',
        function (event) {

          const href =
            link.getAttribute(
              'href'
            );

          if (
            !href ||
            href === '#'
          ) {
            return;
          }

          let target = null;

          try {

            target =
              document.querySelector(
                href
              );

          } catch (error) {

            return;

          }

          if (!target) {
            return;
          }

          if (reduceMotion) {
            return;
          }

          event.preventDefault();

          const navHeight =
            getNavHeight();

          const targetTop =
            target
              .getBoundingClientRect()
              .top +
            window.scrollY -
            navHeight;

          window.scrollTo(
            {
              top:
                Math.max(
                  0,
                  targetTop
                ),
              behavior:
                'smooth'
            }
          );


          if (
            window.history &&
            typeof window.history.pushState ===
            'function'
          ) {

            window.history.pushState(
              null,
              '',
              href
            );

          }

        }
      );

    }
  );



  /* =====================================================
     IMAGE LOAD SAFETY
     ===================================================== */

  const homepageImages = Array.from(
    document.querySelectorAll(
      [
        '.home-stories img',
        '.home-promise img',
        '.home-process img',
        '.home-partner img',
        '.home-locations img'
      ].join(',')
    )
  );


  homepageImages.forEach(
    function (image) {

      if (image.complete) {
        return;
      }

      image.addEventListener(
        'load',
        function () {

          requestScrollUpdate();

        },
        {
          once: true
        }
      );

      image.addEventListener(
        'error',
        function () {

          requestScrollUpdate();

        },
        {
          once: true
        }
      );

    }
  );



  /* =====================================================
     SCROLL ENGINE
     ===================================================== */

  let ticking = false;


  function updateScrollEffects() {

    updateHero();

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



  /* =====================================================
     RESIZE
     ===================================================== */

  let resizeTimer = null;


  function handleResize() {

    if (resizeTimer) {

      window.clearTimeout(
        resizeTimer
      );

    }

    resizeTimer =
      window.setTimeout(
        function () {

          if (
            !isDesktop() ||
            reduceMotion
          ) {

            resetHeroEffects();

            resetPromiseEffects();

          }

          requestScrollUpdate();

          resizeTimer = null;

        },
        120
      );

  }


  window.addEventListener(
    'resize',
    handleResize
  );



  /* =====================================================
     ORIENTATION CHANGE
     ===================================================== */

  window.addEventListener(
    'orientationchange',
    function () {

      window.setTimeout(
        function () {

          requestScrollUpdate();

        },
        180
      );

    }
  );



  /* =====================================================
     REDUCED MOTION CHANGES
     ===================================================== */

  if (
    typeof motionQuery.addEventListener ===
    'function'
  ) {

    motionQuery.addEventListener(
      'change',
      function (event) {

        reduceMotion =
          event.matches;

        if (reduceMotion) {

          stopHeroReviews();

          resetHeroEffects();

          resetPromiseEffects();

          revealEverything();

        } else {

          scheduleHeroReview();

          requestScrollUpdate();

        }

      }
    );

  }



  /* =====================================================
     SAFARI BACK / FORWARD CACHE
     ===================================================== */

  window.addEventListener(
    'pageshow',
    function () {

      requestScrollUpdate();

      if (
        !document.hidden
      ) {

        scheduleHeroReview();

      }

    }
  );



  /* =====================================================
     FULL PAGE LOAD
     ===================================================== */

  window.addEventListener(
    'load',
    function () {

      requestScrollUpdate();

    }
  );



  /* =====================================================
     INITIALISE
     ===================================================== */

  updateScrollEffects();


});
