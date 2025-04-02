import { useEffect } from 'react';

export default function ParticlesBackground() {
  // Create simple rain animation without splash effects
  useEffect(() => {
    // Don't run in SSR
    if (typeof window === 'undefined') return;
    
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // Create raindrops
    const createRainDrops = () => {
      // Create a random number of droplets
      const numDrops = Math.floor(Math.random() * 20) + 40;
      
      for (let i = 0; i < numDrops; i++) {
        // Create a raindrop
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        
        // Random position and properties
        const xPos = Math.random() * 100;
        const yDelay = Math.random() * 15;
        const size = Math.random() * 1.5 + 0.5; // Between 0.5 and 2
        const opacity = Math.random() * 0.6 + 0.4; // Between 0.4 and 1.0
        const duration = Math.random() * 3 + 2; // Between 2 and 5 seconds
        const delay = Math.random() * 3; // Random delay for natural effect
        
        // Apply styles
        drop.style.left = `${xPos}%`;
        drop.style.top = `-${yDelay}%`;
        drop.style.width = `${size}px`;
        drop.style.height = `${size * 8}px`;
        drop.style.opacity = `${opacity}`;
        
        // Add to container
        particlesContainer.appendChild(drop);
        
        // Animate with CSS
        drop.style.animation = `droplet-fall ${duration}s linear ${delay}s forwards`;
        
        // Clean up after animation completes
        setTimeout(() => {
          if (drop.parentNode === particlesContainer) {
            drop.remove();
          }
        }, (duration + delay) * 1000 + 100);
        
        // Occasionally add ripple effect at bottom
        if (Math.random() > 0.7) {
          setTimeout(() => {
            // Create ripple effect (puddle)
            const ripple = document.createElement('div');
            ripple.classList.add('rain-ripple');
            
            // Position ripple at bottom
            ripple.style.left = `${xPos}%`;
            ripple.style.bottom = `${Math.random() * 20}%`;
            
            // Size of ripple
            const rippleSize = Math.random() * 15 + 5;
            ripple.style.width = `${rippleSize}px`;
            ripple.style.height = `${rippleSize}px`;
            
            // Fade effect
            const animationDuration = 1.0 + Math.random() * 1.0;
            ripple.style.animationDuration = `${animationDuration}s`;
            
            particlesContainer.appendChild(ripple);
            
            // Clean up ripple after animation
            setTimeout(() => {
              ripple.remove();
            }, animationDuration * 1000);
          }, (duration * 1000) / 2);
        }
      }
    };
    
    // Initial creation
    createRainDrops();
    
    // Create more drops periodically
    const interval = setInterval(createRainDrops, 3000);
    
    // Return cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div
      id="particles-js"
      className="fixed w-full h-full top-0 left-0 z-0 overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(15, 36, 23, 0.80), rgba(15, 36, 23, 0.65)),
          url('https://images.unsplash.com/photo-1536768139911-e290a5261b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jungle-dark/30 to-jungle-dark/50"></div>
      
      {/* Mist/fog effect */}
      <div className="absolute inset-0 opacity-30" 
           style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
             backgroundBlendMode: 'screen',
             mixBlendMode: 'overlay',
             filter: 'blur(8px)'
           }}></div>
    </div>
  );
}
