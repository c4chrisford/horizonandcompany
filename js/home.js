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


});  const heroVideo =
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


  /* -----------------------------------------------------
     HERO TESTIMONIALS
     ----------------------------------------------------- */

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
        i
      ) {

        const active =
          i ===
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


  /* -----------------------------------------------------
     SUBTLE HERO VIDEO MOVEMENT
     ----------------------------------------------------- */

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

    const scale =
      1.015 +
      (
        progress *
        .01
      );

    heroVideo.style.transform =
      'scale(' +
      scale +
      ')';

  }


  /* =====================================================
     PROMISE INTRO
     ===================================================== */

  const promiseIntro =
    document.querySelector(
      '.promise-intro'
    );

  const promiseStory =
    document.querySelector(
      '.promise-story'
    );


  function updatePromiseIntro() {

    if (
      !promiseIntro
    ) {

      return;

    }

    if (
      !isDesktop() ||
      reduceMotion
    ) {

      promiseIntro.classList.remove(
        'is-transitioning'
      );

      promiseIntro.classList.remove(
        'is-exiting'
      );

      return;

    }

    const rect =
      promiseIntro.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight;

    /*
       Start the split while the lower part
       of the intro approaches the middle
       of the screen.

       The intro feels like it is opening
       up to reveal the chapter sequence.
    */

    const startPoint =
      viewportHeight *
      .42;

    const endPoint =
      viewportHeight *
      .08;

    const transitionProgress =
      clamp(
        (
          startPoint -
          rect.bottom
        ) /
        (
          startPoint -
          endPoint
        )
      );

    /*
       First small movement.
    */

    promiseIntro.classList.toggle(
      'is-transitioning',
      transitionProgress > .08
    );

    /*
       Full split / fade.
    */

    promiseIntro.classList.toggle(
      'is-exiting',
      transitionProgress > .48
    );

  }


  /* =====================================================
     PROMISE STORY
     ===================================================== */

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


  function setPromiseActive(
    index
  ) {

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


    /*
       Copy stays fully visible.

       is-active only marks which chapter
       currently owns the right-hand image.
    */

    promiseCopyBlocks.forEach(
      function (
        block,
        i
      ) {

        block.classList.toggle(
          'is-active',
          i === index
        );

        block.setAttribute(
          'aria-current',
          i === index
            ? 'true'
            : 'false'
        );

      }
    );


    promiseImages.forEach(
      function (
        image,
        i
      ) {

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


  function getPromiseActiveIndex() {

    if (
      !promiseCopyBlocks.length
    ) {

      return 0;

    }

    /*
       We use a focus line at around 46% of
       viewport height.

       More importantly, we compare each block's
       top/bottom relationship to that line rather
       than just its geometric centre.

       This makes transitions happen when the next
       section genuinely becomes prominent.
    */

    const focusY =
      window.innerHeight *
      .46;

    let bestIndex = 0;
    let bestScore = Infinity;


    promiseCopyBlocks.forEach(
      function (
        block,
        index
      ) {

        const rect =
          block.getBoundingClientRect();


        /*
           If the focus line sits inside the block,
           that section should win immediately.

           We still calculate a tiny score based on
           distance from the block's upper-middle
           so transitions do not feel late.
        */

        if (
          rect.top <= focusY &&
          rect.bottom >= focusY
        ) {

          const targetPoint =
            rect.top +
            (
              rect.height *
              .42
            );

          const score =
            Math.abs(
              targetPoint -
              focusY
            );

          if (
            score <
            bestScore
          ) {

            bestScore =
              score;

            bestIndex =
              index;

          }

          return;

        }


        /*
           Otherwise choose the nearest block edge.
        */

        let distance;

        if (
          rect.top >
          focusY
        ) {

          distance =
            rect.top -
            focusY;

        } else {

          distance =
            focusY -
            rect.bottom;

        }

        if (
          distance <
          bestScore
        ) {

          bestScore =
            distance;

          bestIndex =
            index;

        }

      }
    );

    return bestIndex;

  }


  function updatePromiseProgress() {

    if (
      !promiseStory ||
      !promiseProgress
    ) {

      return;

    }

    const rect =
      promiseStory.getBoundingClientRect();

    const scrollable =
      promiseStory.offsetHeight -
      window.innerHeight;

    if (
      scrollable <= 0
    ) {

      promiseProgress.style.width =
        '0%';

      return;

    }

    const progress =
      clamp(
        -rect.top /
        scrollable
      );

    promiseProgress.style.width =
      (
        progress *
        100
      ) +
      '%';

  }


  function updatePromiseStory() {

    if (
      !promiseStory ||
      !promiseCopyBlocks.length ||
      !promiseImages.length
    ) {

      return;

    }


    /* ---------------------------------------------------
       MOBILE
       --------------------------------------------------- */

    if (
      !isDesktop()
    ) {

      promiseCopyBlocks.forEach(
        function (block) {

          block.classList.add(
            'is-active'
          );

          block.setAttribute(
            'aria-current',
            'false'
          );

        }
      );

      promiseImages.forEach(
        function (
          image,
          index
        ) {

          const active =
            index === 0;

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

      promiseActiveIndex =
        0;

      return;

    }


    /* ---------------------------------------------------
       REDUCED MOTION
       --------------------------------------------------- */

    if (
      reduceMotion
    ) {

      setPromiseActive(0);

      return;

    }


    /*
       If the whole story is still below
       the viewport, leave image 01 active.
    */

    const storyRect =
      promiseStory.getBoundingClientRect();

    if (
      storyRect.top >=
      window.innerHeight
    ) {

      setPromiseActive(0);

      updatePromiseProgress();

      return;

    }


    const activeIndex =
      getPromiseActiveIndex();

    setPromiseActive(
      activeIndex
    );

    updatePromiseProgress();

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
          threshold:.12,

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
     RESPONSIVE RESET
     ===================================================== */

  function resetResponsiveState() {

    if (
      isDesktop()
    ) {

      return;

    }

    if (
      heroVideo
    ) {

      heroVideo.style.transform =
        '';

    }


    if (
      promiseIntro
    ) {

      promiseIntro.classList.remove(
        'is-transitioning'
      );

      promiseIntro.classList.remove(
        'is-exiting'
      );

    }


    promiseCopyBlocks.forEach(
      function (block) {

        block.classList.add(
          'is-active'
        );

      }
    );


    promiseImages.forEach(
      function (
        image,
        index
      ) {

        image.classList.toggle(
          'is-active',
          index === 0
        );

      }
    );


    if (
      promiseProgress
    ) {

      promiseProgress.style.width =
        '';

    }

  }


  /* =====================================================
     SCROLL ENGINE
     ===================================================== */

  let ticking = false;


  function updateScrollEffects() {

    updateHeroVideo();

    updatePromiseIntro();

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

            resetResponsiveState();

            requestScrollUpdate();

            resizeTimer =
              null;

          },
          100
        );

    }
  );


  /* =====================================================
     IMAGE LOAD SAFETY

     Re-run positioning when late-loading images alter
     document height.
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

  setPromiseActive(0);

  resetResponsiveState();

  updateScrollEffects();

});
