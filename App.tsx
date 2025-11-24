
import React, { useState, useEffect, useRef } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import CalendarSection from './components/CalendarSection';
import HistorySection from './components/HistorySection';
import AdminLoginModal from './components/AdminLoginModal';
import TechBackground from './components/TechBackground';
import { Menu, X, Facebook, Lock, MapPin, Calendar } from 'lucide-react';
import { getEvents } from './services/storage';
import { CalendarEvent } from './types';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, mobile = false, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick();
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (mobile) {
    return (
      <a 
        href={href} 
        onClick={handleClick}
        className="block text-2xl py-4 border-b border-gray-800 font-bold tracking-widest uppercase text-white hover:text-sanyu-red transition-colors text-right"
      >
        {children}
      </a>
    );
  }

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className="relative group px-5 py-2 font-bold tracking-widest uppercase text-sm flex items-center justify-center cursor-pointer"
    >
      {/* Background Wrapper */}
      <div className="absolute inset-0 -z-10 rounded-sm">
         {/* Techy Skewed Background */}
        <span className="absolute inset-0 bg-sanyu-red-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out origin-left border-l-2 border-sanyu-red-50"></span>
      </div>
      
      {/* Techy Glow Line Bottom */}
      <span className="absolute bottom-0 left-0 w-full h-2px bg-sanyu-red shadow-neon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
      
      {/* Text with Glow Effect on Hover */}
      <span className="relative z-10 text-gray-300 group-hover:text-white group-hover:drop-shadow-neon transition-all duration-300">
        {children}
      </span>
      
      {/* Corner Decoration */}
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-sanyu-red opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"></span>
    </a>
  );
};

// Optimized Particle Background Component
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; pulseSpeed: number }[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;
    
    // Mouse interaction state
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const area = width * height;
      // PERFORMANCE: significantly reduce density (divide by 20000 instead of 15000)
      const count = Math.floor(area / 20000); 
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5, 
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 4 + 2, 
          opacity: Math.random() * 0.5 + 0.1,
          pulseSpeed: (Math.random() - 0.5) * 0.01 
        });
      }
    };

    const animate = () => {
      if (!isVisible) return; // PERFORMANCE: Stop rendering if not visible

      ctx.clearRect(0, 0, width, height);
      
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Pulse opacity
        p.opacity += p.pulseSpeed;
        if (p.opacity > 0.6 || p.opacity < 0.1) p.pulseSpeed *= -1;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse Repulsion - Optimized
        // Only calculate interaction if mouse is somewhat inside the canvas
        if (mouse.x > -100 && mouse.x < width + 100) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            // Quick bounding box check before sqrt
            if (dx < 150 && dx > -150 && dy < 150 && dy > -150) {
                const distSq = dx * dx + dy * dy;
                const maxDistSq = 22500; // 150^2
                
                if (distSq < maxDistSq) {
                  const distance = Math.sqrt(distSq);
                  const force = (150 - distance) / 150;
                  const angle = Math.atan2(dy, dx);
                  const pushX = Math.cos(angle) * force * 2.0;
                  const pushY = Math.sin(angle) * force * 2.0;
                  
                  p.x -= pushX;
                  p.y -= pushY;
                }
            }
        }

        // Draw Circle
        ctx.beginPath();
        // Optimization: floor values for rendering can sometimes be faster, but modern browsers handle subpixels well.
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Use Intersection Observer to pause animation when off-screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animate(); // Resume
        } else {
          cancelAnimationFrame(animationFrameId); // Pause
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} />
    </div>
  );
};


// Updated SVG Logo Component with Alternating Blink on Triangle and Red Y
const SanyuLogo = ({ 
  className = "", 
  animate = false, 
  monochrome = false
}: { 
  className?: string, 
  animate?: boolean, 
  idSuffix?: string, 
  monochrome?: boolean
}) => {
  // Default Colors
  const colorRed = monochrome ? "#ffffff" : "#de2351";
  const colorGray = monochrome ? "#ffffff" : "#d1d3d4";
  const colorWhite = monochrome ? "#ffffff" : "#ffffff";

  return (
    <svg
      viewBox="0 0 171.09 141.73"
      className={`${className} ${animate ? 'overflow-visible' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {animate && (
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes blink-glow {
              0%, 100% { opacity: 1; filter: drop-shadow(0 0 10px rgba(255,255,255,0.8)); }
              50% { opacity: 0.3; filter: drop-shadow(0 0 0px transparent); }
            }
            @keyframes blink-glow-red {
              0%, 100% { opacity: 1; filter: drop-shadow(0 0 15px rgba(222, 35, 81, 0.8)); }
              50% { opacity: 0.3; filter: drop-shadow(0 0 0px transparent); }
            }
            .sanyu-float {
              animation: float 6s ease-in-out infinite;
            }
            /* Triangle Blinking */
            .blink-bg {
              animation: blink-glow 4s ease-in-out infinite;
            }
            /* Red Y Blinking (Alternating phase) */
            .blink-red {
              animation: blink-glow-red 4s ease-in-out infinite;
              animation-delay: 2s; /* Half of duration to alternate */
            }
          `}</style>
        )}
      </defs>
      <g className={animate ? "sanyu-float" : ""}>
        {/* White Triangle Background (st2) - BLINKS */}
        <polygon 
          points="139.05 44.21 75.22 44.21 94.39 63.38 65 63.38 71.66 70.05 101.88 70.05 101.88 70.04 110.55 70.04 107.13 66.62 91.4 50.88 132.38 50.88 139.05 44.21"
          style={{ fill: colorWhite }}
          className={animate && !monochrome ? "blink-bg" : ""}
        />
        
        {/* Gray Path 1 (S Part - Outer Curve) (st0) - STATIC */}
        <path 
          d="M124.38,70.05c0,.56-.01,1.11-.04,1.67-.12,2.82-.57,5.55-1.3,8.17-.19.69-.4,1.36-.63,2.03-.78,2.28-1.78,4.47-2.98,6.52-.32.56-.66,1.11-1.02,1.65-1.24,1.89-2.65,3.67-4.21,5.3-.43.45-.88.9-1.33,1.33-3.4,3.21-7.41,5.77-11.83,7.5-2.13.83-4.36,1.47-6.67,1.89-1.35.25-2.73.42-4.12.52-.84.06-1.69.09-2.54.09s-1.7-.03-2.54-.09c-1.11-.08-2.21-.2-3.29-.37-.63-.1-1.25-.22-1.86-.35l4.36-4.36c1.1.12,2.21.17,3.33.17,4.76,0,9.28-1.05,13.33-2.94,3.06-1.42,5.86-3.32,8.3-5.6.46-.43.9-.87,1.34-1.32,1.56-1.64,2.94-3.44,4.12-5.39.34-.56.66-1.12.96-1.7,1.13-2.15,2.02-4.45,2.64-6.86.18-.72.34-1.45.48-2.19.24-1.31.39-2.64.46-4,.03-.55.04-1.11.04-1.67,0-1.13-.06-2.24-.17-3.33l4.36-4.36c.07.34.14.69.2,1.03.4,2.16.61,4.39.61,6.67Z"
          style={{ fill: colorGray }}
        />

        {/* Gray Path 2 (S Text Part) (st0) - STATIC */}
        <path 
          d="M111.97,42.55h-8.54c-.77-.44-1.57-.85-2.38-1.23-4.05-1.88-8.57-2.94-13.33-2.94-1.93,0-3.83.17-5.66.51-.06.01-.11.02-.17.03-.1.02-.21.04-.31.06-.57.11-1.14.24-1.7.39-1.6.41-3.15.94-4.65,1.58-.75.32-1.49.68-2.21,1.05-.34.18-.67.36-1,.55-.24.14-.47.27-.7.41-.65.4-1.29.81-1.9,1.25-1.23.87-2.39,1.83-3.48,2.86-.45.43-.9.88-1.32,1.34-.74.79-1.43,1.61-2.08,2.47-2.77,3.63-4.76,7.88-5.75,12.5-.46,2.15-.7,4.38-.7,6.67,0,.56.01,1.11.04,1.67.59,11.47,7.29,21.32,16.91,26.38l-3.68,3.68c-10.47-6.08-17.66-17.21-18.23-30.05-.03-.55-.04-1.11-.04-1.67,0-2.28.21-4.5.61-6.67.83-4.51,2.48-8.73,4.8-12.5,1.33-2.16,2.87-4.17,4.6-6,.21-.22.42-.45.64-.66.22-.23.45-.45.68-.67.35-.34.72-.67,1.08-1,1.32-1.17,2.73-2.24,4.21-3.21.54-.35,1.09-.69,1.65-1.01,1.87-1.08,3.84-2.01,5.89-2.75.21-.08.42-.15.63-.22.67-.23,1.35-.44,2.03-.63,1.31-.36,2.64-.66,4-.87,1.9-.3,3.85-.46,5.83-.46,2.28,0,4.5.21,6.67.61,2.3.42,4.53,1.06,6.67,1.89,4.04,1.58,7.72,3.85,10.92,6.67Z"
          style={{ fill: colorGray }}
        />

        {/* Red Path (Y Part) (st1) - BLINKS */}
        <path 
          d="M130.7,52.56h-9.5l-10.06,10.06h0l-10.09,10.09-19.16-19.16v9.5l14.41,14.41-29.16,29.16h9.5l5.25-5.25,31.33-31.33,5.66-5.66,1-1,10.02-10.02s-.02-.03-.03-.04h.07l.76-.76Z"
          style={{ fill: colorRed }}
          className={animate && !monochrome ? "blink-red" : ""}
        />
      </g>
    </svg>
  );
};

// Spotlight Title Component
const SpotlightTitle = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative mb-8 select-none text-left w-full"
      style={{
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
      } as React.CSSProperties}
    >
      {/* Base Text (Darker/Dimmed) - Updated color to #c2144e as requested */}
      <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-relaxed py-4 pr-4" style={{ color: '#c2144e' }}>
        精準<br />策略<br />勝利
      </h1>
      
      {/* Spotlight Reveal Layer - absolute inset-0 to match perfectly */}
      <h1 
        className="text-5xl md:text-7xl font-black italic uppercase leading-relaxed absolute inset-0 text-transparent bg-clip-text pointer-events-none py-4 pr-4"
        style={{
          // Updated to 500px radius and new stops as requested
          backgroundImage: 'radial-gradient(circle 500px at var(--x) var(--y), #ffffff 0%, #e6004c 20%, transparent 100%)',
          WebkitBackgroundClip: 'text',
          textAlign: 'left'
        }}
      >
        精準<br />策略<br />勝利
      </h1>
    </div>
  );
}

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Global Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Next Match State
  const [nextMatch, setNextMatch] = useState<{
    event: CalendarEvent;
    daysLeft: number;
  } | null>(null);

  // Hero section reference for mouse tracking
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Calculate Next Match
    const events = getEvents();
    const today = new Date();
    // Reset time part of today for accurate comparison
    today.setHours(0, 0, 0, 0);

    const upcomingCompetitions = events
      .filter(e => e.type === 'competition')
      .map(e => ({
        ...e,
        parsedDate: parseISO(e.date)
      }))
      .filter(e => e.parsedDate >= today)
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    if (upcomingCompetitions.length > 0) {
      const match = upcomingCompetitions[0];
      const days = differenceInDays(match.parsedDate, today);
      setNextMatch({
        event: match,
        daysLeft: days
      });
    }
    
    // Add mouse move listener to hero section using ref to avoid re-renders
    const handleHeroMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        heroRef.current.style.setProperty('--mouse-x', `${x}px`);
        heroRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    const heroEl = heroRef.current;
    if (heroEl) {
      heroEl.addEventListener('mousemove', handleHeroMouseMove);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (heroEl) {
        heroEl.removeEventListener('mousemove', handleHeroMouseMove);
      }
    };
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-sanyu-black text-white font-sans relative">
      {/* Global Tech Background for non-hero sections */}
      <TechBackground />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-sanyu-black-95 backdrop-blur-sm border-gray-800 py-2' : 'bg-transparent border-transparent py-6'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Enlarged Logo in Nav */}
            <div className="h-14 w-14">
              <SanyuLogo className="w-full h-full" monochrome />
            </div>
            <span className="font-black text-xl tracking-tighter hidden md:block">
              三玉 <span className="text-white drop-shadow-md">滾球</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 items-center">
            <NavLink href="#hero" onClick={handleNavClick}>首頁</NavLink>
            <NavLink href="#calendar" onClick={handleNavClick}>行事曆</NavLink>
            <NavLink href="#history" onClick={handleNavClick}>歷年成績</NavLink>
            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              className="ml-4 bg-white bg-opacity-10 text-white p-2 rounded-full hover:bg-sanyu-red hover:shadow-neon-strong transition-all duration-300 group"
            >
              <Facebook size={18} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white hover:text-sanyu-red transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-sanyu-black z-40 pt-24 px-8 transform transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <NavLink href="#hero" mobile onClick={handleNavClick}>首頁</NavLink>
        <NavLink href="#calendar" mobile onClick={handleNavClick}>行事曆</NavLink>
        <NavLink href="#history" mobile onClick={handleNavClick}>歷年成績</NavLink>
      </div>

      {/* Hero Section */}
      <section 
        id="hero" 
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-sanyu-black z-10"
      >
        {/* Interactive Particle Background */}
        <ParticleBackground />
        
        {/* Mouse Follower Glow Layer */}
        <div 
           className="absolute inset-0 pointer-events-none"
           style={{
             background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(230, 0, 76, 0.15), transparent 40%)'
           }}
        />

        {/* Abstract Background Shapes */}
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-sanyu-red rounded-full opacity-10 animate-pulse pointer-events-none blur-128"
        ></div>

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-8 items-center h-full" style={{ minHeight: 'calc(100vh - 80px)' }}>
          
          {/* Left Column: Visuals (Replaced Images with Logo) */}
          <div className="order-1 md:order-1 relative w-full h-full flex items-center justify-center md:justify-start pointer-events-none md:pointer-events-auto">
             <div className="relative w-full max-w-lg aspect-square flex items-center justify-center p-8">
                  <SanyuLogo 
                    animate 
                    className="w-full h-full drop-shadow-neon" 
                  />
             </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="order-2 md:order-2 select-none flex flex-col items-start text-left md:pl-10 relative z-30">
            <div className="inline-block bg-sanyu-red-10 border border-sanyu-red-50 text-sanyu-red text-xl font-bold px-6 py-2 rounded-full mb-8 tracking-widest uppercase shadow-neon-soft hover:scale-105 transition-transform duration-300">
              熱烈招生中
            </div>
            
            <SpotlightTitle />

            <div className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed space-y-2 font-medium">
              <p className="block text-xl text-white">歡迎加入三玉國小滾球隊</p>
              <p className="block text-gray-400">我們培養冠軍，磨練心性，追求卓越！</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 w-full mb-8">
              {/* Practice Time Block */}
              <div className="bg-sanyu-dark-50 border-l-4 border-sanyu-red p-6 rounded-r-lg backdrop-blur-sm shadow-lg hover:bg-sanyu-dark-70 transition-colors flex flex-col items-start flex-1 min-w-[220px]">
                <h3 className="text-white font-bold uppercase tracking-wider mb-2 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-sanyu-red rounded-full animate-pulse"></span>
                  練習時間
                </h3>
                <p className="text-2xl font-black text-white">週一 • 週二 • 週四</p>
                <p className="text-sanyu-red font-bold text-lg glow-text">16:00 ~ 17:30</p>
                <p className="text-gray-500 text-sm mt-2">@ 三玉國小滾球場</p>
              </div>

              {/* Next Match Block (Conditional) */}
              {nextMatch && (
                <div className="bg-sanyu-dark-50 border-l-4 border-yellow-500 p-6 rounded-r-lg backdrop-blur-sm shadow-lg hover:bg-sanyu-dark-70 transition-colors flex flex-col items-start flex-1 min-w-[220px]">
                  <h3 className="text-white font-bold uppercase tracking-wider mb-2 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    下一場比賽
                  </h3>
                  <div className="flex items-baseline gap-2 mb-1">
                     <span className="text-xs text-gray-400">倒數</span>
                     <span className="text-5xl font-black text-white tracking-tighter leading-none">{nextMatch.daysLeft}</span>
                     <span className="text-xs text-gray-400">天</span>
                  </div>
                  <p className="text-sanyu-red font-bold text-xl leading-tight mb-2">{nextMatch.event.title}</p>
                  <div className="flex flex-col gap-1 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                       <Calendar size={12} />
                       <span>{nextMatch.event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <MapPin size={12} />
                       <span>{nextMatch.event.location || '請見詳細資訊'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink href="#calendar">
               <span 
                 className="inline-flex items-center gap-2 bg-white text-black hover:bg-sanyu-red hover:text-white hover:shadow-neon-glow font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-neon-glow cursor-pointer"
               >
                  查看行事曆
               </span>
            </NavLink>
          </div>

        </div>
      </section>

      {/* Main Components - Now with Tech Background visible underneath */}
      <CalendarSection isAdmin={isAdmin} />
      <HistorySection isAdmin={isAdmin} />

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-8">
             {/* Enlarged Footer Logo */}
             <div className="h-24 w-24 opacity-50 hover:opacity-100 transition-opacity rounded-full overflow-visible">
               <SanyuLogo className="w-full h-full" monochrome />
             </div>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} 三玉滾球隊 (Sanyu Pétanque Club). 版權所有.
          </p>
          <p className="text-gray-700 text-xs mt-2">
            專為滾球運動設計.
          </p>
        </div>
      </footer>

      {/* Admin Toggle (Subtle, Bottom Right) */}
      <button 
        onClick={() => isAdmin ? setIsAdmin(false) : setShowLoginModal(true)}
        className="fixed bottom-4 right-4 z-50 text-gray-700 hover:text-sanyu-red transition-colors opacity-30 hover:opacity-100 p-2"
        title={isAdmin ? "退出管理員" : "管理員登入"}
      >
        <Lock size={16} />
      </button>

      <AdminLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setIsAdmin(true)}
      />
    </div>
  );
};

export default App;
