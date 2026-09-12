// Добавить новый город:
// 1) создать папку photos/<slug>/ и положить туда cover.jpg (фон/обложка)
// 2) залить сколько угодно фото с именами photo1.jpg, photo2.jpg, photo3.jpg, ...
//    (просто через "Add file → Upload files" на GitHub) — сайт сам их найдёт,
//    ничего в коде для этого трогать не нужно.
// 3) добавить объект в этот массив.
// titleImage — готовая PNG-плашка "СТРАНА + город", экспортированная из Figma
// (assets/titles/<slug>.png); если её нет для нового города — рисуется через
// CSS (wordmark-country/city, см. index.html) с цветом accent.
window.ALBUMS = [
  {
    slug: 'straubing',
    title: 'Straubing',
    country: 'Germany',
    accent: '#e2312b',
    titleImage: 'assets/titles/straubing.png',
    cover: 'photos/straubing/cover.jpg',
  },
  {
    slug: 'munich',
    title: 'Munich',
    country: 'Germany',
    accent: '#3d7fe0',
    titleImage: 'assets/titles/munich.png',
    cover: 'photos/munich/cover.jpg',
  },
  {
    slug: 'gunzburg',
    title: 'Günzburg',
    country: 'Germany',
    accent: '#f7b32b',
    titleImage: 'assets/titles/gunzburg.png',
    cover: 'photos/gunzburg/cover.jpg',
  },
];
