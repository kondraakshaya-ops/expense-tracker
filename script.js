document.getElementById('year').textContent = new Date().getFullYear();

const favoriteBtn = document.getElementById('favoriteBtn');

favoriteBtn.addEventListener('click', () => {
  favoriteBtn.classList.toggle('saved');
  const isSaved = favoriteBtn.classList.contains('saved');
  favoriteBtn.textContent = isSaved ? 'Saved ✓' : 'Save recipe';
});
