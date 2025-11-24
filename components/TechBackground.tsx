
import React, { useEffect, useRef } from 'react';

const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    let redParticles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    // Store signals traveling on lines: { fromIndex, toIndex, progress }
    let signals: { from: number; to: number; progress: number }[] = [];
    let animationFrameId: number;
    
    // Config
    const connectionDistance = 150;
    const signalSpeed = 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      redParticles = [];
      signals = []; // Clear signals when nodes are reset
      const area = canvas.width * canvas.height;
      
      // White network nodes
      const nodeCount = Math.floor(area / 18000); 
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }

      // Floating red ambient particles (visual consistency)
      const redCount = Math.floor(area / 40000);
      for (let i = 0; i < redCount; i++) {
        redParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw Red Particles (Background layer)
      redParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 0, 76, ${p.alpha})`; // Sanyu Red
        ctx.fill();
      });

      // 2. Update Nodes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Connections & Signals
      // Randomly spawn a signal occasionally
      if (Math.random() < 0.05 && nodes.length > 1) {
        const from = Math.floor(Math.random() * nodes.length);
        const sourceNode = nodes[from];

        if (sourceNode) {
            // Find a close neighbor
            let bestTo = -1;
            let minDist = connectionDistance;
            
            nodes.forEach((n, idx) => {
               if (idx === from) return;
               const dx = sourceNode.x - n.x;
               const dy = sourceNode.y - n.y;
               const dist = Math.sqrt(dx*dx + dy*dy);
               if (dist < minDist) {
                   minDist = dist;
                   bestTo = idx;
               }
            });
    
            if (bestTo !== -1) {
                signals.push({ from, to: bestTo, progress: 0 });
            }
        }
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = 1 - (dist / connectionDistance);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw active signals
      ctx.fillStyle = '#e6004c';
      for (let i = signals.length - 1; i >= 0; i--) {
          const sig = signals[i];
          const p1 = nodes[sig.from];
          const p2 = nodes[sig.to];
          
          // Safety check for undefined nodes (e.g. during resize events)
          if (!p1 || !p2) {
              signals.splice(i, 1);
              continue;
          }
          
          // Calculate distance to determine speed relative to length
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist > connectionDistance) {
              // Link broken
              signals.splice(i, 1);
              continue;
          }

          sig.progress += signalSpeed / dist;
          
          if (sig.progress >= 1) {
              signals.splice(i, 1);
              continue;
          }

          const currX = p1.x + dx * sig.progress;
          const currY = p1.y + dy * sig.progress;

          ctx.beginPath();
          ctx.arc(currX, currY, 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Glow trace
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#e6004c';
          ctx.fill();
          ctx.shadowBlur = 0;
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
      style={{ opacity: 0.6 }} // Subtle
    />
  );
};

export default TechBackground;
