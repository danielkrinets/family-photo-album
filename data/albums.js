// Добавить новый город: 1) скопировать папку фото в photos/<slug>/{thumb,full}/
// 2) добавить объект в этот массив. Больше ничего трогать не нужно.
window.ALBUMS = [
  {
    slug: 'straubing',
    title: 'Straubing',
    country: 'Germany',
    cover: 'photos/straubing/full/01.jpg',
    photos: [1, 2, 3, 4, 5].map(n => ({
      thumb: `photos/straubing/thumb/${String(n).padStart(2, '0')}.jpg`,
      full: `photos/straubing/full/${String(n).padStart(2, '0')}.jpg`,
    })),
  },
  {
    slug: 'munich',
    title: 'Munich',
    country: 'Germany',
    cover: 'photos/munich/full/01.jpg',
    photos: [1, 2, 3, 4, 5].map(n => ({
      thumb: `photos/munich/thumb/${String(n).padStart(2, '0')}.jpg`,
      full: `photos/munich/full/${String(n).padStart(2, '0')}.jpg`,
    })),
  },
];
