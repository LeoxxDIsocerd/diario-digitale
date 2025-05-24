document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('badges-container');
  container.innerHTML = ''; // pulisce contenuto precedente se c'è

  for(let i = 1; i <= 100; i++) {
    const badge = document.createElement('div');
    badge.classList.add('badge');
    badge.innerHTML = `
      <span class="badge-icon">🏆</span>
      <span class="badge-name">Badge #${i}</span>
      <div class="badge-level" style="width:${(i % 10) * 10}%"></div>
    `;
    badge.title = `Questo è il badge numero ${i}! Complimenti!`;
    container.appendChild(badge);
  }
});
