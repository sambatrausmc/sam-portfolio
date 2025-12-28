import { useEffect, useRef, useState } from 'react';
import { sanityClient } from '../lib/sanity';

export default function VisualEffects() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [effectConfig, setEffectConfig] = useState({ effectType: 'none', intensity: 'medium' });

  // Fetch effect configuration from Sanity
  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "visualEffects"][0] { effectType, intensity }`)
      .then((data) => {
        if (data) {
          setEffectConfig({
            effectType: data.effectType || 'none',
            intensity: data.intensity || 'medium',
          });
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (effectConfig.effectType === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mobile detection and particle reduction
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const mobileReduction = isMobile ? 0.4 : 1;

    // Get particle count based on intensity and effect type
    const getParticleCount = (baseCount) => {
      const intensityMultiplier = {
        low: 0.6,
        medium: 1,
        high: 1.5,
      };
      return Math.floor(baseCount * intensityMultiplier[effectConfig.intensity] * mobileReduction);
    };

    // ==================== SNOWFALL EFFECT ====================
    class Snowflake {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 8 + 3; // 3-11px
        this.speedY = Math.random() * 1 + 0.5; // Fall speed
        this.speedX = Math.random() * 0.5 - 0.25; // Drift
        this.opacity = Math.random() * 0.3 + 0.6; // 0.6-0.9
        this.swing = Math.random() * 0.5; // Swing intensity
        this.swingOffset = Math.random() * Math.PI * 2; // Random start position
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
      }

      update() {
        this.swingOffset += 0.01;
        this.x += Math.sin(this.swingOffset) * this.swing + this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.reset();
        }
        if (this.x > width + 20 || this.x < -20) {
          this.x = Math.random() * width;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ==================== FIREWORKS EFFECT ====================
    class Firework {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height;
        this.targetY = Math.random() * (height * 0.4) + height * 0.2;
        this.exploded = false;
        this.particles = [];
        this.hue = Math.random() * 60 + 180; // Blue/gold/white range
        this.speed = Math.random() * 3 + 5;
        this.life = 0;
      }

      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          if (this.y <= this.targetY) {
            this.explode();
          }
        } else {
          this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.alpha -= 0.01;
            p.life--;
            if (p.life <= 0) {
              this.particles.splice(index, 1);
            }
          });

          if (this.particles.length === 0) {
            this.reset();
          }
        }
      }

      explode() {
        this.exploded = true;
        const particleCount = Math.random() * 30 + 40;
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const speed = Math.random() * 3 + 2;
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            life: Math.random() * 60 + 60,
            size: Math.random() * 2 + 2,
          });
        }
      }

      draw(ctx) {
        if (!this.exploded) {
          ctx.save();
          ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, 0.8)`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          this.particles.forEach((p) => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });
        }
      }
    }

    // ==================== SAKURA PETALS ====================
    class SakuraPetal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 8 + 8; // 8-16px
        this.speedY = Math.random() * 0.5 + 0.3;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.rotationSpeedX = Math.random() * 0.02 - 0.01;
        this.rotationSpeedY = Math.random() * 0.03 - 0.015;
        this.rotationSpeedZ = Math.random() * 0.02 - 0.01;
        this.swing = Math.random() * 1.5;
        this.swingOffset = Math.random() * Math.PI * 2;
        this.color = `rgba(${255}, ${Math.random() * 50 + 180}, ${Math.random() * 50 + 200}, 0.9)`;
      }

      update() {
        this.swingOffset += 0.015;
        this.x += Math.sin(this.swingOffset) * this.swing + this.speedX;
        this.y += this.speedY;
        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
        this.rotationZ += this.rotationSpeedZ;

        if (this.y > height + 20) {
          this.reset();
        }
        if (this.x > width + 20 || this.x < -20) {
          this.x = Math.random() * width;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationZ);
        const scale = Math.sin(this.rotationX) * 0.5 + 0.5;
        ctx.scale(scale, 1);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ==================== AUTUMN LEAVES ====================
    class AutumnLeaf {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 8 + 12; // 12-20px
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.rotationSpeedX = Math.random() * 0.05 - 0.025;
        this.rotationSpeedY = Math.random() * 0.06 - 0.03;
        this.rotationSpeedZ = Math.random() * 0.04 - 0.02;
        this.swing = Math.random() * 2;
        this.swingOffset = Math.random() * Math.PI * 2;
        const colors = ['#ff6b35', '#f7931e', '#fdc500', '#c1440e', '#8b4513'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.swingOffset += 0.02;
        this.x += Math.sin(this.swingOffset) * this.swing + this.speedX;
        this.y += this.speedY;
        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
        this.rotationZ += this.rotationSpeedZ;

        if (this.y > height + 20) {
          this.reset();
        }
        if (this.x > width + 20 || this.x < -20) {
          this.x = Math.random() * width;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationZ);
        const scale = Math.sin(this.rotationX) * 0.5 + 0.5;
        ctx.scale(scale, 1);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 3, 0);
        ctx.lineTo(0, this.size / 2);
        ctx.lineTo(-this.size / 3, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // ==================== FLOATING PARTICLES ====================
    class FloatingParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 2; // 2-5px
        this.baseX = this.x;
        this.baseY = this.y;
        this.offsetX = Math.random() * 100;
        this.offsetY = Math.random() * 100;
        this.speedX = Math.random() * 0.01 + 0.005;
        this.speedY = Math.random() * 0.01 + 0.005;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
        const colors = ['rgba(255,255,255,0.6)', 'rgba(173,216,230,0.6)', 'rgba(255,215,0,0.5)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.offsetX += this.speedX;
        this.offsetY += this.speedY;
        this.x = this.baseX + Math.sin(this.offsetX) * 50;
        this.y = this.baseY + Math.cos(this.offsetY) * 50;
        this.pulseOffset += this.pulseSpeed;

        if (this.x > width + 100 || this.x < -100 || this.y > height + 100 || this.y < -100) {
          this.reset();
        }
      }

      draw(ctx) {
        const pulse = Math.sin(this.pulseOffset) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ==================== SPOOKY FOG ====================
    class FogCloud {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 50;
        this.width = Math.random() * 200 + 150; // 150-350px wide
        this.height = Math.random() * 80 + 60;
        this.speedY = Math.random() * 0.3 + 0.2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.expansion = 0.2;
        this.maxHeight = Math.random() * (height * 0.4) + height * 0.3;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.width += this.expansion;
        this.height += this.expansion * 0.5;
        this.opacity -= 0.001;

        if (this.y < this.maxHeight || this.opacity <= 0) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.width / 2
        );
        gradient.addColorStop(0, 'rgba(100, 100, 120, 0.8)');
        gradient.addColorStop(0.5, 'rgba(80, 80, 100, 0.4)');
        gradient.addColorStop(1, 'rgba(60, 60, 80, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ==================== FLOATING HEARTS ====================
    class FloatingHeart {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 20;
        this.size = Math.random() * 8 + 10; // 10-18px
        this.speedY = Math.random() * 0.5 + 0.3;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.swing = Math.random() * 0.5;
        this.swingOffset = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * 0.4 - 0.2;
        this.pulseSpeed = Math.random() * 0.03 + 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;
        const colors = ['rgba(255, 105, 180, 0.7)', 'rgba(255, 20, 147, 0.7)', 'rgba(255, 182, 193, 0.7)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.swingOffset += 0.02;
        this.x += Math.sin(this.swingOffset) * this.swing + this.speedX;
        this.y -= this.speedY;
        this.pulseOffset += this.pulseSpeed;

        if (this.y < -20) {
          this.reset();
        }
      }

      draw(ctx) {
        const pulse = Math.sin(this.pulseOffset) * 0.2 + 1;
        const size = this.size * pulse;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, size / 4);
        ctx.bezierCurveTo(-size / 2, -size / 4, -size / 2, -size / 2, 0, -size / 8);
        ctx.bezierCurveTo(size / 2, -size / 2, size / 2, -size / 4, 0, size / 4);
        ctx.fill();
        ctx.restore();
      }
    }

    // ==================== SHOOTING STARS ====================
    class ShootingStar {
      constructor() {
        this.reset();
        this.active = false;
        this.nextSpawn = this.getNextSpawnTime();
      }

      getNextSpawnTime() {
        const baseTime = {
          low: 10000,
          medium: 5000,
          high: 3000,
        };
        return Date.now() + baseTime[effectConfig.intensity] + Math.random() * 4000;
      }

      reset() {
        this.x = Math.random() * width * 0.5 + width * 0.5;
        this.y = Math.random() * height * 0.3;
        this.length = Math.random() * 40 + 40; // 40-80px
        this.speed = Math.random() * 8 + 12;
        this.angle = Math.random() * Math.PI / 6 + Math.PI / 4; // 45-75 degrees
        this.opacity = 1;
        this.active = false;
      }

      update() {
        if (!this.active) {
          if (Date.now() >= this.nextSpawn) {
            this.active = true;
            this.reset();
            this.active = true;
          }
          return;
        }

        this.x -= Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.015;

        if (this.opacity <= 0 || this.x < -100 || this.y > height + 100) {
          this.active = false;
          this.nextSpawn = this.getNextSpawnTime();
        }
      }

      draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x + Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x + Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    // ==================== RAIN ====================
    class Raindrop {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.length = Math.random() * 10 + 15; // 15-25px
        this.speed = Math.random() * 5 + 10;
        this.opacity = Math.random() * 0.3 + 0.5;
      }

      update() {
        this.y += this.speed;
        this.x -= 1; // Slight angle

        if (this.y > height + 20) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
        ctx.restore();
      }
    }

    // ==================== BUTTERFLIES ====================
    class Butterfly {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 8 + 16; // 16-24px
        this.baseX = this.x;
        this.baseY = this.y;
        this.offsetX = Math.random() * 100;
        this.offsetY = Math.random() * 100;
        this.speedX = Math.random() * 0.02 + 0.01;
        this.speedY = Math.random() * 0.02 + 0.01;
        this.flapSpeed = Math.random() * 0.1 + 0.1;
        this.flapOffset = Math.random() * Math.PI * 2;
        const colors = ['rgba(255, 140, 0, 0.8)', 'rgba(255, 215, 0, 0.8)', 'rgba(65, 105, 225, 0.8)', 'rgba(138, 43, 226, 0.8)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.offsetX += this.speedX;
        this.offsetY += this.speedY;
        this.x = this.baseX + Math.sin(this.offsetX) * 100;
        this.y = this.baseY + Math.cos(this.offsetY) * 80;
        this.flapOffset += this.flapSpeed;

        if (this.x > width + 100 || this.x < -100 || this.y > height + 100 || this.y < -100) {
          this.reset();
        }
      }

      draw(ctx) {
        const wingFlap = Math.sin(this.flapOffset) * 0.5 + 0.5;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        
        // Left wing
        ctx.beginPath();
        ctx.ellipse(-this.size / 4, 0, this.size / 2 * wingFlap, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Right wing
        ctx.beginPath();
        ctx.ellipse(this.size / 4, 0, this.size / 2 * wingFlap, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(-this.size / 16, -this.size / 3, this.size / 8, this.size * 0.66);
        
        ctx.restore();
      }
    }

    // Initialize particles based on effect type
    const initParticles = () => {
      particlesRef.current = [];

      switch (effectConfig.effectType) {
        case 'snowfall':
          for (let i = 0; i < getParticleCount(60); i++) {
            particlesRef.current.push(new Snowflake());
          }
          break;
        case 'fireworks':
          for (let i = 0; i < getParticleCount(3); i++) {
            particlesRef.current.push(new Firework());
          }
          break;
        case 'sakura':
          for (let i = 0; i < getParticleCount(40); i++) {
            particlesRef.current.push(new SakuraPetal());
          }
          break;
        case 'leaves':
          for (let i = 0; i < getParticleCount(50); i++) {
            particlesRef.current.push(new AutumnLeaf());
          }
          break;
        case 'particles':
          for (let i = 0; i < getParticleCount(100); i++) {
            particlesRef.current.push(new FloatingParticle());
          }
          break;
        case 'fog':
          for (let i = 0; i < getParticleCount(10); i++) {
            particlesRef.current.push(new FogCloud());
          }
          break;
        case 'hearts':
          for (let i = 0; i < getParticleCount(30); i++) {
            particlesRef.current.push(new FloatingHeart());
          }
          break;
        case 'stars':
          for (let i = 0; i < getParticleCount(5); i++) {
            particlesRef.current.push(new ShootingStar());
          }
          break;
        case 'rain':
          for (let i = 0; i < getParticleCount(150); i++) {
            particlesRef.current.push(new Raindrop());
          }
          break;
        case 'butterflies':
          for (let i = 0; i < getParticleCount(15); i++) {
            particlesRef.current.push(new Butterfly());
          }
          break;
        default:
          break;
      }
    };

    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [effectConfig]);

  if (effectConfig.effectType === 'none') {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}