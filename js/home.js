/* =========================================================
   HORIZON & COMPANY
   HOMEPAGE JAVASCRIPT

   Homepage-only interactions:
   - Rotating hero testimonials
   - Cinematic hero video movement
   - Hero content fade as page leaves viewport
   - Standard reveal animations
   - Sticky story chapter tracking
   - Subtle image movement inside sticky story cards
   - Smooth internal anchor scrolling
   - Image / resize / Safari safeguards

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

  const motionQuery =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );


  const reduceMotion =
    motionQuery.matches;


  const DESKTOP_BREAKPOINT =
    900;


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


  function getNavHeight() {

    const styles =
      window.getComputedStyle(
        document.documentElement
      );


    const value =
      styles.getPropertyValue(
        '--nav-height'
      );


    return (
      parseFloat(value) ||
      0
    );

  }



  /* =====================================================
     HERO ELEMENTS
     ===================================================== */

  const hero =
    document.querySelector(
      '.home-hero'
    );


  const heroVideo =
    document.querySelector(
      '.home-hero-video'
    );


  const heroMain =
    document.querySelector(
      '.home-hero-main'
    );


  const heroProof =
    document.querySelector(
      '.home-hero-proof'
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


  let heroReviewIndex =
    0;


  let heroReviewTimer =
    null;


  let heroProgressAnimation =
    null;



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
            width:
              '0%'
          },
          {
            width:
              '100%'
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
     Do not let the reviews continue rotating
     while the browser tab is hidden.
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
     HERO SCROLL EFFECT

     IMPORTANT:

     CSS positions the video using inset:0.

     JS therefore writes SCALE ONLY.

     Do not add translate(-50%, -50%) here or change
     the video back to left:50%; top:50%.

     That was one of the causes of the previous hero issue.
     ===================================================== */

  function updateHero() {

    if (
      !hero
    ) {

      return;

    }


    const rect =
      hero.getBoundingClientRect();


    const heroHeight =
      Math.max(
        rect.height,
        1
      );


    /*
       How far through the hero the visitor has scrolled.

       0 = top of page
       1 = hero has completely passed
    */

    const scrollProgress =
      clamp(
        -rect.top /
        heroHeight
      );


    /*
       -----------------------------------------------------
       VIDEO SCALE
       -----------------------------------------------------

       Starts at roughly 1.015.

       Slowly moves towards 1.045 while leaving the hero.

       It feels more like a very gentle camera push
       than obvious parallax.
    */

    if (
      heroVideo
    ) {


      if (
        !isDesktop() ||
        reduceMotion
      ) {

        heroVideo.style.transform =
          '';

      } else {


        const scale =
          1.015 +
          (
            scrollProgress *
            0.03
          );


        heroVideo.style.transform =
          'scale(' +
          scale.toFixed(4) +
          ')';

      }


    }



    /*
       -----------------------------------------------------
       HERO COPY
       -----------------------------------------------------

       As the next section begins to cover the hero,
       the central proposition gently recedes.

       The movement is intentionally restrained.
    */

    if (
      heroMain
    ) {


      if (
        reduceMotion ||
        !isDesktop()
      ) {

        heroMain.style.opacity =
          '';

        heroMain.style.transform =
          '';

      } else {


        const fade =
          1 -
          clamp(
            scrollProgress *
            1.32
          );


        const translateY =
          scrollProgress *
          -22;


        heroMain.style.opacity =
          Math.max(
            0,
            fade
          ).toFixed(3);


        heroMain.style.transform =
          'translate3d(0,' +
          translateY.toFixed(2) +
          'px,0)';

      }


    }



    /*
       Social proof leaves slightly earlier than
       the main hero headline.

       This helps the transition into the next section
       feel less cluttered.
    */

    if (
      heroProof
    ) {


      if (
        reduceMotion ||
        !isDesktop()
      ) {

        heroProof.style.opacity =
          '';

      } else {


        const proofFade =
          1 -
          clamp(
            scrollProgress *
            1.7
          );


        heroProof.style.opacity =
          Math.max(
            0,
            proofFade
          ).toFixed(3);

      }


    }

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


  let revealObserver =
    null;



  function initialiseReveals() {


    /*
       Reduced motion:
       show everything immediately.
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
       Old browser fallback.
    */

    if (
      !(
        'IntersectionObserver'
        in window
      )
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
            '0px 0px -5% 0px'

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
     CINEMATIC STORY CHAPTERS

     CSS performs the actual sticky stacking.

     JS adds:
     - current chapter tracking
     - subtle image movement
     - CSS progress variables for future styling

     Importantly, the card itself is NOT transformed.
     Transforming a sticky element can cause erratic
     browser behaviour.
     ===================================================== */

  const promiseSection =
    document.querySelector(
      '.home-promise'
    );


  const promiseCards =
    Array.from(
      document.querySelectorAll(
        '.promise-card'
      )
    );


  let currentPromiseIndex =
    -1;



  function setCurrentPromiseCard(
    index
  ) {

    if (
      index ===
      currentPromiseIndex
    ) {

      return;

    }


    currentPromiseIndex =
      index;


    promiseCards.forEach(
      function (
        card,
        cardIndex
      ) {


        const current =
          cardIndex ===
          index;


        card.classList.toggle(
          'is-current',
          current
        );


        card.setAttribute(
          'data-chapter-state',
          current
            ? 'current'
            : cardIndex < index
              ? 'past'
              : 'future'
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


        const image =
          card.querySelector(
            '.promise-card-image img'
          );


        if (
          image
        ) {

          image.style.transform =
            '';

        }


      }
    );


    currentPromiseIndex =
      -1;

  }



  function updatePromiseStory() {

    if (
      !promiseSection ||
      !promiseCards.length
    ) {

      return;

    }



    /*
       CSS removes sticky stacking below 900px,
       so the extra scroll maths is unnecessary there.
    */

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
      navHeight +
      34;



    let nearestIndex =
      0;


    let nearestDistance =
      Infinity;



    promiseCards.forEach(
      function (
        card,
        index
      ) {


        const rect =
          card.getBoundingClientRect();


        /*
           Distance between this chapter and the
           sticky presentation position.
        */

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



        /*
           Progress through the individual chapter.

           This does not drive the sticky behaviour itself.
           It just gives us controlled visual movement
           within the image.
        */

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



        /*
           Visible amount gives us another hook in case
           we later want to add chapter indicators in CSS.
        */

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


        const visibleRatio =
          clamp(
            visiblePixels /
            Math.min(
              rect.height,
              window.innerHeight
            )
          );


        card.style.setProperty(
          '--chapter-visible',
          visibleRatio.toFixed(4)
        );



        /*
           Very small Ken Burns-style movement.

           Importantly, we transform only the IMAGE,
           never the sticky card.
        */

        const image =
          card.querySelector(
            '.promise-card-image img'
          );


        if (
          image
        ) {


          const scale =
            1 +
            (
              progress *
              0.022
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


          let target =
            null;


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
             Update URL without causing a second jump.
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
          once:
            true
        }
      );


      image.addEventListener(
        'error',
        function () {

          requestScrollUpdate();

        },
        {
          once:
            true
        }
      );


    }
  );



  /* =====================================================
     SCROLL ENGINE

     One requestAnimationFrame loop handles:
     - hero
     - sticky story chapters

     This avoids multiple scroll listeners fighting each
     other or forcing excessive layout calculations.
     ===================================================== */

  let ticking =
    false;


  function updateScrollEffects() {

    updateHero();

    updatePromiseStory();

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
      passive:
        true
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
               Remove inline desktop effects after
               crossing down into the mobile layout.
            */

            if (
              !isDesktop() ||
              reduceMotion
            ) {


              if (
                heroVideo
              ) {

                heroVideo.style.transform =
                  '';

              }


              if (
                heroMain
              ) {

                heroMain.style.transform =
                  '';

                heroMain.style.opacity =
                  '';

              }


              if (
                heroProof
              ) {

                heroProof.style.opacity =
                  '';

              }


              resetPromiseEffects();

            }



            requestScrollUpdate();


            resizeTimer =
              null;


          },
          120
        );


    }
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
     SAFARI BACK/FORWARD CACHE
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
