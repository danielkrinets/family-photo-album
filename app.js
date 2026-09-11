(function () {
  const albums = window.ALBUMS || [];

  const screens = {
    main: document.getElementById('screen-main'),
    city: document.getElementById('screen-city'),
    photo: document.getElementById('screen-photo'),
  };

  const mainBg = document.getElementById('main-bg');
  const wordmarkCountry = document.getElementById('wordmark-country');
  const cityTitle = document.getElementById('city-title');
  const cityDock = document.getElementById('city-dock');
  const dockTicks = document.getElementById('dock-ticks');
  const infiniteMenuContainer = document.getElementById('infinite-menu-container');
  const photoFull = document.getElementById('photo-full');
  const btnDownload = document.getElementById('btn-download');

  let currentCityIndex = 0;
  let currentMenu = null; // active InfiniteMenu instance (lazy, one at a time)

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  function selectCity(index) {
    currentCityIndex = index;
    const album = albums[index];
    if (!album) return;
    mainBg.style.backgroundImage = `url("${album.cover}")`;
    wordmarkCountry.textContent = album.country || '';
    cityTitle.textContent = album.title;
    document.documentElement.style.setProperty('--city-accent', album.accent || '#e2312b');
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
    btnDownload.href = item.full;
    btnDownload.download = item.full.split('/').pop();
    showScreen('photo');
  }

  function closePhoto() {
    showScreen('city');
  }

  screens.main.addEventListener('click', e => {
    if (e.target.closest('#city-dock')) return;
    openCity(currentCityIndex);
  });
  document.getElementById('btn-back-main').addEventListener('click', closeCity);
  document.getElementById('btn-close-photo').addEventListener('click', closePhoto);

  buildDock();
  selectCity(0);
})();
