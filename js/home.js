/* =========================================================
   HORIZON & COMPANY
   HOMEPAGE JAVASCRIPT

   Homepage-only interactions:
   - Rotating hero testimonials
   - Subtle hero video movement
   - Standard reveal animations
   - Smooth internal anchor scrolling
   - Small accessibility / resize safeguards

   IMPORTANT:
   - Package cards
   - FAQ interactions
   - Contact form
   - Shared navigation

   remain handled by /js/site.js.
   ========================================================= */


document.addEventListener('DOMContentLoaded', function () {


  /* =====================================================
     GLOBAL
     ===================================================== */

  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  const DESKTOP_BREAKPOINT = 900;


  function clamp(
    value,
    min = 0,
    max = 1
  ) {

    return Math.min(
      Math.max(
        value,
        min
      ),
      max
    );

  }


  function isDesktop() {

    return (
      window.innerWidth >
      DESKTOP_BREAKPOINT
    );

  }



  /* =====================================================
     HERO
     ===================================================== */

  const hero =
    document.querySelector(
      '.home-hero'
    );


  const heroVideo =
    document.querySelector(
      '.home-hero-video'
    );


  const heroReviews =
    Array.from(
      document.querySelectorAll(
        '.home-hero-review'
      )
    );


  const heroReviewProgress =
    document.querySelector(
      '.home-hero-proof-progress span'
    );


  const HERO_REVIEW_DURATION =
    6500;


  let heroReviewIndex = 0;

  let heroReviewTimer = null;

  let heroProgressAnimation = null;



  /* =====================================================
     HERO TESTIMONIALS
     ===================================================== */

  function setHeroReview(
    index
  ) {

    if (
      !heroReviews.length
    ) {

      return;

    }


    heroReviewIndex =
      (
        index +
        heroReviews.length
      ) %
      heroReviews.length;


    heroReviews.forEach(
      function (
        review,
        reviewIndex
      ) {

        const active =
          reviewIndex ===
          heroReviewIndex;


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

      }
    );

  }



  function stopHeroProgress() {

    if (
      heroProgressAnimation
    ) {

      heroProgressAnimation.cancel();

      heroProgressAnimation =
        null;

    }


    if (
      heroReviewProgress
    ) {

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


    heroReviewProgress.style.width =
      '0%';


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
            width:'0%'
          },
          {
            width:'100%'
          }
        ],
        {
          duration:
            HERO_REVIEW_DURATION,

          easing:
            'linear',

          fill:
            'forwards'
        }
      );

  }



  function stopHeroReviews() {

    if (
      heroReviewTimer
    ) {

      window.clearTimeout(
        heroReviewTimer
      );


      heroReviewTimer =
        null;

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



  if (
    heroReviews.length
  ) {

    setHeroReview(0);

    scheduleHeroReview();

  }



  /*
     Pause rotating reviews when the browser tab
     isn't visible.

     This stops the review sequence skipping ahead
     while somebody is in another tab.
  */

  document.addEventListener(
    'visibilitychange',
    function () {


      if (
        document.hidden
      ) {

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


    /*
       Keep mobile simpler and avoid unnecessary
       GPU work on smaller devices.
    */

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


    /*
       Hero is outside the viewport.
       No reason to update its transform.
    */

    if (
      rect.bottom <= 0 ||
      rect.top >=
      window.innerHeight
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


    /*
       Very restrained movement.

       Base:
       1.015

       Maximum:
       approximately 1.025

       Enough to stop the hero feeling completely static
       without looking like an obvious parallax effect.
    */

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
     STANDARD REVEALS
     ===================================================== */

  const revealItems =
    Array.from(
      document.querySelectorAll(
        '[data-reveal]'
      )
    );


  if (
    reduceMotion
  ) {


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

          threshold:
            0.12,

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


    /*
       Old browser fallback.
    */

    revealItems.forEach(
      function (item) {

        item.classList.add(
          'is-visible'
        );

      }
    );

  }



  /* =====================================================
     INTERNAL ANCHOR SCROLLING
     ===================================================== */

  const internalLinks =
    Array.from(
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


          const target =
            document.querySelector(
              href
            );


          if (
            !target
          ) {

            return;

          }


          /*
             Let reduced-motion users retain the
             browser's normal immediate jump.
          */

          if (
            reduceMotion
          ) {

            return;

          }


          event.preventDefault();


          /*
             Account for the fixed / sticky navigation
             if --nav-height is defined globally.

             We calculate it rather than relying on
             scroll-margin-top being present.
          */

          const rootStyles =
            window.getComputedStyle(
              document.documentElement
            );


          const navHeightValue =
            rootStyles.getPropertyValue(
              '--nav-height'
            );


          const navHeight =
            parseFloat(
              navHeightValue
            ) || 0;


          const targetTop =
            target
              .getBoundingClientRect()
              .top +
            window.scrollY -
            navHeight;


          window.scrollTo(
            {
              top:
                targetTop,

              behavior:
                'smooth'
            }
          );


        }
      );


    }
  );



  /* =====================================================
     OPTIONAL IMAGE LOAD REVEAL SAFETY

     When lazy images load after the page has already
     rendered, request a frame so the hero transform and
     viewport calculations remain current.
     ===================================================== */

  const homepageImages =
    Array.from(
      document.querySelectorAll(
        '.home-stories img,' +
        '.home-promise img,' +
        '.home-process img,' +
        '.home-partner img,' +
        '.home-locations img'
      )
    );


  homepageImages.forEach(
    function (image) {


      if (
        image.complete
      ) {

        return;

      }


      image.addEventListener(
        'load',
        function () {

          requestScrollUpdate();

        },
        {
          once:true
        }
      );


    }
  );



  /* =====================================================
     SCROLL ENGINE

     Only the hero currently needs continuous
     scroll-driven calculations.

     Everything else uses IntersectionObserver
     or CSS hover / transition states.
     ===================================================== */

  let ticking = false;


  function updateScrollEffects() {

    updateHeroVideo();

  }



  function requestScrollUpdate() {

    if (
      ticking
    ) {

      return;

    }


    ticking =
      true;


    window.requestAnimationFrame(
      function () {


        updateScrollEffects();


        ticking =
          false;


      }
    );

  }



  window.addEventListener(
    'scroll',
    requestScrollUpdate,
    {
      passive:true
    }
  );



  /* =====================================================
     RESIZE
     ===================================================== */

  let resizeTimer =
    null;


  window.addEventListener(
    'resize',
    function () {


      if (
        resizeTimer
      ) {

        window.clearTimeout(
          resizeTimer
        );

      }


      resizeTimer =
        window.setTimeout(
          function () {


            /*
               If we've crossed onto mobile,
               explicitly clear any transform
               previously written by desktop JS.
            */

            if (
              !isDesktop() &&
              heroVideo
            ) {

              heroVideo.style.transform =
                '';

            }


            requestScrollUpdate();


            resizeTimer =
              null;


          },
          100
        );


    }
  );



  /* =====================================================
     PAGE LOAD SAFETY
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
