const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
let width, height, particles = [], dpr = 1;
const pointer = { x: null, y: null, radius: 150 };

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const amount = Math.min(190, Math.floor((width * height) / 6500));
  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - .5) * .42,
    vy: (Math.random() - .5) * .42,
    radius: Math.random() * 1.8 + .5,
    warm: Math.random() < .24
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  // Linhas entre partículas próximas
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 145) {
        const opacity = (1 - distance / 145) * .48;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(83, 164, 225, ${opacity})`;
        ctx.lineWidth = .65;
        ctx.stroke();
      }
    }
  }

  // Pontos com brilho
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -10 || p.x > width + 10) p.vx *= -1;
    if (p.y < -10 || p.y > height + 10) p.vy *= -1;

    const color = p.warm ? '255, 160, 76' : '224, 242, 255';
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 8);
    glow.addColorStop(0, `rgba(${color}, .95)`);
    glow.addColorStop(.18, `rgba(${color}, .38)`);
    glow.addColorStop(1, `rgba(${color}, 0)`);
    ctx.beginPath();
    ctx.fillStyle = glow;
    ctx.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(${color}, .95)`;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
window.addEventListener('pointermove', (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
});
window.addEventListener('pointerleave', () => { pointer.x = pointer.y = null; });
resize();
draw();
