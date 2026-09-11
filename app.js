(function () {
  const albums = window.ALBUMS || [];

  const screens = {
    main: document.getElementById('screen-main'),
    city: document.getElementById('screen-city'),
    photo: document.getElementById('screen-photo'),
  };

  const mainBg = document.getElementById('main-bg');
  const wordmarkImage = document.getElementById('wordmark-image');
  const wordmarkGenerated = document.getElementById('wordmark-generated');
  const wordmarkCountry = document.getElementById('wordmark-country');
  const cityTitle = document.getElementById('city-title');
  const cityDock = document.getElementById('city-dock');
  const dockTicks = document.getElementById('dock-ticks');
  const infiniteMenuContainer = document.getElementById('infinite-menu-container');
  const photoFull = document.getElementById('photo-full');
  const btnDownload = document.getElementById('btn-download');

  let currentCityIndex = 0;
  let currentMenu = null; // active InfiniteMenu instance (lazy, one at a time)
  let currentPhotoBlob = null;
  let currentPhotoName = '';

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
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
    createGlassSurface(cityDock, { borderRadius: 26, backgroundOpacity: 0.12 });
  }

  function openCity(index) {
    const album = albums[index];
    if (!album) return;

    if (currentMenu) {
      currentMenu.destroy();
      currentMenu = null;
    }

    const items = album.photos.map((p, i) => ({
      thumb: p.thumb,
      full: p.full,
      title: album.title,
      description: `Фото ${i + 1} из ${album.photos.length}`,
    }));

    currentMenu = createInfiniteMenu(infiniteMenuContainer, items, {
      backgroundColor: '#0a0a0c',
      onSelect: openPhoto,
    });

    showScreen('city');
  }

  function closeCity() {
    if (currentMenu) {
      currentMenu.destroy();
      currentMenu = null;
    }
    showScreen('main');
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
    showScreen('photo');
  }

  function closePhoto() {
    showScreen('city');
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

  screens.main.addEventListener('click', e => {
    if (e.target.closest('#city-dock')) return;
    openCity(currentCityIndex);
  });
  document.getElementById('btn-back-main').addEventListener('click', closeCity);
  document.getElementById('btn-close-photo').addEventListener('click', closePhoto);

  buildDock();
  selectCity(0);
})();
