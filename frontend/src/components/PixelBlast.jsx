import { useEffect, useRef } from 'react';
import './PixelBlast.css';

// Bayer 8x8 ordered dithering matrix
const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

function hash(x, y, z) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

function lerp(a, b, t) { return a + (b - a) * t; }

function smooth(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

function vnoise(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = smooth(x - ix), fy = smooth(y - iy), fz = smooth(z - iz);
  return lerp(
    lerp(lerp(hash(ix, iy, iz), hash(ix + 1, iy, iz), fx), lerp(hash(ix, iy + 1, iz), hash(ix + 1, iy + 1, iz), fx), fy),
    lerp(lerp(hash(ix, iy, iz + 1), hash(ix + 1, iy, iz + 1), fx), lerp(hash(ix, iy + 1, iz + 1), hash(ix + 1, iy + 1, iz + 1), fx), fy),
    fz
  ) * 2 - 1;
}

function fbm(x, y, t, scale) {
  let sum = 1.0, amp = 1.0, freq = 1.0;
  for (let i = 0; i < 5; i++) {
    sum += amp * vnoise(x * scale * freq, y * scale * freq, t);
    freq *= 1.25;
  }
  return sum * 0.5 + 0.5;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ];
}

const PixelBlast = ({
  variant = 'square',
  pixelSize = 8,
  color = '#B497CF',
  className,
  style,
  patternScale = 2,
  patternDensity = 1,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
}) => {
  const canvasRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = 1; // force low resolution for performance

    const setSize = () => {
      const parent = canvas.parentElement;
      canvas.width = (parent.clientWidth || 1) * dpr;
      canvas.height = (parent.clientHeight || 1) * dpr;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas.parentElement);

    const [cr, cg, cb] = hexToRgb(color);
    const rgbStr = `${cr},${cg},${cb}`;
    const clicks = [];
    const startTime = performance.now();
    let raf;

    const onPointerDown = (e) => {
      if (!enableRipples) return;
      const rect = canvas.getBoundingClientRect();
      clicks.push({
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
        t: (performance.now() - startTime) / 1000 * speed
      });
      if (clicks.length > 10) clicks.shift();
    };
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });

    let observer = new IntersectionObserver((entries) => {
      isVisibleRef.current = entries[0].isIntersecting;
    });
    observer.observe(canvas);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!isVisibleRef.current) return;

      const w = canvas.width;
      const h = canvas.height;
      const t = (performance.now() - startTime) / 1000 * speed;
      const ps = pixelSize * dpr;
      const aspect = w / h;

      if (transparent) ctx.clearRect(0, 0, w, h);
      else { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); }

      const cols = Math.ceil(w / ps);
      const rows = Math.ceil(h / ps);
      const cellPS = ps * 8;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const px = col * ps;
          const py = row * ps;
          const cx = px - w * 0.5;
          const cy = py - h * 0.5;

          const cellX = Math.floor(cx / cellPS);
          const cellY = Math.floor(cy / cellPS);
          const uvx = cellX * cellPS / w * aspect;
          const uvy = cellY * cellPS / h;

          let base = fbm(uvx, uvy, t * 0.05, patternScale);
          base = base * 0.5 - 0.65;
          let feed = base + (patternDensity - 0.5) * 0.3;

          if (enableRipples) {
            for (const c of clicks) {
              const age = t - c.t;
              if (age < 0) continue;
              const dx = (px - c.x) / w;
              const dy = (py - c.y) / h;
              const r = Math.sqrt(dx * dx + dy * dy);
              const waveR = rippleSpeed * age;
              const ring = Math.exp(-Math.pow((r - waveR) / rippleThickness, 2));
              const atten = Math.exp(-age) * Math.exp(-10 * r);
              feed = Math.max(feed, ring * atten * rippleIntensityScale);
            }
          }

          const bx = ((col % 8) + 8) % 8;
          const by = ((row % 8) + 8) % 8;
          const bayer = BAYER8[by][bx] / 63 - 0.5;
          if (feed + bayer < 0.5) continue;

          let alpha = 1;
          if (edgeFade > 0) {
            const nx = px / w, ny = py / h;
            const edge = Math.min(nx, ny, 1 - nx, 1 - ny);
            alpha = Math.min(1, edge / edgeFade);
          }
          if (alpha <= 0) continue;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${rgbStr})`;

          if (variant === 'circle') {
            ctx.beginPath();
            ctx.arc(px + ps * 0.5, py + ps * 0.5, ps * 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else if (variant === 'diamond') {
            const hw = ps * 0.42;
            const mx = px + ps * 0.5, my = py + ps * 0.5;
            ctx.beginPath();
            ctx.moveTo(mx, my - hw);
            ctx.lineTo(mx + hw, my);
            ctx.lineTo(mx, my + hw);
            ctx.lineTo(mx - hw, my);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillRect(px + 0.5, py + 0.5, ps * 0.85, ps * 0.85);
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, [variant, pixelSize, color, patternScale, patternDensity, enableRipples,
    rippleIntensityScale, rippleThickness, rippleSpeed, speed, transparent, edgeFade]);

  return (
    <div className={`pixel-blast-container ${className ?? ''}`} style={style} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export default PixelBlast;
