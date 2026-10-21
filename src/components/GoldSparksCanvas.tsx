import React, { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  life: number;
  maxLife: number;
}

export const GoldSparksCanvas: React.FC<{ className?: string }> = ({ className = "absolute inset-0 pointer-events-none" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Gold palette
    const goldPalette = [
      '#C8A34D',
      '#dfbe6a',
      '#fbf0d3',
      '#ffd700',
      '#e5b044',
      '#fff8e7',
    ];

    const sparkCount = Math.min(75, Math.floor((width * height) / 14000));
    const sparks: Spark[] = [];

    const createSpark = (initialRandomY = false): Spark => {
      const color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      const baseSize = 0.8 + Math.random() * 2.5;
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + 10 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.5 + Math.random() * 1.4), // Rising upward like real embers
        size: baseSize,
        baseSize,
        alpha: 0.1 + Math.random() * 0.8,
        color,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
        twinkleOffset: Math.random() * Math.PI * 2,
        life: 0,
        maxLife: 200 + Math.random() * 250,
      };
    };

    for (let i = 0; i < sparkCount; i++) {
      sparks.push(createSpark(true));
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Render sparks
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];

        s.x += s.vx + Math.sin(time * 0.02 + s.twinkleOffset) * 0.35;
        s.y += s.vy;
        s.life += 1;

        // Twinkle factor
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const currentAlpha = Math.max(0.1, s.alpha * (0.6 + 0.4 * twinkle));
        const currentRadius = Math.max(0.4, s.baseSize * (0.85 + 0.25 * twinkle));

        // Draw radial glow for luxury spark
        const gradient = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          currentRadius * 3.5
        );
        gradient.addColorStop(0, s.color);
        gradient.addColorStop(0.3, s.color);
        gradient.addColorStop(1, 'rgba(200, 163, 77, 0)');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, currentRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw brighter spark core
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = currentAlpha * 0.9;
        ctx.beginPath();
        ctx.arc(s.x, s.y, currentRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Reset if offscreen or expired
        if (s.y < -20 || s.x < -20 || s.x > width + 20 || s.life > s.maxLife) {
          sparks[i] = createSpark(false);
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ opacity: 0.85 }}
    />
  );
};
