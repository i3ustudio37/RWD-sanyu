
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
    const CONNECTION_DIST = 100; // Slightly reduced connection distance to keep it clean with high density
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
    const SIGNAL_SPEED_BASE = 1.0;

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
      
      // High Density (User request: do not reduce density)
      // Using a smaller divisor increases count.
      const nodeCount = Math.floor(area / 10000); 
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2, // Very slow movement
          vy: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update Nodes
      // Very subtle nodes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'; 
      const len = nodes.length;

      for (let i = 0; i < len; i++) {
        const node = nodes[i];
        
        // Physics
        node.x += node.vx;
        node.y += node.vy;

        // Bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw Node (Tiny size)
        ctx.beginPath();
        ctx.arc(node.x, node.y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Connections & Logic
      ctx.lineWidth = 0.3; // Very thin lines

      // Spawn signals rarely
      if (Math.random() < 0.01 && signals.length < 5) {
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
            // Very subtle opacity
            const opacity = (1 - (dist / CONNECTION_DIST)) * 0.05; 
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Signals (Dots on lines)
      ctx.fillStyle = 'rgba(230, 0, 76, 0.4)'; // More transparent red
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
          ctx.arc(currX, currY, 1.2, 0, Math.PI * 2);
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
      style={{ opacity: 1 }} // Controlled by internal fillStyle/strokeStyle
    />
  );
};

export default TechBackground;
