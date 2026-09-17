/* =========================================================
   WEDDING FILMS PAGE

   Lazy-load YouTube players only when the visitor
   chooses to watch a film.

   Benefits:
   - Faster initial page load
   - More cinematic poster-image presentation
   - Videos autoplay once deliberately selected
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  const filmPlayers = Array.from(
    document.querySelectorAll(
      '.films-player[data-youtube-id]'
    )
  );


  if (!filmPlayers.length) {
    return;
  }


  filmPlayers.forEach(function (player) {

    player.addEventListener('click', function () {

      /* -----------------------------------------------
         Prevent the iframe being created more than once
         ----------------------------------------------- */

      if (
        player.classList.contains('is-playing')
      ) {
        return;
      }


      /* -----------------------------------------------
         Get video information from HTML
         ----------------------------------------------- */

      const videoId =
        player.getAttribute('data-youtube-id');

      const title =
        player.getAttribute('data-title') ||
        'Wedding film';


      if (!videoId) {
        return;
      }


      /* -----------------------------------------------
         Create YouTube iframe only when clicked
         ----------------------------------------------- */

      const iframe =
        document.createElement('iframe');


      iframe.src =
        'https://www.youtube.com/embed/' +
        encodeURIComponent(videoId) +
        '?autoplay=1&rel=0&modestbranding=1';


      iframe.title =
        title;


      iframe.allow =
        'accelerometer; autoplay; clipboard-write; ' +
        'encrypted-media; gyroscope; picture-in-picture; web-share';


      iframe.allowFullscreen =
        true;


      iframe.setAttribute(
        'loading',
        'eager'
      );


      /* -----------------------------------------------
         Switch poster into playback state
         ----------------------------------------------- */

      player.classList.add(
        'is-playing'
      );


      player.setAttribute(
        'aria-label',
        'Playing ' + title
      );


      player.appendChild(
        iframe
      );

    });

  });

});
