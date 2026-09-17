/* =========================================================

   HORIZON & COMPANY

   HOMEPAGE JAVASCRIPT

   Homepage-only interactions:

   - Rotating hero testimonials

   - Subtle hero video movement

   - Promise intro split / fade transition

   - Promise story: free-scrolling copy + sticky crossfading images

   - Standard reveal animations

   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  const reduceMotion =

    window.matchMedia(

      '(prefers-reduced-motion: reduce)'

    ).matches;

  const DESKTOP_BREAKPOINT = 900;

  /* =====================================================

     HELPERS

     ===================================================== */

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

    promiseIntro.classList.toggle(

      'is-transitioning',

      transitionProgress > .08

    );

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

       One stable activation line.

       Each card takes over only when its own

       activation point passes the focus line.

       This prevents:

       01 -> 02 -> 01 -> 02

       and instead gives:

       01 -> 02 -> 03 -> 04 -> 05

    */

    const focusY =

      window.innerHeight *

      .48;

    let activeIndex = 0;

    promiseCopyBlocks.forEach(

      function (

        block,

        index

      ) {

        const rect =

          block.getBoundingClientRect();

        const activationPoint =

          rect.top +

          (

            rect.height *

            .32

          );

        if (

          activationPoint <=

          focusY

        ) {

          activeIndex =

            index;

        }

      }

    );

    return activeIndex;

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
