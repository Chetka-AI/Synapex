/* ═══════════════════════════════════════════════════
   SYNAPEX PROTOCOL — Shared JavaScript
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── PARTICLE SYSTEM ─────────────────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.opacity = Math.random() * 0.35 + 0.08;
        this.color = Math.random() > 0.5 ? '74,140,255' : '0,212,168';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          const f = (140 - d) / 140;
          this.x -= dx * f * 0.008;
          this.y -= dy * f * 0.008;
        }
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      const n = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
      particles = [];
      for (let i = 0; i < n; i++) particles.push(new Particle());
    }

    function connections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(74,140,255,${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connections();
      requestAnimationFrame(animate);
    }

    resize();
    init();
    animate();
    window.addEventListener('resize', () => { resize(); init(); });
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  }

  /* ── CURSOR GLOW ─────────────────────────── */
  const glow = document.getElementById('cursorGlow');
  if (glow) {
    let active = false;
    document.addEventListener('mousemove', e => {
      if (!active) { glow.classList.add('active'); active = true; }
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
      active = false;
    });
  }

  /* ── NAVIGATION ──────────────────────────── */
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ── ALLOCATION BARS ─────────────────────── */
  const allocWrap = document.getElementById('allocSection');
  if (allocWrap) {
    const ao = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.alloc-bar[data-width]').forEach((b, i) => {
            setTimeout(() => { b.style.width = b.dataset.width + '%'; }, i * 80);
          });
          ao.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    ao.observe(allocWrap);
  }

  /* ── TYPING EFFECT (landing page) ────────── */
  const typeEl = document.getElementById('heroLabel');
  if (typeEl) {
    const text = typeEl.dataset.text || 'Decentralized Autonomous Embodied Intelligence';
    let idx = 0;
    function type() {
      if (idx < text.length) {
        typeEl.textContent += text.charAt(idx);
        idx++;
        setTimeout(type, 35 + Math.random() * 25);
      }
    }
    setTimeout(type, 1000);
  }

  /* ── SMOOTH SCROLL (same-page anchors) ──── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── PARALLAX ORBs (landing) ─────────────── */
  const orbs = document.querySelectorAll('.landing-orb');
  if (orbs.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orbs.forEach((o, i) => {
        o.style.transform = `translateY(${y * (i + 1) * 0.04}px)`;
      });
    });
  }

})();
