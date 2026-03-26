const bg = document.querySelector('.glow-dot-bg');

window.addEventListener('mousemove', (e) => {
  const x = e.clientX + 'px';
  const y = e.clientY + 'px';

  bg.style.setProperty('--x', x);
  bg.style.setProperty('--y', y);
});