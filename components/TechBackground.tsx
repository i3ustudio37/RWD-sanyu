
import React, { useEffect, useRef } from 'react';

const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); // Optimized context
    if (!ctx) return;

    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    let signals: { from: number; to: number; progress: number; speed: number }[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    
    // Performance Config
    const CONNECTION_DIST = 120;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
    const SIGNAL_SPEED_BASE = 1.5;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      signals = [];
      const area = width * height;
      
      // Reduce density: Divide by a larger number (e.g., 25000 instead of 18000)
      // This significantly reduces the O(N^2) complexity of line checks
      const nodeCount = Math.floor(area / 25000); 
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3, // Slow movement is smoother
          vy: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update Nodes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      const len = nodes.length;

      for (let i = 0; i < len; i++) {
        const node = nodes[i];
        
        // Physics
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Connections & Logic
      // Optimization: Separate loop for drawing to minimize state changes, 
      // but here we combine for single pass over N^2 pairs if N is small.
      
      ctx.lineWidth = 0.5;

      // Spawn signals rarely
      if (Math.random() < 0.02 && signals.length < 5) {
        const fromIdx = Math.floor(Math.random() * len);
        // Find a neighbor
        for (let j = 0; j < len; j++) {
           if (fromIdx === j) continue;
           const dx = nodes[fromIdx].x - nodes[j].x;
           // Fast check X
           if (Math.abs(dx) > CONNECTION_DIST) continue;
           
           const dy = nodes[fromIdx].y - nodes[j].y;
           // Fast check Y
           if (Math.abs(dy) > CONNECTION_DIST) continue;

           if ((dx*dx + dy*dy) < CONNECTION_DIST_SQ) {
               signals.push({ from: fromIdx, to: j, progress: 0, speed: SIGNAL_SPEED_BASE + Math.random() });
               break; // Spawn one and done
           }
        }
      }

      // Line Drawing Loop
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = nodes[i].x - nodes[j].x;
          
          // Optimization: Early exit before sqrt
          if (dx > CONNECTION_DIST || dx < -CONNECTION_DIST) continue;

          const dy = nodes[i].y - nodes[j].y;
          if (dy > CONNECTION_DIST || dy < -CONNECTION_DIST) continue;

          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST_SQ) {
            // Only calculate actual distance if within range (for opacity)
            const dist = Math.sqrt(distSq);
            const opacity = 1 - (dist / CONNECTION_DIST);
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Signals (Dots on lines)
      ctx.fillStyle = '#e6004c';
      for (let i = signals.length - 1; i >= 0; i--) {
          const sig = signals[i];
          const p1 = nodes[sig.from];
          const p2 = nodes[sig.to];
          
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx*dx + dy*dy;
          
          // Break signal if nodes move too far apart
          if (distSq > CONNECTION_DIST_SQ) {
              signals.splice(i, 1);
              continue;
          }

          const dist = Math.sqrt(distSq);
          sig.progress += sig.speed / dist;
          
          if (sig.progress >= 1) {
              signals.splice(i, 1);
              continue;
          }

          const currX = p1.x + dx * sig.progress;
          const currY = p1.y + dy * sig.progress;

          ctx.beginPath();
          ctx.arc(currX, currY, 2, 0, Math.PI * 2);
          ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none" 
      style={{ opacity: 0.6 }} 
    />
  );
};

export default TechBackground;
