// Добавить новый город: 1) скопировать папку фото в photos/<slug>/{thumb,full}/
// 2) добавить объект в этот массив. accent — цвет рукописного названия города
// (используется, только если для города нет titleImage). titleImage — готовая
// PNG-плашка "СТРАНА + город", экспортированная из Figma (assets/titles/<slug>.png);
// если её нет для нового города — рисуется через CSS (wordmark-country/city).
window.ALBUMS = [
  {
    slug: 'straubing',
    title: 'Straubing',
    country: 'Germany',
    accent: '#e2312b',
    titleImage: 'assets/titles/straubing.png',
    cover: 'photos/straubing/cover.jpg',
    photos: [1, 2, 3, 4, 5].map(n => ({
      thumb: `photos/straubing/thumb/${String(n).padStart(2, '0')}.jpg`,
      full: `photos/straubing/full/${String(n).padStart(2, '0')}.jpg`,
    })),
  },
  {
    slug: 'munich',
    title: 'Munich',
    country: 'Germany',
    accent: '#3d7fe0',
    titleImage: 'assets/titles/munich.png',
    cover: 'photos/munich/cover.jpg',
    photos: [1, 2, 3, 4, 5].map(n => ({
      thumb: `photos/munich/thumb/${String(n).padStart(2, '0')}.jpg`,
      full: `photos/munich/full/${String(n).padStart(2, '0')}.jpg`,
    })),
  },
];
