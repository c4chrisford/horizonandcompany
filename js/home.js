<div class="promise-story">

  <div class="promise-story-inner">

    <div class="promise-copy-stack">

      <article
        class="promise-copy-block"
        data-promise-copy="0">
        <!-- 01 copy -->
      </article>

      <article
        class="promise-copy-block"
        data-promise-copy="1">
        <!-- 02 copy -->
      </article>

      <article
        class="promise-copy-block"
        data-promise-copy="2">
        <!-- 03 copy -->
      </article>

      <article
        class="promise-copy-block"
        data-promise-copy="3">
        <!-- 04 copy -->
      </article>

      <article
        class="promise-copy-block"
        data-promise-copy="4">
        <!-- 05 copy -->
      </article>

    </div>


    <div class="promise-visual-column">

      <div class="promise-visual-sticky">

        <figure
          class="promise-sticky-image is-active"
          data-promise-image="0">
          ...
        </figure>

        <figure
          class="promise-sticky-image"
          data-promise-image="1">
          ...
        </figure>

        <figure
          class="promise-sticky-image"
          data-promise-image="2">
          ...
        </figure>

        <figure
          class="promise-sticky-image"
          data-promise-image="3">
          ...
        </figure>

        <figure
          class="promise-sticky-image"
          data-promise-image="4">
          ...
        </figure>

      </div>

    </div>

  </div>

</div>      );

    }


    function sectionProgress(
      section
    ) {

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
        (-rect.top) /
        available
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


    let heroReviewIndex = 0;

    let heroReviewTimer = null;

    let heroProgressAnimation = null;


    const HERO_REVIEW_DURATION =
      6500;



    /* -----------------------------------------------------
       HERO REVIEW
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
          index
        ) {

          const active =
            index ===
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

        heroProgressAnimation = null;

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


      /*
         Force the element back to zero
         before creating the next animation.
      */

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
       Pause testimonial rotation when
       user leaves the browser tab.
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



    /* -----------------------------------------------------
       SUBTLE HERO VIDEO MOTION
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


      /*
         Do nothing while hero is
         completely outside viewport.
      */

      if (
        rect.bottom <= 0 ||
        rect.top >=
        window.innerHeight
      ) {

        return;

      }


      const viewportProgress =
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
         Extremely subtle scale only.
         1.015 -> approx 1.025.
      */

      const scale =
        1.015 +
        (
          viewportProgress *
          .01
        );


      heroVideo.style.transform =
        'scale(' +
        scale +
        ')';

    }



    /* =====================================================
       WEDDING DAY IMAGE STORY
       ===================================================== */

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
      document.getElementById(
        'feeling-progress-bar'
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

    let feelingTextTimer = null;



    /* -----------------------------------------------------
       CHANGE LEFT-HAND CHAPTER
       ----------------------------------------------------- */

    function setFeelingChapter(
      index
    ) {

      if (
        !feelingShots.length
      ) {

        return;

      }


      index =
        clamp(
          index,
          0,
          feelingShots.length - 1
        );


      if (
        index ===
        feelingActiveIndex
      ) {

        return;

      }


      feelingActiveIndex =
        index;


      const activeShot =
        feelingShots[index];


      const label =
        activeShot.getAttribute(
          'data-label'
        ) || '';


      const copy =
        activeShot.getAttribute(
          'data-copy'
        ) || '';


      const word =
        activeShot.getAttribute(
          'data-word'
        ) || 'ONE DAY';



      /*
         Cancel pending text switch if the
         user scrolls rapidly.
      */

      if (
        feelingTextTimer
      ) {

        window.clearTimeout(
          feelingTextTimer
        );


        feelingTextTimer =
          null;

      }



      if (
        feelingChapterLabel
      ) {

        feelingChapterLabel.style.transition =
          'opacity .22s ease, transform .22s ease';


        feelingChapterLabel.style.opacity =
          '0';


        feelingChapterLabel.style.transform =
          'translateY(5px)';

      }



      if (
        feelingChapterCopy
      ) {

        feelingChapterCopy.style.transition =
          'opacity .22s ease, transform .22s ease';


        feelingChapterCopy.style.opacity =
          '0';


        feelingChapterCopy.style.transform =
          'translateY(6px)';

      }



      const delay =
        reduceMotion
          ? 0
          : 120;


      feelingTextTimer =
        window.setTimeout(
          function () {


            if (
              feelingChapterLabel
            ) {

              feelingChapterLabel.textContent =
                label;


              feelingChapterLabel.style.opacity =
                '1';


              feelingChapterLabel.style.transform =
                'translateY(0)';

            }



            if (
              feelingChapterCopy
            ) {

              feelingChapterCopy.textContent =
                copy;


              feelingChapterCopy.style.opacity =
                '1';


              feelingChapterCopy.style.transform =
                'translateY(0)';

            }


            feelingTextTimer =
              null;

          },
          delay
        );



      if (
        feelingWord
      ) {

        feelingWord.textContent =
          word;

      }

    }



    /* -----------------------------------------------------
       UPDATE DAY STORY
       ----------------------------------------------------- */

    function updateFeeling() {

      if (
        !feelingSection ||
        !feelingShots.length
      ) {

        return;

      }


      if (
        !isDesktop() ||
        reduceMotion
      ) {

        return;

      }


      const progress =
        sectionProgress(
          feelingSection
        );



      if (
        feelingProgress
      ) {

        feelingProgress.style.width =
          (
            progress *
            100
          ) +
          '%';

      }



      /*
         Hold first image very slightly before
         the sequence starts.

         Hold final image slightly at the end.
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


          /*
             Tight overlap.

             Keeps transitions smooth without
             ever producing two equally readable
             photographs.
          */

          let opacity =
            1 -
            (
              distance *
              1.85
            );


          opacity =
            clamp(
              opacity
            );


          if (
            distance >
            .58
          ) {

            opacity = 0;

          }



          const y =
            relative *
            26;


          const activeAmount =
            clamp(
              1 -
              distance
            );


          const scale =
            1.025 +
            (
              activeAmount *
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



      if (
        feelingWord
      ) {


        const x =
          (
            galleryProgress -
            .5
          ) *
          22;


        const y =
          (
            galleryProgress -
            .5
          ) *
          -32;


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



    /* =====================================================
       WHAT THE FILM GIVES YOU
       ===================================================== */

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
      document.getElementById(
        'promise-progress-bar'
      );


    const promiseWord =
      document.querySelector(
        '.home-promise-word'
      );



    function updatePromise() {

      if (
        !promiseSection ||
        !promiseScenes.length
      ) {

        return;

      }


      if (
        !isDesktop() ||
        reduceMotion
      ) {

        return;

      }



      const progress =
        sectionProgress(
          promiseSection
        );



      if (
        promiseProgress
      ) {

        promiseProgress.style.width =
          (
            progress *
            100
          ) +
          '%';

      }



      /*
         Small start/end hold.

         Gives each end scene time to settle
         before the section transitions.
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
             Narrower cross-fade.

             This is important because each
             scene contains substantial copy.

             We do not want two headings and
             two images visually competing.
          */

          let opacity =
            1 -
            (
              distance *
              1.9
            );


          opacity =
            clamp(
              opacity
            );


          if (
            distance >
            .56
          ) {

            opacity = 0;

          }



          const y =
            relative *
            34;


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
             Small image drift inside each
             fixed photograph frame.
          */

          const image =
            scene.querySelector(
              '.promise-image img'
            );


          if (
            image
          ) {


            const imageY =
              relative *
              -10;


            image.style.transform =
              'scale(1.045) ' +
              'translate3d(0,' +
              imageY +
              'px,0)';

          }

        }
      );



      if (
        promiseWord
      ) {


        const x =
          (
            storyProgress -
            .5
          ) *
          -55;


        const y =
          (
            storyProgress -
            .5
          ) *
          18;


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

       site.js remains untouched.

       This only removes homepage animation
       styles when switching desktop -> mobile.
       ===================================================== */

    function resetResponsiveStyles() {


      if (
        isDesktop()
      ) {

        return;

      }



      /* HERO */

      if (
        heroVideo
      ) {

        heroVideo.style.transform =
          '';

      }



      /* DAY */

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


      if (
        feelingWord
      ) {

        feelingWord.style.transform =
          '';

      }


      if (
        feelingProgress
      ) {

        feelingProgress.style.width =
          '';

      }



      if (
        feelingChapterLabel
      ) {

        feelingChapterLabel.style.opacity =
          '';


        feelingChapterLabel.style.transform =
          '';

      }



      if (
        feelingChapterCopy
      ) {

        feelingChapterCopy.style.opacity =
          '';


        feelingChapterCopy.style.transform =
          '';

      }



      /* PROMISE */

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


          if (
            image
          ) {

            image.style.transform =
              '';

          }

        }
      );


      if (
        promiseWord
      ) {

        promiseWord.style.transform =
          '';

      }


      if (
        promiseProgress
      ) {

        promiseProgress.style.width =
          '';

      }

    }



    /* =====================================================
       DESKTOP INITIAL STATE
       ===================================================== */

    function initialiseDesktopStories() {


      if (
        !isDesktop() ||
        reduceMotion
      ) {

        return;

      }



      /* WEDDING DAY */

      feelingShots.forEach(
        function (
          shot,
          index
        ) {


          const active =
            index === 0;


          shot.style.opacity =
            active
              ? '1'
              : '0';


          shot.style.transform =
            active
              ? 'translate3d(0,0,0) scale(1.037)'
              : 'translate3d(0,26px,0) scale(1.025)';


          shot.classList.toggle(
            'is-active',
            active
          );

        }
      );


      setFeelingChapter(0);



      /* PROMISE */

      promiseScenes.forEach(
        function (
          scene,
          index
        ) {


          const active =
            index === 0;


          scene.style.opacity =
            active
              ? '1'
              : '0';


          scene.style.transform =
            active
              ? 'translate3d(0,0,0) scale(1)'
              : 'translate3d(0,34px,0) scale(.988)';


          scene.classList.toggle(
            'is-active',
            active
          );

        }
      );

    }



    /* =====================================================
       SCROLL ENGINE

       A single requestAnimationFrame loop
       drives all homepage scroll effects.
       ===================================================== */

    let ticking = false;



    function updateScrollEffects() {


      updateHeroVideo();

      updateFeeling();

      updatePromise();

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


              resetResponsiveStyles();


              if (
                isDesktop()
              ) {

                initialiseDesktopStories();

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
       INITIALISE
       ===================================================== */

    resetResponsiveStyles();


    initialiseDesktopStories();


    updateScrollEffects();


  }
);
