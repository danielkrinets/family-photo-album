(function () {
  const albums = window.ALBUMS || [];

  const screenMain = document.getElementById('screen-main');
  const screenPhoto = document.getElementById('screen-photo');

  const mainBg = document.getElementById('main-bg');
  const wordmarkImage = document.getElementById('wordmark-image');
  const wordmarkGenerated = document.getElementById('wordmark-generated');
  const wordmarkCountry = document.getElementById('wordmark-country');
  const cityTitle = document.getElementById('city-title');
  const cityDock = document.getElementById('city-dock');
  const dockTicks = document.getElementById('dock-ticks');
  const galleryWrap = document.getElementById('gallery-wrap');
  const infiniteMenuContainer = document.getElementById('infinite-menu-container');
  const btnCollapseGallery = document.getElementById('btn-collapse-gallery');
  const photoFull = document.getElementById('photo-full');
  const btnDownload = document.getElementById('btn-download');

  let currentCityIndex = 0;
  let currentMenu = null; // active InfiniteMenu instance (one at a time)
  let gallerySeq = 0; // guards against a stale probe overwriting a newer one
  let currentPhotoBlob = null;
  let currentPhotoName = '';

  // Probes photos/<slug>/photo1.jpg, photo2.jpg, ... so new photos just need
  // to be uploaded with that name — no code/data changes required.
  function probeExistingPhotos(slug, max = 30) {
    const tryLoad = n =>
      new Promise(resolve => {
        const img = new Image();
        const url = `photos/${slug}/photo${n}.jpg`;
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    return Promise.all(Array.from({ length: max }, (_, i) => tryLoad(i + 1))).then(results =>
      results.filter(Boolean)
    );
  }

  async function mountGallery(index) {
    const seq = ++gallerySeq;
    const album = albums[index];
    if (!album) return;

    const urls = await probeExistingPhotos(album.slug);
    if (seq !== gallerySeq) return; // a newer mountGallery call superseded this one

    if (currentMenu) {
      currentMenu.destroy();
      currentMenu = null;
    }

    const items = urls.map((url, i) => ({
      thumb: url,
      full: url,
      title: album.title,
      description: `Фото ${i + 1} из ${urls.length}`,
    }));

    currentMenu = createInfiniteMenu(infiniteMenuContainer, items, {
      backgroundColor: '#0a0a0c',
      onSelect: openPhoto,
    });
  }

  function expandGallery() {
    galleryWrap.classList.add('expanded');
    btnCollapseGallery.hidden = false;
    currentMenu?.resize();
    galleryWrap.addEventListener('transitionend', () => currentMenu?.resize(), { once: true });
  }

  function collapseGallery() {
    galleryWrap.classList.remove('expanded');
    btnCollapseGallery.hidden = true;
    currentMenu?.resize();
    galleryWrap.addEventListener('transitionend', () => currentMenu?.resize(), { once: true });
  }

  function selectCity(index) {
    currentCityIndex = index;
    const album = albums[index];
    if (!album) return;
    mainBg.style.backgroundImage = `url("${album.cover}")`;
    if (album.titleImage) {
      wordmarkImage.src = album.titleImage;
      wordmarkImage.hidden = false;
      wordmarkGenerated.hidden = true;
    } else {
      wordmarkImage.hidden = true;
      wordmarkGenerated.hidden = false;
      wordmarkCountry.textContent = album.country || '';
      cityTitle.textContent = album.title;
      document.documentElement.style.setProperty('--city-accent', album.accent || '#e2312b');
    }
    [...dockTicks.children].forEach((el, i) => el.classList.toggle('is-active', i === index));
    collapseGallery();
    mountGallery(index);
  }

  function buildDock() {
    dockTicks.innerHTML = '';
    albums.forEach((album, i) => {
      const tick = document.createElement('div');
      tick.className = 'dock-tick';
      tick.title = album.title;
      tick.addEventListener('click', () => selectCity(i));
      dockTicks.appendChild(tick);
    });
    createGlassSurface(cityDock, { borderRadius: 36, backgroundOpacity: 0.12 });
  }

  function openPhoto(item) {
    photoFull.src = item.full;
    currentPhotoName = item.full.split('/').pop();
    currentPhotoBlob = null;
    btnDownload.href = item.full;
    btnDownload.download = currentPhotoName;
    // iOS Safari ignores the <a download> attribute for same-origin files
    // (it just opens the image instead of saving it), so preload the blob
    // and hand it to the native Share Sheet ("Save Image") on tap instead.
    fetch(item.full)
      .then(r => r.blob())
      .then(blob => { currentPhotoBlob = blob; })
      .catch(() => {});
    screenPhoto.classList.add('active');
  }

  function closePhoto() {
    screenPhoto.classList.remove('active');
  }

  btnDownload.addEventListener('click', e => {
    if (!currentPhotoBlob || !navigator.canShare) return;
    const file = new File([currentPhotoBlob], currentPhotoName, {
      type: currentPhotoBlob.type || 'image/jpeg',
    });
    if (!navigator.canShare({ files: [file] })) return;
    e.preventDefault();
    navigator.share({ files: [file] }).catch(() => {});
  });

  galleryWrap.addEventListener('click', () => {
    if (!galleryWrap.classList.contains('expanded')) expandGallery();
  });
  btnCollapseGallery.addEventListener('click', e => {
    e.stopPropagation();
    collapseGallery();
  });
  document.getElementById('btn-home').addEventListener('click', () => selectCity(0));
  document.getElementById('btn-open-city').addEventListener('click', () => {
    galleryWrap.classList.contains('expanded') ? collapseGallery() : expandGallery();
  });
  document.getElementById('btn-close-photo').addEventListener('click', closePhoto);

  buildDock();
  selectCity(0);
})();
