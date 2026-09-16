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
     Pause testimonial rotation while
     the browser tab is not visible.
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
       Hero completely outside viewport.
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
       Restrained scale movement only.

       Approx range:
       1.015 -> 1.025
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


  let revealObserver = null;


  function initialiseReveals() {

    /*
       Reduced motion:
       expose everything immediately.
    */

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


      return;

    }


    /*
       Browser without IntersectionObserver:
       expose everything rather than risk hidden content.
    */

    if (
      !('IntersectionObserver' in window)
    ) {


      revealItems.forEach(
        function (item) {

          item.classList.add(
            'is-visible'
          );

        }
      );


      return;

    }


    revealObserver =
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


              if (
                revealObserver
              ) {

                revealObserver.unobserve(
                  entry.target
                );

              }


            }
          );


        },
        {

          threshold:
            0.1,

          rootMargin:
            '0px 0px -4% 0px'

        }
      );


    revealItems.forEach(
      function (item) {


        /*
           If the element has somehow already been
           revealed, don't observe it again.
        */

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
     INTERNAL ANCHOR SCROLLING
     ===================================================== */

  const internalLinks =
    Array.from(
      document.querySelectorAll(
        'a[href^="#"]'
      )
    );


  function getNavHeight() {

    const rootStyles =
      window.getComputedStyle(
        document.documentElement
      );


    const navHeightValue =
      rootStyles.getPropertyValue(
        '--nav-height'
      );


    return (
      parseFloat(
        navHeightValue
      ) || 0
    );

  }


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


          if (
            !target
          ) {

            return;

          }


          /*
             Respect reduced-motion preference.
             Browser performs normal anchor behaviour.
          */

          if (
            reduceMotion
          ) {

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


          /*
             Keep the address bar / history useful
             without causing a second browser jump.
          */

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


      image.addEventListener(
        'error',
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

     Only the hero requires continuous
     scroll-driven calculation now.

     Promise cards, wedding features, locations,
     process and partner sections use CSS + reveals.
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
               Clear any inline desktop transform when
               switching into the mobile breakpoint.

               CSS can then fully control the video again.
            */

            if (
              heroVideo &&
              (
                !isDesktop() ||
                reduceMotion
              )
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
     ORIENTATION CHANGE

     Particularly useful on iPhone / iPad where
     viewport dimensions can lag during rotation.
     ===================================================== */

  window.addEventListener(
    'orientationchange',
    function () {


      window.setTimeout(
        function () {

          requestScrollUpdate();

        },
        150
      );


    }
  );



  /* =====================================================
     BF CACHE SAFETY

     Safari can restore a page from back-forward cache.
     Recalculate hero state when that happens.
     ===================================================== */

  window.addEventListener(
    'pageshow',
    function () {

      requestScrollUpdate();

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
