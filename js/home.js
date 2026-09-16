/* =========================================================
   HORIZON & COMPANY
   HOMEPAGE JAVASCRIPT

   Load with:
   <script src="/js/home.js" defer></script>

   Built for the current homepage structure:
   - Static cinematic hero
   - Rotating hero testimonials
   - Scroll-driven wedding-day image story
   - Scroll-driven "what film preserves" story
   - Standard reveal animations
   - Packages
   - FAQ
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {


  /* =======================================================
     GLOBAL HELPERS
     ======================================================= */

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  const clamp = function (
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

  };


  const sectionProgress = function (section) {

    if (!section) {
      return 0;
    }

    const rect =
      section.getBoundingClientRect();

    const available =
      section.offsetHeight -
      window.innerHeight;

    if (available <= 0) {
      return 0;
    }

    return clamp(
      (-rect.top) / available
    );

  };



  /* =======================================================
     HERO
     STATIC FILM + ROTATING SOCIAL PROOF

     The hero itself no longer scrolls through scenes.

     Instead:
     - Main headline remains stable.
     - Buttons remain stable.
     - Video continues playing.
     - Two small Google reviews alternate beneath.
     ======================================================= */

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


  let heroReviewIndex = 0;

  let heroReviewTimer = null;

  let heroProgressAnimation = null;


  const HERO_REVIEW_DURATION = 6500;



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



  function resetHeroProgress() {

    if (!heroReviewProgress) {
      return;
    }


    if (heroProgressAnimation) {

      heroProgressAnimation.cancel();

      heroProgressAnimation = null;

    }


    heroReviewProgress.style.width =
      '0%';


    if (
      reduceMotion ||
      document.hidden
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

    if (heroReviewTimer) {

      clearTimeout(
        heroReviewTimer
      );

      heroReviewTimer = null;

    }


    if (heroProgressAnimation) {

      heroProgressAnimation.cancel();

      heroProgressAnimation = null;

    }

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


    resetHeroProgress();


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



  /*
     Pause review switching while the page
     is not visible.

     No point animating unseen content and
     this stops reviews jumping ahead when
     someone returns to the tab.
  */

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



  /*
     Slight video movement.

     This is deliberately tiny.

     It prevents the hero feeling completely
     static without recreating the previous
     scroll-controlled hero.
  */

  function updateHeroVideo() {

    if (
      !hero ||
      !heroVideo ||
      reduceMotion ||
      window.innerWidth <= 900
    ) {

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


    const visibleProgress =
      clamp(
        -rect.top /
        Math.max(
          hero.offsetHeight,
          1
        )
      );


    const scale =
      1.015 +
      (
        visibleProgress *
        .01
      );


    heroVideo.style.transform =
      'scale(' +
      scale +
      ')';

  }



  /* =======================================================
     WEDDING DAY
     FIXED LEFT-HAND MESSAGE +
     FOUR IMAGE MOMENTS

     Each photograph occupies a proper part
     of the scroll rather than several images
     remaining visible at once.
     ======================================================= */

  const feelingSection =
    document.querySelector(
      '.home-feeling'
    );


  const feelingShots =
    Array.from(
      document.querySelectorAll(
        '.feeling-shot'
      )
    );


  const feelingWord =
    document.querySelector(
      '.home-feeling-word'
    );


  const feelingProgress =
    document.querySelector(
      '#feeling-progress-bar'
    );


  const feelingChapterLabel =
    document.querySelector(
      '.feeling-chapter-label'
    );


  const feelingChapterCopy =
    document.querySelector(
      '.feeling-chapter-copy'
    );


  let feelingActiveIndex = -1;



  function setFeelingChapter(
    index
  ) {

    if (
      index < 0 ||
      index >= feelingShots.length
    ) {

      return;

    }


    if (
      index ===
      feelingActiveIndex
    ) {

      return;

    }


    feelingActiveIndex =
      index;


    const shot =
      feelingShots[index];


    const label =
      shot.getAttribute(
        'data-label'
      );


    const copy =
      shot.getAttribute(
        'data-copy'
      );


    const word =
      shot.getAttribute(
        'data-word'
      );


    /*
       Make text transition rather than
       instantly swapping.
    */

    if (
      feelingChapterLabel ||
      feelingChapterCopy
    ) {

      if (feelingChapterLabel) {

        feelingChapterLabel.style.opacity =
          '0';

        feelingChapterLabel.style.transform =
          'translateY(5px)';

      }


      if (feelingChapterCopy) {

        feelingChapterCopy.style.opacity =
          '0';

        feelingChapterCopy.style.transform =
          'translateY(7px)';

      }


      window.setTimeout(
        function () {

          if (
            feelingChapterLabel &&
            label
          ) {

            feelingChapterLabel.textContent =
              label;


            feelingChapterLabel.style.opacity =
              '1';


            feelingChapterLabel.style.transform =
              'translateY(0)';

          }


          if (
            feelingChapterCopy &&
            copy
          ) {

            feelingChapterCopy.textContent =
              copy;


            feelingChapterCopy.style.opacity =
              '1';


            feelingChapterCopy.style.transform =
              'translateY(0)';

          }

        },
        reduceMotion
          ? 0
          : 150
      );

    }


    if (
      feelingWord &&
      word
    ) {

      feelingWord.textContent =
        word;

    }

  }



  function updateFeeling() {

    if (
      !feelingSection ||
      !feelingShots.length ||
      window.innerWidth <= 900 ||
      reduceMotion
    ) {

      return;

    }


    const progress =
      sectionProgress(
        feelingSection
      );


    if (feelingProgress) {

      feelingProgress.style.width =
        (
          progress *
          100
        ) +
        '%';

    }


    /*
       Leave a little breathing room at
       beginning and end of the pinned section.
    */

    const galleryProgress =
      clamp(
        (
          progress -
          .035
        ) /
        .93
      );


    const position =
      galleryProgress *
      (
        feelingShots.length -
        1
      );


    /*
       Crossfade envelope.

       The previous image fades out while
       the incoming photograph gently rises.
    */

    feelingShots.forEach(
      function (
        shot,
        index
      ) {

        const relative =
          index -
          position;


        const distance =
          Math.abs(
            relative
          );


        let opacity =
          1 -
          (
            distance *
            1.45
          );


        opacity =
          clamp(
            opacity
          );


        /*
           Prevent distant neighbouring images
           creating the washed-out double image
           problem we had earlier.
        */

        if (
          distance >
          .72
        ) {

          opacity = 0;

        }


        const y =
          relative *
          32;


        const scale =
          1.025 +
          (
            clamp(
              1 -
              distance
            ) *
            .012
          );


        shot.style.opacity =
          opacity;


        shot.style.transform =
          'translate3d(0,' +
          y +
          'px,0) scale(' +
          scale +
          ')';


        shot.classList.toggle(
          'is-active',
          distance < .5
        );

      }
    );


    const activeIndex =
      clamp(
        Math.round(
          position
        ),
        0,
        feelingShots.length - 1
      );


    setFeelingChapter(
      activeIndex
    );


    /*
       Background word moves almost
       imperceptibly.

       Enough depth to feel intentional,
       not enough to distract.
    */

    if (feelingWord) {

      const x =
        (
          galleryProgress -
          .5
        ) *
        24;


      const y =
        (
          galleryProgress -
          .5
        ) *
        -35;


      feelingWord.style.transform =
        'translate3d(' +
        'calc(-50% + ' +
        x +
        'px),' +
        'calc(-50% + ' +
        y +
        'px),' +
        '0)';

    }

  }



  /* =======================================================
     WHAT FILM GIVES YOU

     INTRO
     ->
     VOICES
     ->
     ATMOSPHERE
     ->
     PEOPLE

     Alternates image/text position via CSS.
     ======================================================= */

  const promiseSection =
    document.querySelector(
      '.home-promise'
    );


  const promiseScenes =
    Array.from(
      document.querySelectorAll(
        '.promise-scene'
      )
    );


  const promiseProgress =
    document.querySelector(
      '#promise-progress-bar'
    );


  const promiseWord =
    document.querySelector(
      '.home-promise-word'
    );



  function updatePromise() {

    if (
      !promiseSection ||
      !promiseScenes.length ||
      window.innerWidth <= 900 ||
      reduceMotion
    ) {

      return;

    }


    const progress =
      sectionProgress(
        promiseSection
      );


    if (promiseProgress) {

      promiseProgress.style.width =
        (
          progress *
          100
        ) +
        '%';

    }


    /*
       Give first and final scenes
       slightly longer dwell time.
    */

    const storyProgress =
      clamp(
        (
          progress -
          .025
        ) /
        .95
      );


    const position =
      storyProgress *
      (
        promiseScenes.length -
        1
      );


    promiseScenes.forEach(
      function (
        scene,
        index
      ) {

        const relative =
          index -
          position;


        const distance =
          Math.abs(
            relative
          );


        /*
           Fairly narrow transition prevents
           two full text panels remaining
           readable at once.
        */

        let opacity =
          1 -
          (
            distance *
            1.55
          );


        opacity =
          clamp(
            opacity
          );


        if (
          distance >
          .7
        ) {

          opacity = 0;

        }


        const y =
          relative *
          42;


        const scale =
          1 -
          (
            Math.min(
              distance,
              1
            ) *
            .012
          );


        scene.style.opacity =
          opacity;


        scene.style.transform =
          'translate3d(0,' +
          y +
          'px,0) scale(' +
          scale +
          ')';


        scene.classList.toggle(
          'is-active',
          distance < .48
        );


        /*
           Very gentle independent image motion
           gives the frame some depth.
        */

        const image =
          scene.querySelector(
            '.promise-image img'
          );


        if (
          image &&
          !reduceMotion
        ) {

          const imageY =
            relative *
            -12;


          image.style.transform =
            'scale(1.045) translate3d(0,' +
            imageY +
            'px,0)';

        }

      }
    );


    if (promiseWord) {

      const x =
        (
          storyProgress -
          .5
        ) *
        -60;


      const y =
        (
          storyProgress -
          .5
        ) *
        20;


      promiseWord.style.transform =
        'translate3d(' +
        'calc(-50% + ' +
        x +
        'px),' +
        'calc(-50% + ' +
        y +
        'px),' +
        '0)';

    }

  }



  /* =======================================================
     STANDARD REVEALS
     ======================================================= */

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
          threshold: .14,

          rootMargin:
            '0px 0px -6% 0px'
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



  /* =======================================================
     PACKAGE CARDS
     ======================================================= */

  window.toggleActive =
    function (card) {

      if (!card) {
        return;
      }


      document
        .querySelectorAll(
          '.packages .card'
        )
        .forEach(
          function (item) {

            if (
              item !== card
            ) {

              item.classList.remove(
                'active'
              );

            }

          }
        );


      card.classList.toggle(
        'active'
      );

    };



  /* =======================================================
     FAQ
     ======================================================= */

  window.toggleFAQ =
    function (button) {

      if (!button) {
        return;
      }


      const item =
        button.closest(
          '.faq-item'
        );


      if (!item) {
        return;
      }


      const answer =
        item.querySelector(
          '.faq-answer'
        );


      const icon =
        button.querySelector(
          '.faq-icon'
        );


      const currentlyOpen =
        item.classList.contains(
          'active'
        );



      /*
         Close other FAQs.
      */

      document
        .querySelectorAll(
          '.faq-item.active'
        )
        .forEach(
          function (openItem) {

            if (
              openItem === item
            ) {

              return;

            }


            openItem.classList.remove(
              'active'
            );


            const openAnswer =
              openItem.querySelector(
                '.faq-answer'
              );


            const openIcon =
              openItem.querySelector(
                '.faq-icon'
              );


            if (openAnswer) {

              openAnswer.style.maxHeight =
                null;

            }


            if (openIcon) {

              openIcon.textContent =
                '+';

            }

          }
        );



      /*
         Toggle selected FAQ.
      */

      if (currentlyOpen) {

        item.classList.remove(
          'active'
        );


        if (answer) {

          answer.style.maxHeight =
            null;

        }


        if (icon) {

          icon.textContent =
            '+';

        }


        return;

      }


      item.classList.add(
        'active'
      );


      if (answer) {

        answer.style.maxHeight =
          answer.scrollHeight +
          'px';

      }


      if (icon) {

        icon.textContent =
          '−';

      }

    };



  /* =======================================================
     SCROLL ENGINE

     One rAF loop handles every scroll animation.
     ======================================================= */

  let ticking = false;



  function updateScrollEffects() {

    updateHeroVideo();

    updateFeeling();

    updatePromise();

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
    function () {

      resetResponsiveStyles();

      requestScrollUpdate();

    }
  );



  /* =======================================================
     RESPONSIVE RESET

     Important when browser crosses 900px breakpoint.

     Desktop JS writes inline transforms.
     Mobile CSS expects normal document flow.

     Remove those inline values when changing mode.
     ======================================================= */

  function resetResponsiveStyles() {

    if (
      window.innerWidth >
      900
    ) {

      return;

    }


    if (heroVideo) {

      heroVideo.style.transform =
        '';

    }


    feelingShots.forEach(
      function (shot) {

        shot.style.opacity =
          '';

        shot.style.transform =
          '';

        shot.classList.remove(
          'is-active'
        );

      }
    );


    if (feelingWord) {

      feelingWord.style.transform =
        '';

    }


    if (feelingProgress) {

      feelingProgress.style.width =
        '';

    }


    promiseScenes.forEach(
      function (scene) {

        scene.style.opacity =
          '';

        scene.style.transform =
          '';

        scene.classList.remove(
          'is-active'
        );


        const image =
          scene.querySelector(
            '.promise-image img'
          );


        if (image) {

          image.style.transform =
            '';

        }

      }
    );


    if (promiseWord) {

      promiseWord.style.transform =
        '';

    }


    if (promiseProgress) {

      promiseProgress.style.width =
        '';

    }

  }



  /* =======================================================
     INITIAL STATE
     ======================================================= */

  /*
     Desktop sections start on frame one immediately
     rather than waiting for the first scroll event.
  */

  if (
    feelingShots.length &&
    window.innerWidth > 900
  ) {

    feelingShots.forEach(
      function (
        shot,
        index
      ) {

        shot.style.opacity =
          index === 0
            ? '1'
            : '0';


        shot.classList.toggle(
          'is-active',
          index === 0
        );

      }
    );


    setFeelingChapter(0);

  }


  if (
    promiseScenes.length &&
    window.innerWidth > 900
  ) {

    promiseScenes.forEach(
      function (
        scene,
        index
      ) {

        scene.style.opacity =
          index === 0
            ? '1'
            : '0';


        scene.classList.toggle(
          'is-active',
          index === 0
        );

      }
    );

  }


  resetResponsiveStyles();

  updateScrollEffects();

});
