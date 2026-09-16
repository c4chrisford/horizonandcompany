/* =========================================================
   HORIZON & COMPANY
   HOMEPAGE JAVASCRIPT

   Homepage-only interactions:
   - Rotating hero testimonials
   - Hero content fade as page leaves viewport
   - Standard reveal animations
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

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = motionQuery.matches;
  const DESKTOP_BREAKPOINT = 900;

  function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
  }

  function isDesktop() {
    return (window.innerWidth > DESKTOP_BREAKPOINT);
  }

  function getNavHeight() {
    const styles = window.getComputedStyle(document.documentElement);
    const value = styles.getPropertyValue('--nav-height');
    return parseFloat(value) || 0;
  }


  /* =====================================================
     HERO ELEMENTS
     ===================================================== */

  const hero = document.querySelector('.home-hero');
  const heroMain = document.querySelector('.home-hero-main');
  const heroProof = document.querySelector('.home-hero-proof');
  const heroReviews = Array.from(document.querySelectorAll('.home-hero-review'));
  const heroReviewProgress = document.querySelector('.home-hero-proof-progress span');

  const HERO_REVIEW_DURATION = 6500;
  let heroReviewIndex = 0;
  let heroReviewTimer = null;
  let heroProgressAnimation = null;


  /* =====================================================
     HERO TESTIMONIALS
     ===================================================== */

  function setHeroReview(index) {
    if (!heroReviews.length) return;

    heroReviewIndex = (index + heroReviews.length) % heroReviews.length;

    heroReviews.forEach(function (review, reviewIndex) {
      const active = reviewIndex === heroReviewIndex;
      review.classList.toggle('is-active', active);
      review.setAttribute('aria-hidden', active ? 'false' : 'true');
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
    if (!heroReviewProgress || reduceMotion || document.hidden) return;
    
    stopHeroProgress();
    heroReviewProgress.style.width = '0%';

    if (typeof heroReviewProgress.animate !== 'function') return;

    heroProgressAnimation = heroReviewProgress.animate(
      [ { width: '0%' }, { width: '100%' } ],
      {
        duration: HERO_REVIEW_DURATION,
        easing: 'linear',
        fill: 'forwards'
      }
    );
  }

  function stopHeroReviews() {
    if (heroReviewTimer) {
      window.clearTimeout(heroReviewTimer);
      heroReviewTimer = null;
    }
    stopHeroProgress();
  }

  function scheduleHeroReview() {
    stopHeroReviews();

    if (reduceMotion || heroReviews.length < 2 || document.hidden) return;

    startHeroProgress();

    heroReviewTimer = window.setTimeout(function () {
      setHeroReview(heroReviewIndex + 1);
      scheduleHeroReview();
    }, HERO_REVIEW_DURATION);
  }

  if (heroReviews.length) {
    setHeroReview(0);
    scheduleHeroReview();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopHeroReviews();
    } else {
      scheduleHeroReview();
    }
  });


  /* =====================================================
     HERO SCROLL EFFECT
     ===================================================== */

  function updateHero() {
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const heroHeight = Math.max(rect.height, 1);
    const scrollProgress = clamp(-rect.top / heroHeight);

    if (heroMain) {
      if (reduceMotion || !isDesktop()) {
        heroMain.style.opacity = '';
        heroMain.style.transform = '';
      } else {
        const fade = 1 - clamp(scrollProgress * 1.32);
        const translateY = scrollProgress * -22;

        heroMain.style.opacity = Math.max(0, fade).toFixed(3);
        heroMain.style.transform = 'translate3d(0,' + translateY.toFixed(2) + 'px,0)';
      }
    }

    if (heroProof) {
      if (reduceMotion || !isDesktop()) {
        heroProof.style.opacity = '';
      } else {
        const proofFade = 1 - clamp(scrollProgress * 1.7);
        heroProof.style.opacity = Math.max(0, proofFade).toFixed(3);
      }
    }
  }


  /* =====================================================
     STANDARD REVEALS
     ===================================================== */

  const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
  let revealObserver = null;

  function initialiseReveals() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
      return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (revealObserver) {
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -5% 0px'
    });

    revealItems.forEach(function (item) {
      if (item.classList.contains('is-visible')) return;
      revealObserver.observe(item);
    });
  }

  initialiseReveals();


  /* =====================================================
     SMOOTH INTERNAL ANCHOR SCROLLING
     ===================================================== */

  const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));

  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      let target = null;
      try {
        target = document.querySelector(href);
      } catch (error) {
        return;
      }

      if (!target || reduceMotion) return;

      event.preventDefault();

      const navHeight = getNavHeight();
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });

      if (window.history && typeof window.history.pushState === 'function') {
        window.history.pushState(null, '', href);
      }
    });
  });


  /* =====================================================
     IMAGE LOAD SAFETY
     ===================================================== */

  const homepageImages = Array.from(document.querySelectorAll(
    '.home-stories img, .home-promise img, .home-process img, .home-partner img, .home-locations img'
  ));

  homepageImages.forEach(function (image) {
    if (image.complete) return;

    image.addEventListener('load', requestScrollUpdate, { once: true });
    image.addEventListener('error', requestScrollUpdate, { once: true });
  });


  /* =====================================================
     SCROLL ENGINE
     ===================================================== */

  let ticking = false;

  function updateScrollEffects() {
    updateHero();
  }

  function requestScrollUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateScrollEffects();
      ticking = false;
    });
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });


  /* =====================================================
     RESIZE
     ===================================================== */

  let resizeTimer = null;

  window.addEventListener('resize', function () {
    if (resizeTimer) window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(function () {
      if (!isDesktop() || reduceMotion) {
        if (heroMain) {
          heroMain.style.transform = '';
          heroMain.style.opacity = '';
        }
        if (heroProof) {
          heroProof.style.opacity = '';
        }
      }
      requestScrollUpdate();
      resizeTimer = null;
    }, 120);
  });


  /* =====================================================
     ORIENTATION CHANGE & BACK/FORWARD CACHE
     ===================================================== */

  window.addEventListener('orientationchange', function () {
    window.setTimeout(requestScrollUpdate, 180);
  });

  window.addEventListener('pageshow', function () {
    requestScrollUpdate();
    if (!document.hidden) scheduleHeroReview();
  });


  /* =====================================================
     INITIALISE
     ===================================================== */
  
  window.addEventListener('load', requestScrollUpdate);
  updateScrollEffects();

});
