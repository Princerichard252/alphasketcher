// src/App.jsx

// 1. ALL IMPORTS MUST BE AT THE VERY TOP
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// --- ANIMATED RESPONSIVE DIGIT (Scaled Down & Sleek) ---
const AnimatedDigit = ({ value, label }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        width: 'clamp(45px, 8vw, 65px)',   // Reduced max-width
        height: 'clamp(55px, 10vw, 75px)', // Reduced max-height
        background: 'rgba(0, 0, 0, 0.15)', // Soft frosted indent
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.03)',
        borderTop: '1px solid rgba(0, 0, 0, 0.5)', // Inner top shadow
        overflow: 'hidden',
        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 30, opacity: 0, filter: 'blur(5px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -30, opacity: 0, filter: 'blur(5px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: 'absolute',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(24px, 5vw, 36px)', // Reduced font size
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            {value < 10 ? `0${value}` : value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span style={{ 
        fontFamily: "'Space Grotesk', sans-serif", 
        fontSize: 'clamp(8px, 1.5vw, 10px)', // Reduced label size
        textTransform: 'uppercase', 
        letterSpacing: '0.2em', 
        marginTop: '10px', 
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: 500
      }}>
        {label}
      </span>
    </div>
  );
};

// --- THE INTERACTIVE 3D SHAPE ---
const InteractiveShape = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const targetX = (state.pointer.x * Math.PI) / 4; 
    const targetY = (state.pointer.y * Math.PI) / 4;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05);
    groupRef.current.rotation.z += 0.002;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh scale={1.2}>
          <torusKnotGeometry args={[1.2, 0.4, 256, 64]} />
          <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh scale={1.21}>
          <torusKnotGeometry args={[1.2, 0.4, 100, 16]} />
          <meshBasicMaterial color="#FFD60A" wireframe transparent opacity={0.15} />
        </mesh>
      </Float>
      <Sparkles count={200} scale={12} size={2} speed={0.4} color="#FFD60A" opacity={0.3} />
    </group>
  );
};

// --- THE COMBINED BACKGROUND (Gradients + 3D) ---
const AnimatedBackground = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, backgroundColor: '#050505' }}>
    
    <motion.div 
      animate={{ x: ['-10vw', '20vw', '-10vw'], y: ['-10vh', '30vh', '-10vh'], scale: [1, 1.2, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', top: '-10%', right: '10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255,214,10,0.15) 0%, transparent 60%)', filter: 'blur(90px)', borderRadius: '50%' }}
    />
    <motion.div 
      animate={{ x: ['20vw', '-20vw', '20vw'], y: ['20vh', '-10vh', '20vh'], scale: [1, 1.5, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(255,214,10,0.08) 0%, transparent 70%)', filter: 'blur(100px)', borderRadius: '50%' }}
    />

    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#FFD60A" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
        <InteractiveShape />
      </Canvas>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  
  // 1. REAL-WORLD COUNTDOWN LOGIC
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    // ⚠️ SET YOUR EXACT LAUNCH DATE AND TIME HERE (Year, Month, Day, Hour, Minute, Second)
    // Note: In JavaScript, Months are 0-indexed! (0 = January, 4 = May, 11 = December)
    // So for June 3rd, 2024 at 12:00 PM: new Date(2024, 5, 3, 12, 0, 0)
    
    // For right now, I'll set it exactly 27 days from today (June 1st, 2024)
    const targetDate = new Date(2024, 5, 1, 0, 0, 0).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Stop the timer when it hits zero!
        clearInterval(interval);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      }
    }, 1000);

    // Run it once immediately so there is no 1-second delay/flash on load
    const now = new Date().getTime();
    const difference = targetDate - now;
    if (difference > 0) {
      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }

    return () => clearInterval(interval);
  }, []);

  // 2. 3D HOVER EFFECT LOGIC (Track mouse position)
  // ... (The rest of your App code stays exactly the same)

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{
      position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#050505',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}>
      
      {/* 🟢 THE 3D BACKGROUND */}
      <AnimatedBackground />

      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px' }}>
        
        {/* 🎬 CINEMATIC TITLE REVEAL */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} 
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{ 
            fontFamily: "'Space Grotesk', sans-serif", 
            fontSize: 'clamp(32px, 5vw, 55px)', // Scaled down
            fontWeight: 700, 
            color: '#ffffff', 
            margin: '0 0 25px 0', 
            letterSpacing: '-0.02em', 
            lineHeight: 1,
            textShadow: '0 10px 30px rgba(0,0,0,0.8)', 
            textAlign: 'center',
            textTransform: 'uppercase'
          }}
        >
          ALPHA SKETCHER
          <motion.span 
            initial={{ opacity: 0, scale: 0 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
            style={{ 
              color: '#FFD60A', 
              display: 'inline-block',
              textShadow: '0 0 30px rgba(255, 214, 10, 0.8)'
            }}
          >
            .
          </motion.span>
        </motion.h1>

        {/* 🪟 REFERENCE LIQUID GLASS CARD */}
        <div style={{ perspective: "1200px", width: '100%', maxWidth: '580px' /* Scaled down max-width */ }}>
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              width: '100%', 
              padding: 'clamp(30px, 4vw, 45px) clamp(20px, 3vw, 30px)', // Scaled down padding
              borderRadius: '24px', 
              
              // Dark tinted gradient for perfect contrast
              background: 'linear-gradient(180deg, rgba(30, 30, 30, 0.4) 0%, rgba(5, 5, 5, 0.8) 100%)',
              backdropFilter: 'blur(32px) saturate(140%)', 
              WebkitBackdropFilter: 'blur(32px) saturate(140%)',
              
              // Crisp white top-edge reflection
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)', 
              
              boxShadow: `
                inset 0 1px 20px rgba(255, 255, 255, 0.05),
                0 30px 60px rgba(0, 0, 0, 0.8),
                0 0 60px rgba(255, 214, 10, 0.05)
              `,
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4 }}
          >
            {/* MICRO NOISE TEXTURE (Faint) */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, 
              opacity: 0.03, pointerEvents: 'none', mixBlendMode: 'overlay',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}></div>

            {/* 3D PUSHED CONTENT */}
            <div style={{ transform: "translateZ(40px)", zIndex: 1, width: '100%' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px, 3vw, 22px)', color: '#ffffff', margin: '0 0 10px 0', fontWeight: 500, letterSpacing: '-0.02em' }}>
                Full portfolio launching soon.
              </h2>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(13px, 2vw, 14px)', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 35px auto', maxWidth: '380px', lineHeight: '1.6' }}>
                I’m building a premium space where creativity meets functionality. Designing digital experiences that stand out.
              </p>

              {/* The Digits Grid */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 'clamp(6px, 1.5vw, 12px)' }}>
                <AnimatedDigit value={timeLeft.d} label="Days" />
                <span style={{ fontSize: 'clamp(16px, 3vw, 24px)', color: 'rgba(255, 255, 255, 0.2)', fontWeight: 700, margin: 'clamp(10px, 3vw, 15px) 0 0 0' }}>:</span>
                <AnimatedDigit value={timeLeft.h} label="Hours" />
                <span style={{ fontSize: 'clamp(16px, 3vw, 24px)', color: 'rgba(255, 255, 255, 0.2)', fontWeight: 700, margin: 'clamp(10px, 3vw, 15px) 0 0 0' }}>:</span>
                <AnimatedDigit value={timeLeft.m} label="Minutes" />
                <span style={{ fontSize: 'clamp(16px, 3vw, 24px)', color: 'rgba(255, 255, 255, 0.2)', fontWeight: 700, margin: 'clamp(10px, 3vw, 15px) 0 0 0' }}>:</span>
                <AnimatedDigit value={timeLeft.s} label="Seconds" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🔗 X / TWITTER BUTTON */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} style={{ marginTop: '30px', zIndex: 20 }}>
          <a href="https://x.com/AlphaSketcher" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '50px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', textDecoration: 'none',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 500, transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 214, 10, 0.1)'; e.currentTarget.style.border = '1px solid rgba(255, 214, 10, 0.5)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1122 12.8955L4 20H5.38119L10.7254 13.7878L14.994 20H19.656L13.3171 10.7749H13.3174ZM11.4257 12.9738L10.8064 12.0881L5.87886 5.03974H8.00029L11.9769 10.724L12.5962 11.6097L17.7656 19.0075H15.6442L11.4257 12.9742V12.9738Z" fill="white"/>
            </svg>
            Follow updates on X
          </a>
        </motion.div>
      </div>

      {/* MASSIVE BACKGROUND TEXT */}
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        style={{
          position: 'absolute', bottom: '-5vh', width: '100%', textAlign: 'center',
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(90px, 25vw, 300px)', fontWeight: 700,
          color: 'transparent', WebkitTextStroke: '1px rgba(255, 255, 255, 0.05)', userSelect: 'none', pointerEvents: 'none', zIndex: 1
        }}
      >
        SKETCHER
      </motion.div>

      {/* 🏁 REFERENCE-STYLE FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '24px',
          width: '100%',
          textAlign: 'center',
          zIndex: 20,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(9px, 2vw, 11px)',
          color: 'rgba(255, 255, 255, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          pointerEvents: 'none'
        }}
      >
        ©2024 Alpha Sketcher • Crafted for the future • 404
      </motion.div>

    </div>
  );
}