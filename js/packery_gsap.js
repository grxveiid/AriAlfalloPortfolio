// Packery tile "pop up" on click using GSAP.
// Tiles are simple divs with .img background-image.

// This file is optional if you don't want the GSAP effect.

(function () {
  function init() {
    if (typeof gsap === 'undefined') return;


    const modal = document.createElement('div');
    modal.className = 'flip-modal';
    modal.innerHTML = `
      <div class="overlay"></div>
      <div class="content"></div>
    `;
    document.body.appendChild(modal);

    const modalOverlay = modal.querySelector('.overlay');
    const modalContent = modal.querySelector('.content');

    const tiles = Array.from(document.querySelectorAll('.item'));

    // Inject minimal styles so this works even if illustration.css is not updated.
    const style = document.createElement('style');
    style.textContent = `
      .flip-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;pointer-events:none;background:transparent;}
      .flip-modal.is-open{opacity:1;visibility:visible;pointer-events:auto;}
      .flip-modal .content{width:min(520px,90vw);height:min(680px,90vh);position:relative;}
      .flip-modal .content .img{width:100%;height:100%;}
      .flip-modal .overlay{position:absolute;inset:0;background:#000;opacity:0;}
    `;
    document.head.appendChild(style);

    let activeTile = null;
    let activeIndex = null;

    function closeModal() {
      if (!activeTile) return;
      const state = Flip.getState(activeTile);

      tiles[activeIndex].appendChild(activeTile);
      activeTile = null;
      activeIndex = null;

      gsap.to(modalOverlay, { autoAlpha: 0, duration: 0.25, ease: 'power1.inOut' });

      Flip.from(state, {
        duration: 0.7,
        ease: 'power1.inOut',
        absolute: true,
        onComplete: () => modal.classList.remove('is-open')
      });
    }

    function openModal(tile, index) {
      if (activeTile) return;
      activeTile = tile;
      activeIndex = index;

      const state = Flip.getState(tile);
      modalContent.appendChild(tile);

      modal.classList.add('is-open');
      gsap.set(modalOverlay, { autoAlpha: 0.0 });

      Flip.from(state, {
        duration: 0.7,
        ease: 'power1.inOut',
        absolute: true
      });

      gsap.to(modalOverlay, { autoAlpha: 0.65, duration: 0.35, ease: 'power1.inOut' });
    }

    tiles.forEach((tile, i) => {
      tile.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If clicked tile is already active, toggle close.
        if (activeTile === tile) {
          closeModal();
          return;
        }

        // Prevent opening a second modal while one is closing/opening.
        openModal(tile, i);
      });
    });



    modalOverlay.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

