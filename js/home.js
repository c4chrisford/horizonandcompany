/* =========================================================
   HORIZON & COMPANY
   HOMEPAGE JAVASCRIPT

   Load with:
   <script src="/js/home.js" defer></script>
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const clamp = (value, min = 0, max = 1) =>
    Math.min(Math.max(value, min), max);

  const sectionProgress = (section) => {
    if (!section) return 0;

    const rect = section.getBoundingClientRect();
    const available = section.offsetHeight - window.innerHeight;

    if (available <= 0) return 0;

    return clamp((-rect.top) / available);
  };


  /* =======================================================
     HERO
     Scroll sequence:
     1. Main heading + buttons
     2. Aimee review
     3. Kirsty review
     4. Clean video
     5. Release into next section
     ======================================================= */

  const heroSection = document.querySelector('.home-hero-scroll');
  const heroContent = document.querySelector('.home-hero-content');
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const heroDots = Array.from(document.querySelectorAll('.hero-dot'));
  const heroVideo = document.querySelector('.home-hero-sticky .hero-video');
  const heroOverlay = document.querySelector('.home-hero-sticky .hero-overlay');
  const heroCue = document.querySelector('.hero-scroll-cue');

  let heroManualSlide = null;

  function showHeroSlide(index) {
    if (!heroSlides.length) return;

    const safeIndex = clamp(index, 0, heroSlides.length - 1);

    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === safeIndex);
    });

    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === safeIndex);
      dot.setAttribute('aria-current', i === safeIndex ? 'true' : 'false');
    });
  }

  heroDots.forEach((dot) => {
    dot.addEventListener('click', function () {
      const target = parseInt(dot.getAttribute('data-target'), 10);

      if (Number.isNaN(target)) return;

      heroManualSlide = target;
      showHeroSlide(target);
    });
  });

  function updateHero() {
    if (!heroSection || window.innerWidth <= 900 || reduceMotion) return;

    const progress = sectionProgress(heroSection);

    /*
      Scroll chapters:
      0.00 - 0.18   Main hero
      0.18 - 0.42   Review 1
      0.42 - 0.66   Review 2
      0.66 - 0.82   Clean video
      0.82 - 1.00   Content exits
    */

    let slideIndex = 0;

    if (heroManualSlide !== null && progress < 0.08) {
      slideIndex = heroManualSlide;
    } else {
      heroManualSlide = null;

      if (progress >= 0.42) {
        slideIndex = 2;
      } else if (progress >= 0.18) {
        slideIndex = 1;
      }
    }

    showHeroSlide(slideIndex);

    let exitProgress = clamp((progress - 0.66) / 0.18);

    if (heroContent) {
      const y = -180 * exitProgress;
      const opacity = 1 - exitProgress;
      const blur = exitProgress * 2;

      heroContent.style.transform = `translate3d(0, ${y}px, 0)`;
      heroContent.style.opacity = opacity;
      heroContent.style.filter = `blur(${blur}px)`;
    }

    if (heroOverlay) {
      const lighten = clamp((progress - 0.62) / 0.25);
      heroOverlay.style.opacity = 1 - (lighten * 0.55);
    }

    if (heroVideo) {
      const zoom = 1 + ((1 - progress) * 0.012);

      heroVideo.style.setProperty(
        'transform',
        `scale(${zoom})`,
        'important'
      );
    }

    if (heroCue) {
      heroCue.style.opacity = 1 - clamp(progress / 0.08);
    }
  }


  /* =======================================================
     WEDDING DAY
     Left copy stays fixed.
     Four photographs cross-fade on the right.
     ======================================================= */

  const feelingSection = document.querySelector('.home-feeling');

  const feelingShots = Array.from(
    document.querySelectorAll('.feeling-shot')
  );

  const feelingWord = document.querySelector('.home-feeling-word');

  const feelingProgress = document.querySelector(
    '#feeling-progress-bar'
  );

  const feelingChapterLabel = document.querySelector(
    '.feeling-chapter-label'
  );

  const feelingChapterCopy = document.querySelector(
    '.feeling-chapter-copy'
  );

  function updateFeeling() {
    if (!feelingSection || window.innerWidth <= 900 || reduceMotion) {
      return;
    }

    const progress = sectionProgress(feelingSection);

    if (feelingProgress) {
      feelingProgress.style.width = `${progress * 100}%`;
    }

    if (!feelingShots.length) return;

    /*
      Spread the four images across almost the full
      pinned sequence.

      Neighbouring photographs overlap slightly,
      producing a cinematic cross-fade.
    */

    const galleryProgress = clamp(
      (progress - 0.04) / 0.90
    );

    const position =
      galleryProgress * (feelingShots.length - 1);

    feelingShots.forEach((shot, index) => {

      const distance = Math.abs(index - position);

      const opacity = clamp(
        1 - distance
      );

      const scale =
        1.045 -
        (clamp(1 - distance) * 0.025);

      shot.style.opacity = opacity;
      shot.style.transform = `scale(${scale})`;
    });

    const activeIndex = clamp(
      Math.round(position),
      0,
      feelingShots.length - 1
    );

    const activeShot = feelingShots[activeIndex];

    if (activeShot) {

      const label =
        activeShot.getAttribute('data-label');

      const copy =
        activeShot.getAttribute('data-copy');

      const word =
        activeShot.getAttribute('data-word');

      if (feelingChapterLabel && label) {
        feelingChapterLabel.textContent = label;
      }

      if (feelingChapterCopy && copy) {
        feelingChapterCopy.textContent = copy;
      }

      if (feelingWord && word) {
        feelingWord.textContent = word;
      }
    }

    if (feelingWord) {

      const x =
        (galleryProgress - 0.5) * 35;

      const y =
        (galleryProgress - 0.5) * -55;

      feelingWord.style.transform =
        `translate3d(
          calc(-50% + ${x}px),
          calc(-50% + ${y}px),
          0
        )`;
    }
  }


  /* =======================================================
     RELIVE / PROMISE

     Alternating sequence:

     IMAGE | TEXT
     TEXT  | IMAGE
     IMAGE | TEXT
     TEXT  | IMAGE
     ======================================================= */

  const promiseSection =
    document.querySelector('.home-promise');

  const promiseScenes = Array.from(
    document.querySelectorAll('.promise-scene')
  );

  const promiseProgress =
    document.querySelector('#promise-progress-bar');

  const promiseWord =
    document.querySelector('.home-promise-word');


  function updatePromise() {

    if (
      !promiseSection ||
      window.innerWidth <= 900 ||
      reduceMotion
    ) {
      return;
    }

    const progress =
      sectionProgress(promiseSection);

    if (promiseProgress) {
      promiseProgress.style.width =
        `${progress * 100}%`;
    }

    if (!promiseScenes.length) return;

    const position =
      progress * (promiseScenes.length - 1);

    promiseScenes.forEach((scene, index) => {

      const relative =
        index - position;

      const distance =
        Math.abs(relative);

      /*
        Wide fade window means scenes transition
        rather than suddenly appearing.

        Vertical movement is deliberately small.
        We don't want the section feeling like
        a PowerPoint presentation.
      */

      const opacity =
        clamp(1 - (distance * 1.35));

      const y =
        relative * 55;

      const scale =
        1 -
        (Math.min(distance, 1) * 0.018);

      scene.style.opacity = opacity;

      scene.style.transform =
        `translate3d(0, ${y}px, 0)
         scale(${scale})`;

      scene.classList.toggle(
        'is-active',
        distance < 0.5
      );
    });

    if (promiseWord) {

      const x =
        (progress - 0.5) * -90;

      const y =
        (progress - 0.5) * 30;

      promiseWord.style.transform =
        `translate3d(
          calc(-50% + ${x}px),
          calc(-50% + ${y}px),
          0
        )`;
    }
  }


  /* =======================================================
     STANDARD SCROLL REVEALS
     ======================================================= */

  const revealItems = Array.from(
    document.querySelectorAll('[data-reveal]')
  );

  if (reduceMotion) {

    revealItems.forEach((item) => {
      item.classList.add('is-visible');
    });

  } else if ('IntersectionObserver' in window) {

    const revealObserver =
      new IntersectionObserver(

        function (entries) {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              'is-visible'
            );

            revealObserver.unobserve(
              entry.target
            );
          });
        },

        {
          threshold: 0.14,
          rootMargin: '0px 0px -6% 0px'
        }

      );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });

  } else {

    revealItems.forEach((item) => {
      item.classList.add('is-visible');
    });

  }


  /* =======================================================
     PACKAGE CARDS
     ======================================================= */

  window.toggleActive = function (card) {

    if (!card) return;

    document
      .querySelectorAll('.packages .card')
      .forEach((item) => {

        if (item !== card) {
          item.classList.remove('active');
        }

      });

    card.classList.toggle('active');
  };


  /* =======================================================
     FAQ
     ======================================================= */

  window.toggleFAQ = function (button) {

    if (!button) return;

    const item =
      button.closest('.faq-item');

    if (!item) return;

    const answer =
      item.querySelector('.faq-answer');

    const icon =
      button.querySelector('.faq-icon');

    const currentlyOpen =
      item.classList.contains('active');


    /*
      Close any other FAQ first
    */

    document
      .querySelectorAll('.faq-item.active')
      .forEach((openItem) => {

        if (openItem === item) {
          return;
        }

        openItem.classList.remove('active');

        const openAnswer =
          openItem.querySelector('.faq-answer');

        const openIcon =
          openItem.querySelector('.faq-icon');

        if (openAnswer) {
          openAnswer.style.maxHeight = null;
        }

        if (openIcon) {
          openIcon.textContent = '+';
        }

      });


    /*
      Toggle selected FAQ
    */

    if (currentlyOpen) {

      item.classList.remove('active');

      if (answer) {
        answer.style.maxHeight = null;
      }

      if (icon) {
        icon.textContent = '+';
      }

      return;
    }


    item.classList.add('active');

    if (answer) {
      answer.style.maxHeight =
        `${answer.scrollHeight}px`;
    }

    if (icon) {
      icon.textContent = '−';
    }
  };


  /* =======================================================
     SCROLL ENGINE

     All scroll animations run through one
     requestAnimationFrame rather than multiple
     separate scroll listeners.
     ======================================================= */

  let ticking = false;

  function updateScrollEffects() {

    updateHero();
    updateFeeling();
    updatePromise();

  }

  function requestScrollUpdate() {

    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(function () {

      updateScrollEffects();

      ticking = false;

    });
  }


  window.addEventListener(
    'scroll',
    requestScrollUpdate,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    requestScrollUpdate
  );


  /*
    Run immediately so the page is correct
    even if it loads partway down.
  */

  updateScrollEffects();


  /* =======================================================
     MOBILE RESET

     If someone resizes from desktop to mobile,
     remove inline animation styles rather than
     leaving desktop positioning behind.
     ======================================================= */

  function resetForMobile() {

    if (window.innerWidth > 900) {
      return;
    }

    if (heroContent) {

      heroContent.style.transform = '';
      heroContent.style.opacity = '';
      heroContent.style.filter = '';

    }

    if (heroOverlay) {
      heroOverlay.style.opacity = '';
    }

    if (heroVideo) {
      heroVideo.style.removeProperty(
        'transform'
      );
    }

    feelingShots.forEach((shot) => {

      shot.style.opacity = '';
      shot.style.transform = '';

    });

    promiseScenes.forEach((scene) => {

      scene.style.opacity = '';
      scene.style.transform = '';

    });

  }

  window.addEventListener(
    'resize',
    resetForMobile
  );

  resetForMobile();

});
