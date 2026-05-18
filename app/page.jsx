"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  primary:     "#1E88E5",
  primaryDark: "#1565C0",
  darkPrimary: "#012D74",
  bg:          "#F7FAFC",
  surface:     "#FFFFFF",
  accent:      "#00C2FF",
  accentDark:  "#0099CC",
  textDark:    "#1A202C",
  textLight:   "#718096",
  textMid:     "#4A5568",
  border:      "#E2E8F0",
  borderMid:   "#CBD5E0",
  success:     "#38A169",
  warning:     "#D69E2E",
  error:       "#E53E3E",
};

// gradient helpers
const grad = (a, b, deg = 135) => `linear-gradient(${deg}deg, ${a}, ${b})`;
const primaryGrad  = grad(C.primary, C.darkPrimary);
const accentGrad   = grad(C.accent, C.primary, 90);
const bgHeroGrad   = grad("#EBF4FF", C.bg, 160);

// ─── GLOBAL STYLES injected once ──────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body {
    font-family:'Plus Jakarta Sans', sans-serif;
    background:${C.bg};
    color:${C.textDark};
    overflow-x:hidden;
    line-height:1.6;
  }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:${C.bg}; }
  ::-webkit-scrollbar-thumb { background:${C.borderMid}; border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:${C.primary}; }

  /* Animations */
  @keyframes fadeUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideRight { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideLeft  { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }
  @keyframes countUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes barFill  { from{width:0} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
  @keyframes dotBlink { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes slideDown{ from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(30,136,229,0.4), 0 0 40px rgba(30,136,229,0.2); } 50% { box-shadow: 0 0 40px rgba(30,136,229,0.6), 0 0 80px rgba(30,136,229,0.4); } }
  @keyframes borderGlow { 0%, 100% { border-color: rgba(30,136,229,0.3); } 50% { border-color: rgba(30,136,229,0.8); } }
  @keyframes logoReveal { 0% { opacity: 0; transform: scale(0.5) rotate(-10deg); } 50% { opacity: 1; transform: scale(1.1) rotate(5deg); } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
  @keyframes textReveal { 0% { opacity: 0; transform: translateY(30px); letter-spacing: 0.5em; } 100% { opacity: 1; transform: translateY(0); letter-spacing: 0.2em; } }
  @keyframes splashFadeOut { 0% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } }
  @keyframes particleFloat { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; } 50% { transform: translateY(-20px) rotate(180deg); opacity: 1; } }
  @keyframes cardFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes borderDance { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes pulseRing { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
  @keyframes iconBounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-5px) scale(1.05); } }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes tilt3d { 0%, 100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); } 25% { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg); } 75% { transform: perspective(1000px) rotateX(-2deg) rotateY(2deg); } }
  @keyframes magneticPull { 0%, 100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(var(--mx, 0px)) translateY(var(--my, 0px)); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
  @keyframes scrollBounce { 0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(12px); opacity: 0.5; } }
  @keyframes gridMove { 0% { transform: translate(0, 0); } 100% { transform: translate(80px, 80px); } }

  .reveal { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
  .reveal.vis { opacity:1; transform:translateY(0); }

  /* Typography helpers */
  .display { font-family:'Bricolage Grotesque', sans-serif; }
  .mono    { font-family:'JetBrains Mono', monospace; }

  /* Noise overlay for hero */
  .noise::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.03'/%3E%3C/svg%3E");
    opacity:.5; z-index:0;
  }
`;

function useGlobalStyle() {
  useEffect(() => {
    if (document.getElementById("ses-global")) return;
    const s = document.createElement("style");
    s.id = "ses-global";
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
  }, []);
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2400);
    const t4 = setTimeout(() => setPhase(4), 3200);
    const t5 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [onComplete]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Geometric shapes data
  const shapes = [
    { type: 'square', x: 15, y: 20, size: 40, delay: 0, rotation: 45 },
    { type: 'square', x: 85, y: 15, size: 30, delay: 0.1, rotation: 20 },
    { type: 'square', x: 10, y: 75, size: 25, delay: 0.2, rotation: 60 },
    { type: 'square', x: 90, y: 80, size: 35, delay: 0.15, rotation: 30 },
    { type: 'square', x: 75, y: 45, size: 20, delay: 0.25, rotation: 15 },
    { type: 'square', x: 25, y: 55, size: 28, delay: 0.3, rotation: 50 },
    { type: 'line', x: 5, y: 40, size: 80, delay: 0.1, rotation: -30 },
    { type: 'line', x: 95, y: 60, size: 60, delay: 0.2, rotation: 45 },
    { type: 'dot', x: 20, y: 35, size: 8, delay: 0.05 },
    { type: 'dot', x: 80, y: 25, size: 6, delay: 0.15 },
    { type: 'dot', x: 70, y: 70, size: 10, delay: 0.1 },
    { type: 'dot', x: 30, y: 85, size: 7, delay: 0.2 },
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: phase >= 4 ? 0 : 1,
        visibility: phase >= 4 ? "hidden" : "visible",
        transition: "opacity 0.8s ease, visibility 0.8s ease",
        overflow: "hidden",
      }}>
      
      {/* Dynamic gradient background following mouse */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${C.primary}15 0%, transparent 50%)`,
        transition: "background 0.3s ease",
      }} />
      
      {/* Grid pattern overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(${C.primary}08 1px, transparent 1px),
          linear-gradient(90deg, ${C.primary}08 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: phase >= 1 ? 0.5 : 0,
        transition: "opacity 1s ease",
      }} />
      
      {/* Animated geometric shapes */}
      {shapes.map((shape, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${shape.x}%`,
          top: `${shape.y}%`,
          opacity: phase >= 1 ? (shape.type === 'dot' ? 0.8 : 0.15) : 0,
          transform: `
            translate(-50%, -50%) 
            rotate(${shape.rotation || 0}deg)
            scale(${phase >= 1 ? 1 : 0})
          `,
          transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${shape.delay}s`,
        }}>
          {shape.type === 'square' && (
            <div style={{
              width: shape.size,
              height: shape.size,
              border: `2px solid ${C.primary}`,
              background: `${C.primary}10`,
              animation: `spin ${15 + i * 2}s linear infinite`,
            }} />
          )}
          {shape.type === 'line' && (
            <div style={{
              width: shape.size,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${C.primary}, transparent)`,
            }} />
          )}
          {shape.type === 'dot' && (
            <div style={{
              width: shape.size,
              height: shape.size,
              background: C.primary,
              borderRadius: "50%",
              boxShadow: `0 0 20px ${C.primary}`,
              animation: `particleFloat ${3 + i * 0.5}s ease-in-out infinite`,
            }} />
          )}
        </div>
      ))}
      
      {/* Orbiting rings */}
      <div style={{
        position: "absolute",
        width: 400, height: 400,
        opacity: phase >= 1 ? 0.3 : 0,
        transition: "opacity 1s ease 0.3s",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: "absolute",
            inset: i * 30,
            border: `1px solid ${i === 1 ? C.accent : C.primary}`,
            borderRadius: "50%",
            animation: `spin ${20 + i * 10}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}>
            <div style={{
              position: "absolute",
              top: 0, left: "50%",
              width: 8 - i * 2, height: 8 - i * 2,
              background: i === 1 ? C.accent : C.primary,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 15px ${i === 1 ? C.accent : C.primary}`,
            }} />
          </div>
        ))}
      </div>
      
      {/* Central content container */}
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        
        {/* Hexagon frame around logo */}
        <div style={{
          position: "relative",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1)" : "scale(0.5)",
          transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          {/* Rotating outer hexagon border */}
          <svg width="280" height="280" viewBox="0 0 280 280" style={{
            position: "absolute", top: -50, left: -50,
            animation: "spin 30s linear infinite",
            opacity: phase >= 1 ? 0.6 : 0,
            transition: "opacity 0.8s ease",
          }}>
            <polygon
              points="140,10 250,75 250,205 140,270 30,205 30,75"
              fill="none"
              stroke={C.primary}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>
          
          {/* Pulsing glow rings */}
          <div style={{
            position: "absolute", inset: -40, borderRadius: "50%",
            border: `2px solid ${C.primary}30`,
            animation: phase >= 1 ? "pulseRing 2s ease-out infinite" : "none",
          }} />
          <div style={{
            position: "absolute", inset: -60, borderRadius: "50%",
            border: `1px solid ${C.accent}20`,
            animation: phase >= 1 ? "pulseRing 2s ease-out infinite 0.5s" : "none",
          }} />
          <div style={{
            position: "absolute", inset: -80, borderRadius: "50%",
            border: `1px solid ${C.primary}15`,
            animation: phase >= 1 ? "pulseRing 2s ease-out infinite 1s" : "none",
          }} />
          
          {/* Inner glow */}
          <div style={{
            position: "absolute", inset: -30, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.primary}40 0%, ${C.primary}10 40%, transparent 70%)`,
            animation: phase >= 1 ? "glow 2s ease-in-out infinite" : "none",
          }} />
          
          {/* Logo with glitch effect on reveal */}
          <div style={{
            position: "relative",
            animation: phase === 1 ? "none" : "none",
          }}>
            <img 
              src="/ses-logo.png" 
              alt="SES Logo"
              style={{
                width: 180, height: 180,
                objectFit: "contain",
                filter: `drop-shadow(0 0 40px ${C.primary}80) drop-shadow(0 0 80px ${C.primary}40)`,
                animation: phase >= 2 ? "cardFloat 4s ease-in-out infinite" : "none",
              }}
            />
            {/* Scan line effect */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(180deg, transparent 0%, ${C.primary}10 50%, transparent 100%)`,
              backgroundSize: "100% 10px",
              animation: phase >= 1 && phase < 3 ? "scanLine 1.5s linear infinite" : "none",
              opacity: phase >= 3 ? 0 : 0.5,
              transition: "opacity 0.5s ease",
            }} />
          </div>
        </div>
        
        {/* Text content */}
        <div style={{
          marginTop: 48,
          textAlign: "center",
          position: "relative",
        }}>
          {/* Main title with split animation */}
          <div style={{
            overflow: "hidden",
            marginBottom: 8,
          }}>
            <div style={{
              display: "flex", justifyContent: "center", gap: 8,
            }}>
              {"SES MUET".split("").map((char, i) => (
                <span key={i} style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "3rem",
                  fontWeight: 900,
                  color: "#fff",
                  display: "inline-block",
                  opacity: phase >= 2 ? 1 : 0,
                  transform: phase >= 2 ? "translateY(0) rotateX(0deg)" : "translateY(100%) rotateX(-90deg)",
                  transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s`,
                  textShadow: `0 0 40px ${C.primary}, 0 0 80px ${C.primary}50`,
                }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
          
          {/* Subtitle with typing effect */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.85rem",
            color: C.accent,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.5s ease 0.5s",
            position: "relative",
          }}>
            <span style={{
              background: `linear-gradient(90deg, ${C.accent}, ${C.primary}, ${C.accent})`,
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: phase >= 2 ? "gradientShift 3s linear infinite" : "none",
            }}>
              Software Engineering Society
            </span>
            {/* Cursor blink */}
            <span style={{
              display: "inline-block",
              width: 2, height: 14,
              background: C.accent,
              marginLeft: 4,
              animation: phase >= 2 ? "blink 1s step-end infinite" : "none",
              opacity: phase >= 3 ? 0 : 1,
              transition: "opacity 0.3s ease",
            }} />
          </div>
          
          {/* Tagline */}
          <div style={{
            marginTop: 20,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.15em",
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}>
            MUET Jamshoro | Est. 2020
          </div>
        </div>
      </div>
      
      {/* Bottom loading section */}
      <div style={{
        position: "absolute",
        bottom: 50,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 16,
      }}>
        {/* Loading text */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: phase >= 1 && phase < 4 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}>
          {phase === 1 ? "Initializing..." : phase === 2 ? "Loading assets..." : phase === 3 ? "Welcome!" : ""}
        </div>
        
        {/* Progress bar with glow */}
        <div style={{
          width: 240, height: 4,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(90deg, transparent, ${C.primary}30, transparent)`,
            animation: "gradientShift 2s linear infinite",
          }} />
          <div style={{
            height: "100%",
            background: `linear-gradient(90deg, ${C.primary}, ${C.accent}, ${C.primary})`,
            backgroundSize: "200% 100%",
            width: phase === 0 ? "0%" : phase === 1 ? "30%" : phase === 2 ? "60%" : phase === 3 ? "90%" : "100%",
            transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            borderRadius: 10,
            boxShadow: `0 0 20px ${C.primary}, 0 0 40px ${C.primary}50`,
            animation: "gradientShift 2s linear infinite",
          }} />
        </div>
        
        {/* Progress percentage */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.75rem",
          color: C.primary,
          opacity: phase >= 1 && phase < 4 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}>
          {phase === 0 ? "0%" : phase === 1 ? "30%" : phase === 2 ? "60%" : phase === 3 ? "90%" : "100%"}
        </div>
      </div>
      
      {/* Corner decorations */}
      {[
        { top: 20, left: 20, rotate: 0 },
        { top: 20, right: 20, rotate: 90 },
        { bottom: 20, right: 20, rotate: 180 },
        { bottom: 20, left: 20, rotate: 270 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          ...pos,
          width: 40, height: 40,
          opacity: phase >= 1 ? 0.4 : 0,
          transform: `rotate(${pos.rotate}deg) scale(${phase >= 1 ? 1 : 0})`,
          transition: `all 0.6s ease ${i * 0.1}s`,
        }}>
          <div style={{
            width: "100%", height: 2,
            background: `linear-gradient(90deg, ${C.primary}, transparent)`,
          }} />
          <div style={{
            width: 2, height: "100%",
            background: `linear-gradient(180deg, ${C.primary}, transparent)`,
          }} />
        </div>
      ))}
    </div>
  );
}

// ─── INTERSECTION OBSERVER HOOK ───────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Badge({ children, color = C.primary, bg }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:6,
      fontFamily:"'JetBrains Mono', monospace", fontSize:"0.68rem",
      fontWeight:500, letterSpacing:"0.14em", textTransform:"uppercase",
      color: color,
      background: bg || `${color}14`,
      border:`1px solid ${color}30`,
      padding:"4px 12px", borderRadius:100,
    }}>{children}</span>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
      <div style={{ width:24, height:2, background:C.primary, borderRadius:2 }} />
      <span style={{
        fontFamily:"'JetBrains Mono', monospace", fontSize:"0.68rem",
        fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color:C.primary,
      }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children, style = {} }) {
  return (
    <h2 className="display" style={{
      fontSize:"clamp(1.9rem, 3.2vw, 3rem)", fontWeight:800,
      lineHeight:1.1, letterSpacing:"-0.03em", color:C.darkPrimary, ...style,
    }}>{children}</h2>
  );
}

function Hl({ children }) {
  return <span style={{ color:C.primary }}>{children}</span>;
}

function Btn({ children, variant = "primary", onClick, href, style = {}, small }) {
  const base = {
    display:"inline-flex", alignItems:"center", gap:8,
    fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:700,
    fontSize: small ? "0.8rem" : "0.9rem",
    padding: small ? "0.55rem 1.2rem" : "0.75rem 1.8rem",
    borderRadius:10, border:"none", cursor:"pointer",
    textDecoration:"none", transition:"all .25s", letterSpacing:"0.01em",
    position:"relative", overflow:"hidden",
  };
  const variants = {
    primary: { background:C.primary, color:"#fff", boxShadow:`0 4px 20px ${C.primary}30` },
    dark:    { background:C.darkPrimary, color:"#fff", boxShadow:`0 4px 20px ${C.darkPrimary}30` },
    accent:  { background:accentGrad, color:"#fff", boxShadow:`0 4px 20px ${C.accent}40` },
    outline: { background:"transparent", color:C.primary, border:`1.5px solid ${C.primary}`, boxShadow:"none" },
    ghost:   { background:"transparent", color:C.textMid, border:`1.5px solid ${C.border}`, boxShadow:"none" },
    white:   { background:C.surface, color:C.darkPrimary, boxShadow:"0 4px 20px rgba(0,0,0,.12)" },
  };
  const [hov, setHov] = useState(false);
  const hovStyle = hov ? {
    transform:"translateY(-2px)",
    boxShadow: variant==="outline" ? `0 0 0 3px ${C.primary}20` : `0 10px 32px ${C.primary}40`,
    filter: variant==="primary"||variant==="dark"||variant==="accent" ? "brightness(1.08)" : "none",
  } : {};
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick}
      style={{ ...base, ...variants[variant], ...hovStyle, ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </Tag>
  );
}

function Card({ children, style = {}, hover = true }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:C.surface, borderRadius:16,
        border:`1px solid ${hov ? C.primary+"50" : C.border}`,
        boxShadow: hov ? `0 20px 50px rgba(30,136,229,.12)` : "0 2px 12px rgba(0,0,0,.06)",
        transition:"all .3s ease",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        ...style,
      }}>{children}</div>
  );
}

function Tag({ children, color = C.primary }) {
  return (
    <span style={{
      fontFamily:"'JetBrains Mono', monospace", fontSize:"0.62rem",
      fontWeight:500, textTransform:"uppercase", letterSpacing:"0.1em",
      padding:"3px 10px", borderRadius:6,
      background:`${color}14`, color, border:`1px solid ${color}25`,
    }}>{children}</span>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { id:"home", label:"Home" },
    { id:"events", label:"Events" },
    { id:"programs", label:"Programs" },
    { id:"team", label:"Team" },
    { id:"contact", label:"Contact" },
  ];

  const go = (p) => { setPage(p); setMobileOpen(false); window.scrollTo({ top:0, behavior:"smooth" }); };

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:999,
        height:68, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 4rem",
        background: scrolled ? "rgba(255,255,255,.97)" : "rgba(255,255,255,.92)",
        backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${scrolled ? C.border : "transparent"}`,
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.07)" : "none",
        transition:"all .35s ease",
      }}>
        {/* Logo */}
        <div onClick={() => go("home")} style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
          <img 
            src="/ses-logo.png" 
            alt="SES Logo"
            style={{
              width: 44, height: 44,
              objectFit: "contain",
              filter: "drop-shadow(0 2px 8px rgba(30,136,229,0.3))",
            }}
          />
          <div style={{ lineHeight:1.15 }}>
            <div className="display" style={{ fontSize:"1.0rem", fontWeight:800, color:C.darkPrimary, letterSpacing:"-0.02em" }}>SES MUET</div>
            <div className="mono" style={{ fontSize:"0.58rem", color:C.textLight, letterSpacing:"0.14em", textTransform:"uppercase" }}>Software Eng. Society</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {links.map(l => {
            const active = page === l.id;
            return (
              <button key={l.id} onClick={() => go(l.id)} style={{
                background:"none", border:"none", cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:500, fontSize:"0.88rem",
                color: active ? C.primary : C.textMid,
                padding:"0.5rem 1rem", borderRadius:8, transition:"all .2s",
                position:"relative",
              }}>
                {l.label}
                {active && <div style={{ position:"absolute", bottom:4, left:"50%", transform:"translateX(-50%)", width:16, height:2, background:C.primary, borderRadius:2 }} />}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <Btn variant="primary" onClick={() => go("contact")} small>
          Join SES
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Btn>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(o => !o)} style={{
          display:"none", background:"none", border:`1px solid ${C.border}`,
          borderRadius:8, padding:"6px 8px", cursor:"pointer", color:C.textMid,
          flexDirection:"column", gap:4,
        }} className="hamburger">
          {[0,1,2].map(i => <div key={i} style={{ width:18, height:2, background:C.textMid, borderRadius:2 }} />)}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position:"fixed", top:68, left:0, right:0, zIndex:998,
          background:C.surface, borderBottom:`1px solid ${C.border}`,
          padding:"1.5rem 2rem", display:"flex", flexDirection:"column", gap:4,
          animation:"slideDown .25s ease",
          boxShadow:"0 8px 24px rgba(0,0,0,.08)",
        }}>
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} style={{
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:500, fontSize:"1rem",
              color: page === l.id ? C.primary : C.textDark,
              padding:"0.75rem 1rem", borderRadius:8, textAlign:"left",
              background: page === l.id ? `${C.primary}0a` : "none",
            }}>{l.label}</button>
          ))}
          <Btn variant="primary" onClick={() => go("contact")} style={{ marginTop:8 }}>Join SES →</Btn>
        </div>
      )}

      <style>{`
        @media (max-width:860px) {
          nav > div:nth-child(2), nav > div:nth-child(3) { display:none !important; }
          .hamburger { display:flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  const go = (p) => { setPage(p); window.scrollTo({ top:0, behavior:"smooth" }); };
  return (
    <footer style={{ background:C.darkPrimary, color:"#fff", position:"relative", overflow:"hidden" }}>
      {/* Top decorative line */}
      <div style={{ height:3, background:accentGrad }} />

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"4rem 4rem 2rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"3rem", marginBottom:"3rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"1rem" }}>
              <img 
                src="/ses-logo.png" 
                alt="SES Logo"
                style={{
                  width: 46, height: 46,
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 10px rgba(0,194,255,0.3))",
                }}
              />
              <div>
                <div className="display" style={{ fontSize:"1rem", fontWeight:800, letterSpacing:"-0.02em" }}>SES MUET</div>
                <div className="mono" style={{ fontSize:"0.58rem", color:`${C.accent}cc`, letterSpacing:"0.12em", textTransform:"uppercase" }}>Software Eng. Society</div>
              </div>
            </div>
            <p style={{ fontSize:"0.88rem", color:"rgba(255,255,255,.6)", lineHeight:1.8, maxWidth:280, marginBottom:"1.5rem" }}>
              Empowering software engineering students at Mehran University of Engineering & Technology, Jamshoro — since 2019.
            </p>
            <div style={{ display:"flex", gap:8 }}>
              {["ig","in","gh","wa"].map(s => (
                <div key={s} style={{
                  width:34, height:34, borderRadius:8, border:`1px solid rgba(255,255,255,.15)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", color:"rgba(255,255,255,.6)",
                  fontFamily:"'JetBrains Mono', monospace", fontSize:"0.72rem",
                  transition:"all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accent; e.currentTarget.style.background=`${C.accent}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,.15)"; e.currentTarget.style.color="rgba(255,255,255,.6)"; e.currentTarget.style.background="none"; }}
                >{s}</div>
              ))}
            </div>
          </div>

          {[
            { title:"Navigate", items:[["Home","home"],["Events","events"],["Programs","programs"],["Team","team"],["Contact","contact"]] },
            { title:"Programs",  items:[["Workshops","programs"],["Mentorship","programs"],["Hackathons","events"],["Career Help","programs"]] },
            { title:"Connect",   items:[["Instagram",""],["LinkedIn",""],["GitHub",""],["WhatsApp",""],["Contact Us","contact"]] },
          ].map(col => (
            <div key={col.title}>
              <div className="mono" style={{ fontSize:"0.65rem", letterSpacing:"0.18em", textTransform:"uppercase", color:`${C.accent}90`, marginBottom:"1.2rem" }}>{col.title}</div>
              {col.items.map(([label, pg]) => (
                <div key={label} onClick={() => pg && go(pg)} style={{
                  fontSize:"0.88rem", color:"rgba(255,255,255,.6)", marginBottom:"0.6rem",
                  cursor: pg ? "pointer" : "default", transition:"color .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color="#fff"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,.6)"}
                >{label}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <span className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,255,255,.35)" }}>© 2025 SES MUET — Software Engineering Society, MUET Jamshoro</span>
          <span className="mono" style={{ fontSize:"0.65rem", color:"rgba(255,255,255,.35)" }}>Made with ❤ by SES Dev Team</span>
        </div>
      </div>
    </footer>
  );
}

// ─── MARQUEE STRIP ────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["Software Engineering","Web Development","Hackathons","Open Source","Machine Learning","MUET Jamshoro","Community","Industry Talks","Code Competitions","Workshops"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, background:C.surface, padding:"0.85rem 0" }}>
      <div style={{ display:"flex", animation:"marquee 28s linear infinite", width:"max-content" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState="paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState="running"}>
        {doubled.map((t, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"0 2.5rem", whiteSpace:"nowrap" }}>
            <div className="mono" style={{ fontSize:"0.7rem", color:C.textLight, letterSpacing:"0.1em", textTransform:"uppercase" }}>{t}</div>
            <div style={{ width:4, height:4, borderRadius:"50%", background:C.primary, flexShrink:0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ══════════════════════════════════════════════════════════════════════════════
function EventSlider({ setPage }) {
  const events = [
    { icon:"⚡", bg:`linear-gradient(135deg,#EBF4FF,#DBEAFE)`, iconColor:C.primary, date:"June 14–15, 2025", tag:"Upcoming", tagColor:C.success, title:"Annual Hackathon 2025", desc:"48 hours of non-stop building. Compete, create, and win with the best minds at MUET.", slots:"120+ slots" },
    { icon:"🎤", bg:`linear-gradient(135deg,#E0F2FE,#BAE6FD)`, iconColor:C.accent, date:"May 28, 2025", tag:"Workshop", tagColor:C.primary, title:"DevTalks: AI in Industry", desc:"Industry engineers reveal how AI is reshaping real development workflows in 2025.", slots:"80 seats" },
    { icon:"🏆", bg:`linear-gradient(135deg,#EDE9FE,#DDD6FE)`, iconColor:"#7C3AED", date:"May 20, 2025", tag:"Competition", tagColor:"#7C3AED", title:"CodeStorm v3.0", desc:"Competitive programming — DSA, algorithms, and creative problem-solving battles.", slots:"200 slots" },
    { icon:"🚀", bg:`linear-gradient(135deg,#D1FAE5,#A7F3D0)`, iconColor:C.success, date:"July 5, 2025", tag:"New", tagColor:C.success, title:"Open Source Sprint", desc:"Contribute to real projects. Master Git, PRs, and collaborative engineering.", slots:"50 slots" },
    { icon:"📱", bg:`linear-gradient(135deg,#FEF3C7,#FDE68A)`, iconColor:C.warning, date:"July 18, 2025", tag:"Workshop", tagColor:C.warning, title:"Flutter Dev Bootcamp", desc:"Two-day intensive: build and ship a real mobile app using Flutter from scratch.", slots:"40 seats" },
  ];

  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const visible = 3;
  const maxIdx = events.length - visible;

  const go = useCallback((i) => {
    setIdx(Math.max(0, Math.min(i, maxIdx)));
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(p => p >= maxIdx ? 0 : p + 1), 4500);
  }, [maxIdx]);

  useEffect(() => {
    timerRef.current = setInterval(() => setIdx(p => p >= maxIdx ? 0 : p + 1), 4500);
    return () => clearInterval(timerRef.current);
  }, [maxIdx]);

  const trackRef = useRef(null);
  const [slideW, setSlideW] = useState(0);
  useEffect(() => {
    const calc = () => {
      if (trackRef.current) {
        const w = trackRef.current.clientWidth;
        setSlideW((w - 2 * 20) / visible);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <section style={{ background:C.surface, padding:"6rem 4rem", position:"relative", overflow:"hidden" }}>
      {/* soft bg dot grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${C.border} 1px, transparent 1px)`, backgroundSize:"32px 32px", opacity:.5 }} />
      <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2.5rem", flexWrap:"wrap", gap:16 }}>
          <div>
            <Eyebrow>Upcoming Events</Eyebrow>
            <SectionTitle>Don't Miss <Hl>What's Next</Hl></SectionTitle>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <Btn variant="ghost" small onClick={() => setPage("events")}>View All Events →</Btn>
            <div style={{ display:"flex", gap:8 }}>
              {[{ icon:"←", dir:-1 },{ icon:"→", dir:1 }].map(({ icon, dir }) => (
                <button key={dir} onClick={() => go(idx + dir)} style={{
                  width:42, height:42, borderRadius:"50%",
                  background:"none", border:`1.5px solid ${C.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", fontSize:"1rem", color:C.textMid,
                  transition:"all .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primary; e.currentTarget.style.background=`${C.primary}0a`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMid; e.currentTarget.style.background="none"; }}
                >{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Slider */}
        <div style={{ overflow:"hidden" }} ref={trackRef}>
          <div style={{ display:"flex", gap:20, transition:"transform .55s cubic-bezier(.4,0,.2,1)", transform:`translateX(-${idx * (slideW + 20)}px)` }}>
            {events.map((ev, i) => (
              <div key={i} style={{ minWidth:slideW || 360, flexShrink:0 }}>
                <Card style={{ overflow:"hidden" }}>
                  <div style={{ height:180, background:ev.bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                    <div style={{ fontSize:"3.5rem", filter:`drop-shadow(0 4px 16px ${ev.iconColor}60)`, animation:"float 4s ease infinite", animationDelay:`${i*0.4}s` }}>{ev.icon}</div>
                    <div style={{ position:"absolute", top:14, right:14 }}>
                      <Tag color={ev.tagColor}>{ev.tag}</Tag>
                    </div>
                  </div>
                  <div style={{ padding:"1.4rem 1.5rem" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span className="mono" style={{ fontSize:"0.63rem", color:C.textLight, textTransform:"uppercase", letterSpacing:"0.1em" }}>{ev.date}</span>
                    </div>
                    <h3 className="display" style={{ fontSize:"1.05rem", fontWeight:700, color:C.darkPrimary, marginBottom:6, letterSpacing:"-0.01em" }}>{ev.title}</h3>
                    <p style={{ fontSize:"0.82rem", color:C.textLight, lineHeight:1.65 }}>{ev.desc}</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"1.1rem", paddingTop:"1.1rem", borderTop:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:"0.75rem", color:C.textLight }}>👥 {ev.slots}</span>
                      <Btn variant="outline" small onClick={() => setPage("events")}>Learn More →</Btn>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:"1.8rem" }}>
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => go(i)} style={{
              width: i === idx ? 24 : 7, height:7, borderRadius:10,
              background: i === idx ? C.primary : C.borderMid,
              border:"none", cursor:"pointer", transition:"all .3s",
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ target, label, color = C.primary, prefix = "", suffix = "+" }) {
  const [ref, vis] = useReveal(0.5);
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!vis || ran.current) return;
    ran.current = true;
    let start = null;
    const dur = 1800;
    const tick = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.floor(ease * target));
      if (prog < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [vis, target]);

  return (
    <div ref={ref} style={{ textAlign:"center" }}>
      <div className="display" style={{ fontSize:"clamp(2.2rem,4vw,3.2rem)", fontWeight:900, color, lineHeight:1, letterSpacing:"-0.04em" }}>
        {prefix}{val}{suffix}
      </div>
      <div style={{ fontSize:"0.82rem", color:C.textLight, marginTop:4, fontWeight:500 }}>{label}</div>
    </div>
  );
}

function HomePage({ setPage }) {
  const [heroRef, heroVis] = useReveal(0.05);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 20,
      y: (e.clientY - rect.top - rect.height / 2) / 20,
    });
  };

  return (
    <>
      {/* HERO */}
      <section 
        ref={heroRef} 
        className="noise" 
        onMouseMove={handleMouseMove}
        style={{
          minHeight:"100vh", display:"flex", alignItems:"center",
          padding:"6rem 4rem 4rem",
          background: bgHeroGrad,
          position:"relative", overflow:"hidden",
        }}>
        
        {/* Animated gradient orbs */}
        <div style={{ 
          position:"absolute", width:800, height:800, borderRadius:"50%", 
          background:`radial-gradient(circle, ${C.primary}20, ${C.primary}08, transparent)`, 
          top:-300, right:-200, pointerEvents:"none",
          animation: "float 20s ease-in-out infinite",
          filter: "blur(60px)",
        }} />
        <div style={{ 
          position:"absolute", width:500, height:500, borderRadius:"50%", 
          background:`radial-gradient(circle, ${C.accent}18, transparent)`, 
          bottom:-100, left:"5%", pointerEvents:"none",
          animation: "float 15s ease-in-out infinite reverse",
          filter: "blur(40px)",
        }} />
        <div style={{ 
          position:"absolute", width:300, height:300, borderRadius:"50%", 
          background:`radial-gradient(circle, #7C3AED15, transparent)`, 
          top:"40%", left:"60%", pointerEvents:"none",
          animation: "float 12s ease-in-out infinite 2s",
          filter: "blur(30px)",
        }} />
        
        {/* Interactive gradient following mouse */}
        <div style={{
          position:"absolute", width:600, height:600, borderRadius:"50%",
          background:`radial-gradient(circle, ${C.primary}12, transparent 70%)`,
          left: `calc(50% + ${mousePos.x * 3}px)`,
          top: `calc(50% + ${mousePos.y * 3}px)`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.3s ease, top 0.3s ease",
          pointerEvents:"none",
        }} />
        
        {/* Animated grid pattern */}
        <div style={{ 
          position:"absolute", inset:0, 
          backgroundImage:`
            linear-gradient(${C.primary}06 1px, transparent 1px), 
            linear-gradient(90deg, ${C.primary}06 1px, transparent 1px)
          `, 
          backgroundSize:"80px 80px",
          animation: heroVis ? "gridMove 20s linear infinite" : "none",
          pointerEvents:"none",
        }} />
        
        {/* Floating geometric shapes */}
        {heroVis && (
          <>
            {[
              { top: "15%", left: "8%", size: 60, delay: 0, rotation: 45 },
              { top: "70%", left: "12%", size: 40, delay: 0.5, rotation: 20 },
              { top: "25%", right: "15%", size: 50, delay: 1, rotation: 60 },
              { top: "80%", right: "8%", size: 35, delay: 1.5, rotation: 30 },
            ].map((shape, i) => (
              <div key={i} style={{
                position: "absolute",
                top: shape.top,
                left: shape.left,
                right: shape.right,
                width: shape.size,
                height: shape.size,
                border: `2px solid ${i % 2 === 0 ? C.primary : C.accent}20`,
                borderRadius: i % 3 === 0 ? "50%" : 8,
                transform: `rotate(${shape.rotation}deg)`,
                animation: `float ${8 + i * 2}s ease-in-out infinite, spin ${30 + i * 5}s linear infinite`,
                animationDelay: `${shape.delay}s`,
                pointerEvents: "none",
              }} />
            ))}
            
            {/* Floating dots */}
            {[...Array(8)].map((_, i) => (
              <div key={`dot-${i}`} style={{
                position: "absolute",
                width: 6 + (i % 3) * 2,
                height: 6 + (i % 3) * 2,
                background: i % 2 === 0 ? C.primary : C.accent,
                borderRadius: "50%",
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 4) * 20}%`,
                opacity: 0.3,
                animation: `particleFloat ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                pointerEvents: "none",
              }} />
            ))}
          </>
        )}

        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center", position:"relative", zIndex:1 }}>
          {/* Left content */}
          <div>
            <div style={{ animation: heroVis ? "fadeUp .7s both" : "none" }}>
              <Badge color={C.success}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:C.success, animation:"pulse 2s ease infinite", flexShrink:0, display:"inline-block", boxShadow:`0 0 10px ${C.success}` }} />
                MUET Jamshoro - Est. 2019
              </Badge>
            </div>
            
            {/* Animated title with letter reveal */}
            <h1 className="display" style={{
              fontSize:"clamp(3rem, 5.5vw, 5.5rem)", fontWeight:900,
              lineHeight:1.0, letterSpacing:"-0.045em",
              color:C.darkPrimary, margin:"1.2rem 0",
            }}>
              {["We Build", "Software", "Engineers."].map((line, lineIdx) => (
                <span key={lineIdx} style={{ 
                  display:"block", 
                  color: lineIdx === 1 ? C.primary : lineIdx === 2 ? C.accent : C.darkPrimary,
                  overflow: "hidden",
                }}>
                  {line.split("").map((char, charIdx) => (
                    <span key={charIdx} style={{
                      display: "inline-block",
                      opacity: heroVis ? 1 : 0,
                      transform: heroVis ? "translateY(0) rotateX(0)" : "translateY(100%) rotateX(-90deg)",
                      transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.08 + lineIdx * 0.15 + charIdx * 0.03}s`,
                    }}>
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            
            <p style={{
              color:C.textMid, fontSize:"1.08rem", fontWeight:400, lineHeight:1.85,
              maxWidth:460, marginBottom:"2rem",
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.6s ease 0.5s",
            }}>
              The official Software Engineering Society of Mehran University — where students transform into industry-ready engineers through community, code, and collaboration.
            </p>
            
            <div style={{ 
              display:"flex", gap:12, flexWrap:"wrap",
              opacity: heroVis ? 1 : 0,
              transform: heroVis ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.6s ease 0.6s",
            }}>
              <Btn variant="primary" onClick={() => setPage("contact")}>
                Join SES Today
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Btn>
              <Btn variant="ghost" onClick={() => setPage("events")}>Explore Events</Btn>
            </div>
            
            {/* Tech stack pills */}
            <div style={{
              display: "flex", gap: 8, flexWrap: "wrap", marginTop: "2rem",
              opacity: heroVis ? 1 : 0,
              transition: "opacity 0.6s ease 0.8s",
            }}>
              {["React", "Node.js", "Python", "AWS", "Docker"].map((tech, i) => (
                <span key={tech} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${C.primary}10`,
                  border: `1px solid ${C.primary}20`,
                  color: C.primary,
                  opacity: heroVis ? 1 : 0,
                  transform: heroVis ? "translateY(0)" : "translateY(10px)",
                  transition: `all 0.4s ease ${0.9 + i * 0.1}s`,
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right - Interactive 3D hero cards */}
          <div style={{ 
            position:"relative", height:520,
            opacity: heroVis ? 1 : 0,
            transform: heroVis ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s ease 0.3s",
          }}>
            {/* Main code card with 3D tilt */}
            <div 
              onMouseEnter={() => setActiveCard('main')}
              onMouseLeave={() => setActiveCard(null)}
              style={{
                position:"absolute", right:0, top:30, width:360,
                background: C.surface, borderRadius:20,
                border:`1px solid ${activeCard === 'main' ? C.primary : C.border}`,
                boxShadow: activeCard === 'main' 
                  ? `0 30px 60px ${C.primary}25, 0 0 0 1px ${C.primary}20`
                  : "0 20px 60px rgba(30,136,229,.14)",
                padding:"1.8rem",
                transform: activeCard === 'main'
                  ? `perspective(1000px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg) scale(1.02)`
                  : "perspective(1000px) rotateY(0deg) rotateX(0deg)",
                transition: "all 0.4s ease",
                cursor: "default",
              }}>
              {/* Gradient border animation */}
              <div style={{
                position: "absolute", inset: -1, borderRadius: 21, padding: 1,
                background: activeCard === 'main' 
                  ? `linear-gradient(45deg, ${C.primary}, ${C.accent}, ${C.primary})`
                  : "transparent",
                backgroundSize: "200% 200%",
                animation: activeCard === 'main' ? "gradientShift 3s linear infinite" : "none",
                opacity: activeCard === 'main' ? 1 : 0,
                transition: "opacity 0.3s ease",
                zIndex: -1,
              }} />
              
              {/* Top bar with dots */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                <span className="mono" style={{ fontSize:"0.6rem", color:C.textLight, marginLeft: "auto" }}>society.js</span>
              </div>
              
              {/* Code content with typing effect */}
              {[
                { tokens: [{ t: "const", c: "#7C3AED" }, { t: " ses", c: C.primary }, { t: " = ", c: C.textMid }, { t: "{", c: C.textDark }] },
                { tokens: [{ t: "  name", c: C.textDark }, { t: ":", c: C.textMid }, { t: ' "SES MUET"', c: C.success }], delay: 0.1 },
                { tokens: [{ t: "  university", c: C.textDark }, { t: ":", c: C.textMid }, { t: ' "MUET Jamshoro"', c: C.success }], delay: 0.2 },
                { tokens: [{ t: "  members", c: C.textDark }, { t: ":", c: C.textMid }, { t: " 500", c: C.warning }, { t: "+", c: C.accent }], delay: 0.3 },
                { tokens: [{ t: "  mission", c: C.textDark }, { t: ":", c: C.textMid }, { t: ' "Empower SE"', c: C.success }], delay: 0.4 },
                { tokens: [{ t: "}", c: C.textDark }], delay: 0.5 },
                { tokens: [{ t: "", c: C.textDark }], delay: 0.55 },
                { tokens: [{ t: "ses", c: C.primary }, { t: ".", c: C.textMid }, { t: "init", c: "#7C3AED" }, { t: "()", c: C.textMid }, { t: " // Running...", c: C.success }], delay: 0.6 },
              ].map((line, i) => (
                <div key={i} className="mono" style={{ 
                  fontSize:"0.82rem", lineHeight: 2.2,
                  opacity: heroVis ? 1 : 0,
                  transform: heroVis ? "translateX(0)" : "translateX(-20px)",
                  transition: `all 0.5s ease ${(line.delay || 0) + 0.5}s`,
                }}>
                  {line.tokens.map((token, j) => (
                    <span key={j} style={{ color: token.c }}>{token.t}</span>
                  ))}
                </div>
              ))}
              
              {/* Cursor blink */}
              <span style={{
                display: "inline-block",
                width: 8, height: 16,
                background: C.primary,
                animation: "blink 1s step-end infinite",
                marginLeft: 4,
                verticalAlign: "middle",
              }} />
            </div>
            
            {/* Members floating card */}
            <div 
              onMouseEnter={() => setActiveCard('members')}
              onMouseLeave={() => setActiveCard(null)}
              style={{
                position:"absolute", left:0, bottom:80, width:200,
                background: C.surface, borderRadius:16,
                border:`1px solid ${activeCard === 'members' ? C.accent : C.border}`,
                boxShadow: activeCard === 'members'
                  ? `0 20px 40px ${C.accent}20`
                  : "0 10px 30px rgba(0,0,0,.08)",
                padding:"1.3rem 1.5rem",
                transform: activeCard === 'members' ? "translateY(-8px) scale(1.02)" : "translateY(0)",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation:"float 8s ease infinite 1s",
              }}>
              <div className="mono" style={{ fontSize:"0.62rem", color:C.textLight, marginBottom:8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: "pulse 2s ease infinite" }} />
                Active Members
              </div>
              <div className="display" style={{ 
                fontSize:"2.2rem", fontWeight:900, 
                background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight:1 
              }}>500+</div>
              <div style={{ height:6, borderRadius:3, background:C.bg, marginTop:10, overflow:"hidden", position: "relative" }}>
                <div style={{ 
                  position: "absolute", inset: 0,
                  background: `linear-gradient(90deg, transparent, ${C.primary}30, transparent)`,
                  animation: "gradientShift 2s linear infinite",
                }} />
                <div style={{ 
                  height:"100%", width: heroVis ? "82%" : "0%", 
                  borderRadius:3, 
                  background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
                  transition: "width 1.5s ease 1s",
                  boxShadow: `0 0 10px ${C.primary}50`,
                }} />
              </div>
              <div style={{ display: "flex", marginTop: 10, gap: -8 }}>
                {["AK", "SR", "HM", "ZA"].map((init, i) => (
                  <div key={i} style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${[C.primary, C.accent, "#7C3AED", C.success][i]}40, ${[C.primary, C.accent, "#7C3AED", C.success][i]}20)`,
                    border: `2px solid ${C.surface}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.5rem", fontWeight: 700, color: [C.primary, C.accent, "#7C3AED", C.success][i],
                    marginLeft: i > 0 ? -8 : 0,
                  }}>{init}</div>
                ))}
                <span style={{ fontSize: "0.6rem", color: C.textLight, marginLeft: 8, alignSelf: "center" }}>+496</span>
              </div>
            </div>
            
            {/* Next event floating card */}
            <div 
              onMouseEnter={() => setActiveCard('event')}
              onMouseLeave={() => setActiveCard(null)}
              style={{
                position:"absolute", left:30, top:0, width:220,
                background: C.surface, borderRadius:16,
                border:`1px solid ${activeCard === 'event' ? C.success : C.border}`,
                boxShadow: activeCard === 'event'
                  ? `0 20px 40px ${C.success}15`
                  : "0 10px 30px rgba(0,0,0,.08)",
                padding:"1.2rem 1.4rem",
                transform: activeCard === 'event' ? "translateY(-8px) scale(1.02)" : "translateY(0)",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation:"float 7s ease infinite 0.5s",
                overflow: "hidden",
              }}>
              {/* Animated gradient top bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${C.success}, ${C.accent}, ${C.success})`,
                backgroundSize: "200% 100%",
                animation: "gradientShift 3s linear infinite",
              }} />
              
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom: 10 }}>
                <div style={{ 
                  width:10, height:10, borderRadius:"50%", 
                  background:C.success, 
                  animation:"pulse 1.6s ease infinite",
                  boxShadow: `0 0 10px ${C.success}`,
                }} />
                <span className="mono" style={{ fontSize:"0.6rem", color:C.textLight, textTransform:"uppercase", letterSpacing:"0.12em" }}>Next Event</span>
              </div>
              <div style={{ fontSize:"1rem", fontWeight:700, color:C.darkPrimary, marginBottom: 4 }}>Hackathon 2025</div>
              <div style={{ fontSize:"0.75rem", color:C.textLight, marginBottom: 10 }}>June 14 - MUET Campus</div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 10px", borderRadius: 8,
                background: `${C.success}15`,
                width: "fit-content",
              }}>
                <span style={{ fontSize: "0.9rem" }}>120+</span>
                <span style={{ fontSize: "0.65rem", color: C.textLight }}>spots left</span>
              </div>
            </div>
            
            {/* Achievement badge */}
            <div style={{
              position: "absolute", right: 40, bottom: 20, width: 140,
              background: `linear-gradient(135deg, #7C3AED20, #7C3AED10)`,
              border: `1px solid #7C3AED30`,
              borderRadius: 12,
              padding: "1rem",
              animation: "float 9s ease infinite 2s",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>15+</div>
              <div style={{ fontSize: "0.7rem", color: C.textLight }}>Projects Shipped</div>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div style={{ 
          position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", 
          display:"flex", flexDirection:"column", alignItems:"center", gap:8,
          opacity: heroVis ? 1 : 0,
          transition: "opacity 1s ease 1.5s",
        }}>
          <div className="mono" style={{ fontSize:"0.62rem", color:C.textLight, letterSpacing:"0.15em", textTransform:"uppercase" }}>Scroll to explore</div>
          <div style={{ 
            width: 24, height: 40, borderRadius: 12, 
            border: `2px solid ${C.primary}40`,
            display: "flex", justifyContent: "center", paddingTop: 8,
          }}>
            <div style={{
              width: 4, height: 8, borderRadius: 2,
              background: C.primary,
              animation: "scrollBounce 2s ease infinite",
            }} />
          </div>
        </div>
      </section>

      {/* STATS BAR - Enhanced */}
      <section style={{ 
        background: primaryGrad, 
        padding:"4rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Animated background pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, ${C.accent}20 0%, transparent 50%), 
                           radial-gradient(circle at 80% 50%, ${C.accent}15 0%, transparent 50%)`,
          animation: "gradientShift 10s ease infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s linear infinite",
        }} />
        
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"2rem", textAlign:"center", position: "relative" }}>
          {[
            { num:500, label:"Active Members", color:"#fff", icon: "users" },
            { num:40,  label:"Events Hosted",  color:C.accent, icon: "calendar" },
            { num:15,  label:"Projects Built",  color:"#A5F3FC", icon: "code" },
            { num:6,   label:"Years Running",   color:"#BAE6FD", icon: "clock" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{
                padding: "1.5rem",
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.4s ease",
                cursor: "default",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <StatCounter target={s.num} label={s.label} color={s.color} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee />

      {/* ── EVENTS SLIDER ── */}
      <EventSlider setPage={setPage} />

      {/* ABOUT - Enhanced */}
      <section style={{ background:C.bg, padding:"7rem 4rem", position: "relative", overflow: "hidden" }}>
        {/* Background decorations */}
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.primary}08, transparent)`,
          top: -200, right: -200, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.accent}06, transparent)`,
          bottom: -100, left: -100, pointerEvents: "none",
        }} />
        
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"center", position: "relative" }}>
          <div>
            <Reveal><Eyebrow>Who We Are</Eyebrow></Reveal>
            <Reveal delay={0.1}><SectionTitle style={{ marginBottom:"1rem" }}>More Than a Society — A <Hl>Movement</Hl></SectionTitle></Reveal>
            <Reveal delay={0.15}>
              <p style={{ color:C.textMid, fontSize:"1.02rem", lineHeight:1.85, marginBottom:"2rem" }}>
                Founded at MUET Jamshoro, SES bridges the gap between academic theory and real-world software engineering. We are a driven community that learns, builds, and grows together.
              </p>
            </Reveal>
            {[
              { icon:"rocket", title:"Mission-Driven", desc:"Every initiative serves one goal — making MUET students industry-ready.", color: C.primary },
              { icon:"users", title:"Alumni Network", desc:"Connect with graduates at top local and global tech companies.", color: C.accent },
              { icon:"zap", title:"Hands-On Learning", desc:"Workshops, hackathons, and real projects — learning by building.", color: "#7C3AED" },
            ].map((f, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1}>
                <div 
                  className="reveal" 
                  style={{ 
                    display:"flex", gap:"1rem", alignItems:"flex-start", 
                    padding:"1.2rem", borderRadius:16, marginBottom:12, 
                    cursor:"default", transition:"all .35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.transform = "translateX(10px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 15px 40px ${f.color}15`;
                    e.currentTarget.style.borderColor = f.color + "40";
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.transform = "translateX(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  {/* Animated gradient bar */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
                    background: `linear-gradient(180deg, ${f.color}, ${f.color}50)`,
                    borderRadius: "16px 0 0 16px",
                  }} />
                  <div style={{ 
                    width:48, height:48, borderRadius:12, 
                    background:`linear-gradient(135deg, ${f.color}20, ${f.color}10)`,
                    border: `1px solid ${f.color}30`,
                    display:"flex", alignItems:"center", justifyContent:"center", 
                    fontSize:"1.3rem", flexShrink:0,
                    marginLeft: 8,
                  }}>
                    {f.icon === "rocket" && <span>🎯</span>}
                    {f.icon === "users" && <span>🤝</span>}
                    {f.icon === "zap" && <span>⚡</span>}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"0.98rem", color:C.darkPrimary, marginBottom:4 }}>{f.title}</div>
                    <div style={{ fontSize:"0.84rem", color:C.textLight, lineHeight:1.65 }}>{f.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.5}>
              <div style={{ marginTop:"1.5rem" }}>
                <Btn variant="primary" onClick={() => setPage("contact")}>Join Today →</Btn>
              </div>
            </Reveal>
          </div>

          {/* Metrics - Enhanced with animations */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem" }}>
            {[
              { num:"500+", label:"Active Members",   sub:"Across all batches", color:C.primary, icon: "👥" },
              { num:"40+",  label:"Events Organized", sub:"Seminars, workshops, hackathons", color:C.accent, icon: "📅" },
              { num:"15+",  label:"Projects Shipped",  sub:"Open source & community impact", color:"#7C3AED", icon: "🚀" },
              { num:"6+",   label:"Years Running",     sub:"Est. 2019, growing stronger", color:C.success, icon: "⏱️" },
            ].map((m, i) => (
              <Reveal key={i} delay={i * 0.1} dir="right">
                <Card style={{ 
                  display:"flex", alignItems:"center", gap:"1.5rem", padding:"1.5rem 1.8rem",
                  position: "relative", overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 20px 50px ${m.color}20`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                }}
                >
                  {/* Background gradient */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, ${m.color}08, transparent)`,
                    opacity: 0.5,
                  }} />
                  {/* Top accent */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${m.color}, ${m.color}50)`,
                    borderRadius: "16px 16px 0 0",
                  }} />
                  <div style={{ 
                    fontSize: "2rem", 
                    width: 50, height: 50, 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${m.color}15`,
                    borderRadius: 12,
                  }}>{m.icon}</div>
                  <div className="display" style={{ 
                    fontSize:"2.2rem", fontWeight:900, 
                    background: `linear-gradient(135deg, ${m.color}, ${m.color}CC)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    minWidth:80, lineHeight:1,
                    position: "relative",
                  }}>{m.num}</div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontWeight:700, fontSize:"0.95rem", color:C.darkPrimary }}>{m.label}</div>
                    <div style={{ fontSize:"0.78rem", color:C.textLight, marginTop:3 }}>{m.sub}</div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS PREVIEW - Enhanced */}
      <section style={{ background:C.surface, padding:"7rem 4rem", position: "relative", overflow: "hidden" }}>
        {/* Background pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(${C.primary}06 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }} />
        
        <div style={{ maxWidth:1200, margin:"0 auto", position: "relative" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"3rem", flexWrap:"wrap", gap:16 }}>
            <div>
              <Reveal><Eyebrow>What We Offer</Eyebrow></Reveal>
              <Reveal delay={0.1}><SectionTitle>Our <Hl>Programs</Hl></SectionTitle></Reveal>
            </div>
            <Reveal delay={0.2}>
              <Btn variant="ghost" small onClick={() => setPage("programs")}>Explore All Programs →</Btn>
            </Reveal>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1.5rem" }}>
            {[
              { icon:"💻", title:"Technical Workshops", desc:"Hands-on sessions on React, Node, Docker, AWS — whatever the industry needs.", accent:C.primary },
              { icon:"🧠", title:"Mentorship", desc:"Paired with seniors and industry pros for personalized career and technical guidance.", accent:C.accent },
              { icon:"🚀", title:"Project Incubator", desc:"Resources and mentorship to turn ideas into real products with community support.", accent:"#7C3AED" },
              { icon:"📈", title:"Career Launchpad", desc:"Resume reviews, mock interviews, referrals — prep for the tech job market.", accent:C.success },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.1} dir={i % 2 === 0 ? "up" : "down"}>
                <div 
                  style={{ 
                    background: C.surface, 
                    borderRadius: 20,
                    border: `1px solid ${C.border}`,
                    padding:"2rem", 
                    position:"relative", 
                    overflow:"hidden",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    cursor: "default",
                    height: "100%",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 25px 50px ${p.accent}20`;
                    e.currentTarget.style.borderColor = p.accent + "40";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  {/* Animated top bar */}
                  <div style={{ 
                    position:"absolute", top:0, left:0, right:0, height:4, 
                    background:`linear-gradient(90deg,${p.accent},${p.accent}60)`, 
                    borderRadius:"20px 20px 0 0",
                  }} />
                  
                  {/* Background glow */}
                  <div style={{
                    position: "absolute", top: -50, right: -50, width: 150, height: 150,
                    background: `radial-gradient(circle, ${p.accent}15, transparent)`,
                    borderRadius: "50%",
                    transition: "all 0.4s ease",
                  }} />
                  
                  {/* Icon with animation */}
                  <div style={{ 
                    fontSize:"2.5rem", marginBottom:"1.2rem",
                    width: 60, height: 60,
                    background: `linear-gradient(135deg, ${p.accent}20, ${p.accent}08)`,
                    borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${p.accent}20`,
                    position: "relative",
                  }}>{p.icon}</div>
                  
                  <div className="display" style={{ 
                    fontSize:"1.05rem", fontWeight:700, color:C.darkPrimary, marginBottom:"0.6rem",
                  }}>{p.title}</div>
                  <div style={{ fontSize:"0.84rem", color:C.textLight, lineHeight:1.7 }}>{p.desc}</div>
                  
                  {/* Learn more link */}
                  <div style={{
                    marginTop: "1.2rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.7rem",
                    color: p.accent,
                    display: "flex", alignItems: "center", gap: 6,
                    opacity: 0.8,
                  }}>
                    Learn more
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Enhanced */}
      <section style={{ 
        background: primaryGrad, 
        padding:"6rem 4rem", 
        position:"relative", 
        overflow:"hidden" 
      }}>
        {/* Animated background elements */}
        <div style={{ 
          position:"absolute", inset:0, 
          backgroundImage:`radial-gradient(${C.accent}20 1px, transparent 1px)`, 
          backgroundSize:"32px 32px",
          animation: "gridMove 30s linear infinite",
        }} />
        
        {/* Floating orbs */}
        <div style={{
          position: "absolute", top: -100, right: -100, width: 400, height: 400,
          background: `radial-gradient(circle, ${C.accent}30, transparent)`,
          borderRadius: "50%",
          animation: "float 15s ease-in-out infinite",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: -50, left: -50, width: 300, height: 300,
          background: `radial-gradient(circle, ${C.accent}20, transparent)`,
          borderRadius: "50%",
          animation: "float 12s ease-in-out infinite reverse",
          filter: "blur(40px)",
        }} />
        
        {/* Geometric shapes */}
        {[
          { top: "20%", left: "10%", size: 40, rotation: 45 },
          { top: "60%", right: "15%", size: 30, rotation: 20 },
          { bottom: "30%", left: "20%", size: 25, rotation: 60 },
        ].map((shape, i) => (
          <div key={i} style={{
            position: "absolute",
            top: shape.top, left: shape.left, right: shape.right, bottom: shape.bottom,
            width: shape.size, height: shape.size,
            border: "2px solid rgba(255,255,255,0.2)",
            borderRadius: i % 2 === 0 ? 8 : "50%",
            transform: `rotate(${shape.rotation}deg)`,
            animation: `spin ${20 + i * 5}s linear infinite`,
          }} />
        ))}
        
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
          <Reveal>
            <div style={{ 
              display:"flex", justifyContent:"space-between", alignItems:"center", 
              gap:"3rem", flexWrap:"wrap",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: 24,
              padding: "3rem 4rem",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div>
                <h2 className="display" style={{ 
                  fontSize:"clamp(1.8rem,3vw,2.8rem)", fontWeight:900, 
                  color:"#fff", letterSpacing:"-0.03em", marginBottom:"0.8rem" 
                }}>
                  Ready to join <span style={{ 
                    background: `linear-gradient(135deg, ${C.accent}, #fff)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>SES MUET</span>?
                </h2>
                <p style={{ color:"rgba(255,255,255,.7)", fontSize:"1.05rem", fontWeight:300, maxWidth: 500 }}>
                  Join 500+ students building their future in software engineering. Be part of a community that learns, builds, and grows together.
                </p>
                
                {/* Stats mini */}
                <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem" }}>
                  {[["500+", "Members"], ["40+", "Events"], ["15+", "Projects"]].map(([num, label]) => (
                    <div key={label} style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{num}</div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", flexDirection: "column" }}>
                <Btn variant="white" onClick={() => setPage("contact")}>
                  Join Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Btn>
                <Btn variant="outline" style={{ borderColor:"rgba(255,255,255,.4)", color:"#fff" }} onClick={() => setPage("team")}>Meet the Team</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: EVENTS
// ══════════════════════════════════════════════════════════════════════════════
function EventsPage({ setPage }) {
  const [filter, setFilter] = useState("all");

  const events = [
    { icon:"⚡", bg:`linear-gradient(135deg,#EBF4FF,#DBEAFE)`, date:"June 14–15, 2025", tag:"Upcoming", tagColor:C.success, title:"Annual Hackathon 2025", desc:"48 hours of building. Compete with the best minds at MUET, mentored by pros.", slots:"120+ slots", type:"upcoming", featured:true },
    { icon:"🎤", bg:`linear-gradient(135deg,#E0F2FE,#BAE6FD)`, date:"May 28, 2025", tag:"Workshop", tagColor:C.primary, title:"DevTalks: AI in Industry", desc:"Industry engineers share how AI is reshaping real software development.", slots:"80 seats", type:"upcoming" },
    { icon:"🏆", bg:`linear-gradient(135deg,#EDE9FE,#DDD6FE)`, date:"May 20, 2025", tag:"Competition", tagColor:"#7C3AED", title:"CodeStorm v3.0", desc:"Competitive programming — DSA, algorithms, creative problem-solving battles.", slots:"200 slots", type:"competition" },
    { icon:"🚀", bg:`linear-gradient(135deg,#D1FAE5,#A7F3D0)`, date:"July 5, 2025", tag:"New", tagColor:C.success, title:"Open Source Sprint", desc:"Contribute to real projects. Master Git, PRs, and collaborative workflows.", slots:"50 slots", type:"upcoming" },
    { icon:"📱", bg:`linear-gradient(135deg,#FEF3C7,#FDE68A)`, date:"July 18, 2025", tag:"Workshop", tagColor:C.warning, title:"Flutter Dev Bootcamp", desc:"Two-day intensive: build and ship a real mobile app from scratch.", slots:"40 seats", type:"workshop" },
    { icon:"🎨", bg:`linear-gradient(135deg,#FCE7F3,#FBCFE8)`, date:"Aug 2, 2025", tag:"Workshop", tagColor:"#DB2777", title:"UI/UX Design Masterclass", desc:"Figma, design systems, prototyping, user research from practising designers.", slots:"35 seats", type:"workshop" },
  ];

  const past = [
    { icon:"🏆", title:"CodeStorm v2.0", desc:"Competitive programming — 180 participants", date:"March 2025" },
    { icon:"🤝", title:"Industry Networking Night", desc:"Students connected with 20+ tech professionals", date:"Feb 2025" },
    { icon:"💻", title:"Web Dev Workshop Series", desc:"4-part series on HTML/CSS/JS/React — sold out", date:"Jan 2025" },
    { icon:"🎙️", title:"SES Annual Seminar 2024", desc:"Year-end showcase of projects", date:"Dec 2024" },
    { icon:"⚡", title:"Annual Hackathon 2024", desc:"48hrs, 100+ participants, 22 projects", date:"Oct 2024" },
    { icon:"🧠", title:"AI & ML Bootcamp", desc:"Intro to machine learning — 60 enrolled", date:"Sep 2024" },
  ];

  const filters = ["all","upcoming","workshop","competition"];
  const shown = events.filter(e => filter === "all" || e.type === filter);

  return (
    <>
      {/* Hero */}
      <div style={{ background:bgHeroGrad, padding:"5rem 4rem 4rem", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ fontSize:"0.72rem", fontFamily:"'JetBrains Mono',monospace", color:C.textLight, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1.5rem" }}>
            <span style={{ color:C.primary, cursor:"pointer" }} onClick={() => setPage("home")}>Home</span>
            <span style={{ margin:"0 8px" }}>/</span>Events
          </div>
          <Eyebrow>Events & Activities</Eyebrow>
          <h1 className="display" style={{ fontSize:"clamp(2.2rem,4vw,3.8rem)", fontWeight:900, color:C.darkPrimary, letterSpacing:"-0.035em", marginBottom:"1rem" }}>
            Where Learning Meets <Hl>Action</Hl>
          </h1>
          <p style={{ color:C.textMid, maxWidth:540, lineHeight:1.85, fontSize:"1.02rem", marginBottom:"2rem" }}>From 48-hour hackathons to industry seminars — every SES event pushes your limits.</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase",
                padding:"0.5rem 1.2rem", borderRadius:8, cursor:"pointer", transition:"all .2s",
                background: filter===f ? C.primary : "transparent",
                color: filter===f ? "#fff" : C.textMid,
                border:`1.5px solid ${filter===f ? C.primary : C.border}`,
                fontWeight: filter===f ? 700 : 400,
              }}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"4rem" }}>
        {/* Featured */}
        {filter==="all" && (
          <div style={{ marginBottom:"3rem" }}>
            <div className="mono" style={{ fontSize:"0.68rem", color:C.primary, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:8 }}>
              <span>⭐</span> Featured Event
            </div>
            <Card style={{ display:"grid", gridTemplateColumns:"1fr 1fr", overflow:"hidden" }}>
              <div style={{ minHeight:300, background:`linear-gradient(135deg,#EBF4FF,#DBEAFE)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <div style={{ fontSize:"6rem", animation:"float 5s ease infinite", filter:`drop-shadow(0 8px 32px ${C.primary}50)` }}>⚡</div>
              </div>
              <div style={{ padding:"2.5rem", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ marginBottom:"1rem" }}>
                  <Badge color={C.success}>★ Flagship Event of the Year</Badge>
                </div>
                <h2 className="display" style={{ fontSize:"2rem", fontWeight:900, color:C.darkPrimary, letterSpacing:"-0.025em", marginBottom:"0.8rem" }}>Annual Hackathon 2025</h2>
                <p style={{ color:C.textMid, lineHeight:1.8, fontSize:"0.95rem", marginBottom:"1.5rem" }}>48 hours, one mission. Build something that matters. Compete with the brightest minds, get mentored by industry pros, and win amazing prizes.</p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"1.5rem" }}>
                  {[["Date","June 14–15"],["Venue","MUET Campus"],["Capacity","120 Slots"]].map(([l,v]) => (
                    <div key={l}>
                      <div className="mono" style={{ fontSize:"0.62rem", color:C.textLight, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>{l}</div>
                      <div style={{ fontWeight:700, fontSize:"0.9rem", color:C.darkPrimary }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <Btn variant="primary" onClick={() => setPage("contact")}>Register Now →</Btn>
                  <Tag color={C.success}>Registration Open</Tag>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Grid */}
        <div style={{ marginBottom:"1.5rem" }}>
          <div className="mono" style={{ fontSize:"0.68rem", color:C.textLight, letterSpacing:"0.15em", textTransform:"uppercase" }}>
            {shown.length} Event{shown.length!==1?"s":""} {filter!=="all"?`· ${filter.charAt(0).toUpperCase()+filter.slice(1)}`:""}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem", marginBottom:"4rem" }}>
          {shown.map((ev, i) => (
            <Card key={i} style={{ overflow:"hidden", animation:`scaleIn .4s ${i*.08}s both` }}>
              <div style={{ height:160, background:ev.bg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <div style={{ fontSize:"3rem", animation:`float ${4+i*0.3}s ease infinite` }}>{ev.icon}</div>
                <div style={{ position:"absolute", top:12, right:12 }}><Tag color={ev.tagColor}>{ev.tag}</Tag></div>
              </div>
              <div style={{ padding:"1.3rem 1.4rem" }}>
                <div className="mono" style={{ fontSize:"0.63rem", color:C.textLight, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>{ev.date}</div>
                <h3 className="display" style={{ fontSize:"1.02rem", fontWeight:700, color:C.darkPrimary, marginBottom:6 }}>{ev.title}</h3>
                <p style={{ fontSize:"0.82rem", color:C.textLight, lineHeight:1.65 }}>{ev.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"1.1rem", paddingTop:"1.1rem", borderTop:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:"0.75rem", color:C.textLight }}>👥 {ev.slots}</span>
                  <Btn variant="outline" small onClick={() => setPage("contact")}>Register →</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Past Events */}
        {filter==="all" && (
          <>
            <div style={{ height:1, background:C.border, marginBottom:"3rem" }} />
            <Eyebrow>Hall of Fame</Eyebrow>
            <SectionTitle style={{ marginBottom:"2rem" }}>Past <Hl>Events</Hl></SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1rem" }}>
              {past.map((p, i) => (
                <Card key={i} style={{ display:"flex", gap:"1rem", alignItems:"center", padding:"1.2rem 1.5rem" }}>
                  <div style={{ fontSize:"2rem", flexShrink:0 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:"0.92rem", color:C.darkPrimary, marginBottom:3 }}>{p.title}</div>
                    <div style={{ fontSize:"0.78rem", color:C.textLight }}>{p.desc}</div>
                    <div className="mono" style={{ fontSize:"0.63rem", color:C.primary, marginTop:4 }}>{p.date}</div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: PROGRAMS
// ══════════════════════════════════════════════════════════════════════════════
function ProgramsPage({ setPage }) {
  const programs = [
    { icon:"💻", color:C.primary, title:"Technical Workshops", desc:"Hands-on sessions covering modern web development, mobile apps, cloud computing, DevOps, and cutting-edge technologies used in the industry.", tags:["React","Node.js","Docker","AWS","Python"], sessions:"12+ sessions/year" },
    { icon:"🧠", color:C.accent, title:"Mentorship Program", desc:"Get paired with senior students and industry professionals for personalized guidance on career development, project building, and technical skills.", tags:["1:1 Sessions","Career Guidance","Code Reviews","Interview Prep"], sessions:"Ongoing" },
    { icon:"🚀", color:"#7C3AED", title:"Project Incubator", desc:"Transform your ideas into real products. Get resources, mentorship, and a platform to showcase your project to the MUET community.", tags:["Team Building","Open Source","Showcases","Demo Days"], sessions:"2 cohorts/year" },
    { icon:"📈", color:C.success, title:"Career Launchpad", desc:"Resume reviews, mock interviews, internship referrals, and connections with alumni at top companies. Prepare for the competitive tech job market.", tags:["Resume Help","Mock Interviews","Referrals","Networking"], sessions:"Year-round" },
    { icon:"⚡", color:C.warning, title:"Competitive Programming", desc:"Structured preparation for competitive programming contests. Weekly problem-solving sessions and mock competitions to sharpen your algorithmic thinking.", tags:["DSA","LeetCode","Codeforces","ICPC Prep"], sessions:"Weekly" },
    { icon:"🎨", color:"#DB2777", title:"Design & Dev Circle", desc:"A creative space for UI/UX design, frontend development, and product thinking. Learn Figma, build design systems, and create beautiful interfaces.", tags:["Figma","UI/UX","Frontend","Product Design"], sessions:"Bi-weekly" },
  ];

  return (
    <>
      <div style={{ background:bgHeroGrad, padding:"5rem 4rem 4rem", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="mono" style={{ fontSize:"0.72rem", color:C.textLight, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1.5rem" }}>
            <span style={{ color:C.primary, cursor:"pointer" }} onClick={() => setPage("home")}>Home</span>
            <span style={{ margin:"0 8px" }}>/</span>Programs
          </div>
          <Eyebrow>What We Offer</Eyebrow>
          <h1 className="display" style={{ fontSize:"clamp(2.2rem,4vw,3.8rem)", fontWeight:900, color:C.darkPrimary, letterSpacing:"-0.035em", marginBottom:"1rem" }}>
            Structured Growth <Hl>Programs</Hl>
          </h1>
          <p style={{ color:C.textMid, maxWidth:540, lineHeight:1.85, fontSize:"1.02rem" }}>Carefully designed initiatives that accelerate your growth as a software engineer — from first-year to final-year and beyond.</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"5rem 4rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem" }}>
          {programs.map((p, i) => (
            <Card key={i} style={{ padding:"2rem", position:"relative", overflow:"hidden", animation:`fadeUp .5s ${i*.1}s both` }}>
              <div style={{ width:48, height:48, borderRadius:12, background:`${p.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", marginBottom:"1.2rem", border:`1px solid ${p.color}25` }}>{p.icon}</div>
              <div style={{ position:"absolute", top:0, right:0, width:80, height:80, borderRadius:"0 16px 0 80px", background:`${p.color}08` }} />
              <h3 className="display" style={{ fontSize:"1.12rem", fontWeight:800, color:C.darkPrimary, marginBottom:"0.5rem", letterSpacing:"-0.02em" }}>{p.title}</h3>
              <p style={{ fontSize:"0.85rem", color:C.textLight, lineHeight:1.7, marginBottom:"1.2rem" }}>{p.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:"1.2rem" }}>
                {p.tags.map(t => <Tag key={t} color={p.color}>{t}</Tag>)}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:"1rem", borderTop:`1px solid ${C.border}` }}>
                <span className="mono" style={{ fontSize:"0.65rem", color:C.textLight }}>{p.sessions}</span>
                <Btn variant="outline" small onClick={() => setPage("contact")}>Apply →</Btn>
              </div>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginTop:"5rem" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <Eyebrow>The Process</Eyebrow>
            <SectionTitle>How It <Hl>Works</Hl></SectionTitle>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1.5rem" }}>
            {[
              { step:"01", icon:"📝", title:"Apply", desc:"Fill out the membership form and tell us what excites you about SES." },
              { step:"02", icon:"✅", title:"Onboard", desc:"Attend the orientation session and pick your programs and committees." },
              { step:"03", icon:"🚀", title:"Participate", desc:"Attend events, workshops, and contribute to projects actively." },
              { step:"04", icon:"🏆", title:"Grow", desc:"Build your portfolio, network with alumni, and land your dream role." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div className="mono" style={{ fontSize:"2.5rem", fontWeight:700, color:`${C.primary}20`, lineHeight:1, marginBottom:"0.5rem" }}>{s.step}</div>
                <div style={{ fontSize:"2rem", marginBottom:"0.8rem" }}>{s.icon}</div>
                <div className="display" style={{ fontWeight:700, fontSize:"1rem", color:C.darkPrimary, marginBottom:"0.4rem" }}>{s.title}</div>
                <div style={{ fontSize:"0.82rem", color:C.textLight, lineHeight:1.65 }}>{s.desc}</div>
                {i < 3 && <div style={{ position:"relative" }}><div style={{ position:"absolute", top:-40, right:-"50%", width:"100%", height:1, background:C.border }} /></div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop:"4rem", background:primaryGrad, borderRadius:20, padding:"3rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${C.accent}20 1px, transparent 1px)`, backgroundSize:"24px 24px" }} />
          <h3 className="display" style={{ fontSize:"2rem", fontWeight:900, color:"#fff", marginBottom:"0.5rem", position:"relative" }}>Ready to start your journey?</h3>
          <p style={{ color:"rgba(255,255,255,.75)", marginBottom:"1.5rem", position:"relative" }}>Membership is open to all MUET students. Join us today.</p>
          <Btn variant="white" onClick={() => setPage("contact")} style={{ position:"relative" }}>Join SES Now →</Btn>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEAM PAGE — HELPERS
// ══════════════════════════════════════════════════════════════════════════════

// Scroll-triggered reveal wrapper
function Reveal({ children, delay = 0, dir = "up", style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transforms = { up:"translateY(36px)", down:"translateY(-36px)", left:"translateX(-36px)", right:"translateX(36px)", scale:"scale(0.88)" };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : (transforms[dir] || transforms.up),
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// Executive Card with modern 3D flip animation
function ExecutiveCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  const [hov, setHov] = useState(false);
  const { initials, color, name, role, batch, bio } = member;

  return (
    <Reveal delay={index * 0.12} dir="up">
      <div
        onClick={() => setFlipped(f => !f)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ perspective: 1200, cursor: "pointer", height: 320 }}
        title="Click to flip"
      >
        <div style={{
          position: "relative", width: "100%", height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: flipped 
            ? "rotateY(180deg)" 
            : hov 
              ? "rotateY(8deg) rotateX(5deg) scale(1.02)" 
              : "rotateY(0deg)",
        }}>
          {/* ── FRONT ── */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden",
            background: C.surface, borderRadius: 20,
            border: `2px solid ${hov ? color : C.border}`,
            boxShadow: hov 
              ? `0 25px 50px ${color}25, 0 0 0 1px ${color}15` 
              : "0 4px 20px rgba(0,0,0,.08)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "1.5rem", textAlign: "center",
            overflow: "hidden",
            transition: "all 0.4s ease",
          }}>
            {/* Animated gradient border effect */}
            <div style={{
              position: "absolute", inset: -2, borderRadius: 22, padding: 2,
              background: hov 
                ? `linear-gradient(45deg, ${color}, ${C.accent}, ${color})` 
                : "transparent",
              backgroundSize: "200% 200%",
              animation: hov ? "gradientShift 3s ease infinite" : "none",
              opacity: hov ? 1 : 0,
              transition: "opacity 0.3s ease",
              zIndex: -1,
            }} />
            
            {/* Background effects */}
            <div style={{
              position: "absolute", width: 180, height: 180, borderRadius: "50%",
              background: `${color}12`, top: -60, right: -60, pointerEvents: "none",
              transform: hov ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.5s ease",
            }} />
            
            {/* Floating particles */}
            {hov && [...Array(6)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                width: 4 + Math.random() * 4,
                height: 4 + Math.random() * 4,
                background: color,
                borderRadius: 2,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                opacity: 0.4,
                animation: `particleFloat ${1.5 + Math.random()}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }} />
            ))}
            
            {/* Avatar with pulse ring */}
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              {/* Pulse rings */}
              <div style={{
                position: "absolute", inset: -8, borderRadius: "50%",
                border: `2px solid ${color}30`,
                animation: hov ? "pulseRing 1.5s ease-out infinite" : "none",
              }} />
              <div style={{
                position: "absolute", inset: -4, borderRadius: "50%",
                border: `2px dashed ${color}40`,
                animation: "spin 10s linear infinite",
              }} />
              <div style={{
                width: 70, height: 70, borderRadius: "50%",
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                border: `3px solid ${hov ? color : color + "60"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem", fontWeight: 900, color,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: hov ? `0 8px 30px ${color}40` : `0 4px 15px ${color}20`,
                transition: "all 0.4s ease",
                animation: hov ? "iconBounce 1s ease infinite" : "none",
              }}>{initials}</div>
            </div>
            
            <div style={{ 
              fontWeight: 800, fontSize: "0.95rem", color: C.darkPrimary, marginBottom: 4, 
              fontFamily: "'Bricolage Grotesque', sans-serif",
              transform: hov ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}>{name}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem",
              color, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6,
              padding: "3px 10px", borderRadius: 20,
              background: `${color}15`,
            }}>{role}</div>
            <div style={{ fontSize: "0.72rem", color: C.textLight, marginBottom: "0.6rem" }}>{batch}</div>
            
            {/* Flip hint */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem",
              color: `${color}80`, marginTop: "auto",
              opacity: hov ? 1 : 0.6,
              transition: "opacity 0.3s ease",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
              </svg>
              Click to flip
            </div>
            
            {/* Top accent bar with gradient animation */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: `linear-gradient(90deg, ${color}, ${C.accent}, ${color})`,
              backgroundSize: "200% 100%",
              animation: hov ? "gradientShift 2s ease infinite" : "none",
              borderRadius: "20px 20px 0 0",
            }} />
          </div>

          {/* ── BACK ── */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(145deg, ${color}18, ${color}08)`,
            borderRadius: 20,
            border: `2px solid ${color}40`,
            boxShadow: `0 15px 40px ${color}25`,
            display: "flex", flexDirection: "column",
            padding: "1.5rem", overflow: "hidden",
          }}>
            {/* Decorative elements */}
            <div style={{ 
              position: "absolute", bottom: -30, right: -30, width: 120, height: 120, 
              borderRadius: "50%", background: `${color}15` 
            }} />
            
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.8rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `${color}25`, border: `2px solid ${color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 800, color,
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}>{initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: C.darkPrimary, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{role}</div>
              </div>
            </div>
            
            <p style={{ fontSize: "0.75rem", color: C.textMid, lineHeight: 1.7, flex: 1 }}>
              {bio || `${role} at SES MUET. Passionate about software engineering and building a stronger tech community at MUET Jamshoro.`}
            </p>
            
            <div style={{ marginTop: "0.8rem" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[["li", "LinkedIn"], ["gh", "GitHub"]].map(([s]) => (
                  <div key={s}
                    style={{
                      flex: 1, height: 28, borderRadius: 8,
                      border: `1px solid ${color}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: color,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
                      background: `${color}10`, transition: "all .25s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.color = color; }}
                  >{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// Modern Team Card with hover animations
function TeamCard({ team, index }) {
  const [hov, setHov] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { icon, color, name, desc, lead, members } = team;

  return (
    <Reveal delay={index * 0.1} dir={index % 2 === 0 ? "left" : "right"}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => { setHov(false); setExpanded(false); }}
        onClick={() => setExpanded(e => !e)}
        style={{
          background: C.surface, borderRadius: 20,
          border: `2px solid ${hov ? color : C.border}`,
          padding: "1.5rem",
          boxShadow: hov 
            ? `0 25px 50px ${color}20, 0 0 0 1px ${color}10`
            : "0 4px 15px rgba(0,0,0,.05)",
          transform: hov 
            ? "translateY(-10px) scale(1.02)" 
            : "translateY(0) scale(1)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: "pointer", position: "relative", overflow: "hidden",
          minHeight: expanded ? 320 : 200,
        }}>
        
        {/* Animated background gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${color}08 0%, transparent 50%)`,
          opacity: hov ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />
        
        {/* Floating icon background */}
        <div style={{
          position: "absolute", top: -20, right: -20, width: 100, height: 100,
          background: `${color}10`, borderRadius: "50%",
          transform: hov ? "scale(1.8) rotate(15deg)" : "scale(1) rotate(0deg)",
          transition: "all 0.5s ease",
        }} />
        
        {/* Animated corner accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: hov ? 100 : 0, height: 4,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          transition: "width 0.4s ease",
          borderRadius: "20px 0 0 0",
        }} />
        
        <div style={{ position: "relative" }}>
          {/* Icon with bounce animation */}
          <div style={{
            width: 50, height: 50, borderRadius: 14,
            background: `linear-gradient(135deg, ${color}25, ${color}10)`,
            border: `2px solid ${hov ? color : color + "40"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", marginBottom: "1rem",
            boxShadow: hov ? `0 8px 25px ${color}30` : "none",
            transition: "all 0.4s ease",
            animation: hov ? "iconBounce 1s ease infinite" : "none",
          }}>{icon}</div>
          
          <div style={{ 
            fontWeight: 800, fontSize: "1rem", color: C.darkPrimary, marginBottom: 6,
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}>{name}</div>
          
          <div style={{ 
            fontSize: "0.78rem", color: C.textLight, lineHeight: 1.65, marginBottom: "1rem",
            maxHeight: expanded ? 80 : 40,
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}>{desc}</div>
          
          {/* Team Lead */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0.6rem 0.8rem", borderRadius: 12,
            background: `${color}10`, border: `1px solid ${color}25`,
            marginBottom: expanded ? "0.8rem" : 0,
            transition: "margin-bottom 0.3s ease",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `linear-gradient(135deg, ${color}30, ${color}15)`,
              border: `2px solid ${color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.6rem", fontWeight: 800, color,
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}>{lead.initials}</div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.darkPrimary, lineHeight: 1.2 }}>{lead.name}</div>
              <div style={{ 
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", 
                color, textTransform: "uppercase", letterSpacing: "0.08em" 
              }}>{lead.role}</div>
            </div>
          </div>
          
          {/* Expanded members */}
          <div style={{
            maxHeight: expanded ? 200 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}>
            <div style={{ 
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", 
              color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em",
              marginBottom: "0.5rem", marginTop: "0.5rem",
            }}>Team Members</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {members.map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0.4rem 0.6rem", borderRadius: 8,
                  background: C.bg, border: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: `${color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.5rem", fontWeight: 800, color,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}>{m.initials}</div>
                  <span style={{ fontSize: "0.68rem", color: C.textMid }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom gradient bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: hov ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />
        
        {/* Expand indicator */}
        <div style={{
          position: "absolute", bottom: 8, right: 12,
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem",
          color: color, opacity: hov ? 0.8 : 0,
          transition: "opacity 0.3s ease",
        }}>
          {expanded ? "Click to collapse" : "Click to expand"}
        </div>
      </div>
    </Reveal>
  );
}

// Flip card — front shows avatar+name+role, back shows bio+links
function FlipCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  const { initials, color, name, role, batch, bio, linkedin, github } = member;

  return (
    <Reveal delay={index * 0.1} dir="up">
      <div
        onClick={() => setFlipped(f => !f)}
        style={{ perspective: 1000, cursor: "pointer", height: 280 }}
        title="Click to flip"
      >
        <div style={{
          position: "relative", width: "100%", height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}>
          {/* ── FRONT ── */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden",
            background: C.surface, borderRadius: 18,
            border: `1px solid ${C.border}`,
            boxShadow: "0 4px 20px rgba(0,0,0,.07)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "2rem", textAlign: "center",
            overflow: "hidden",
          }}>
            {/* Background blob */}
            <div style={{
              position: "absolute", width: 160, height: 160, borderRadius: "50%",
              background: `${color}10`, top: -40, right: -40, pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", width: 80, height: 80, borderRadius: "50%",
              background: `${color}08`, bottom: 10, left: -20, pointerEvents: "none",
            }} />
            {/* Avatar ring animation */}
            <div style={{ position: "relative", marginBottom: "1.1rem" }}>
              <div style={{
                position: "absolute", inset: -4, borderRadius: "50%",
                border: `2px dashed ${color}40`,
                animation: "spin 12s linear infinite",
              }} />
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
                border: `2.5px solid ${color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", fontWeight: 900, color,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                boxShadow: `0 8px 24px ${color}25`,
              }}>{initials}</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: C.darkPrimary, marginBottom: 4, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{name}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
              color, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6,
            }}>{role}</div>
            <div style={{ fontSize: "0.75rem", color: C.textLight, marginBottom: "0.8rem" }}>{batch}</div>
            {/* Flip hint */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
              color: `${color}80`, marginTop: "auto",
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>
              Click to flip
            </div>
            {/* Top accent bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${color}, ${color}60)`,
              borderRadius: "18px 18px 0 0",
            }} />
          </div>

          {/* ── BACK ── */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(145deg, ${color}12, ${color}06)`,
            borderRadius: 18,
            border: `1.5px solid ${color}35`,
            boxShadow: `0 8px 32px ${color}20`,
            display: "flex", flexDirection: "column",
            padding: "1.6rem", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", bottom: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${color}12` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: `${color}20`, border: `1.5px solid ${color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.82rem", fontWeight: 800, color,
                fontFamily: "'Bricolage Grotesque', sans-serif", flexShrink: 0,
              }}>{initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: C.darkPrimary, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{name}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{role}</div>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: C.textMid, lineHeight: 1.75, flex: 1 }}>{bio || `${role} at SES MUET. Passionate about software engineering and building a stronger tech community at MUET Jamshoro.`}</p>
            <div style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", gap: 8 }}>
                {[["li", "LinkedIn"], ["gh", "GitHub"], ["tw", "Twitter"]].map(([s, label]) => (
                  <div key={s}
                    style={{
                      flex: 1, height: 30, borderRadius: 8,
                      border: `1px solid ${color}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: color,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
                      background: `${color}08`, transition: "all .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.color = color; }}
                  >{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// Smaller animated core team card
function CoreCard({ member, index }) {
  const [hov, setHov] = useState(false);
  const { initials, color, name, role, batch } = member;
  return (
    <Reveal delay={index * 0.07} dir="up">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${hov ? color + "50" : C.border}`,
          padding: "1.4rem", textAlign: "center",
          boxShadow: hov ? `0 16px 40px ${color}18` : "0 2px 10px rgba(0,0,0,.05)",
          transform: hov ? "translateY(-6px)" : "translateY(0)",
          transition: "all .35s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "default", position: "relative", overflow: "hidden",
        }}>
        {/* corner accent */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: 50, height: 50,
          background: `${color}10`, borderRadius: "0 14px 0 50px",
          transform: hov ? "scale(1.5)" : "scale(1)", transition: "transform .35s",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}25, ${color}08)`,
            border: `2px solid ${hov ? color + "70" : color + "25"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 0.85rem",
            fontSize: "1.05rem", fontWeight: 800, color,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            boxShadow: hov ? `0 6px 20px ${color}30` : "none",
            transition: "all .35s",
          }}>{initials}</div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: C.darkPrimary, marginBottom: 3 }}>{name}</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
            color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4,
          }}>{role}</div>
          <div style={{ fontSize: "0.74rem", color: C.textLight }}>{batch}</div>
        </div>
        {/* bottom bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: hov ? 1 : 0, transition: "opacity .35s",
        }} />
      </div>
    </Reveal>
  );
}

// Department card with modern animations
function DeptCard({ dept, index }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={index * 0.08} dir={index % 2 === 0 ? "left" : "right"}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: C.surface,
          border: `2px solid ${hov ? dept.color : C.border}`,
          borderRadius: 18, padding: "1.8rem",
          boxShadow: hov 
            ? `0 20px 40px ${dept.color}20, 0 0 0 1px ${dept.color}10` 
            : "0 4px 15px rgba(0,0,0,.05)",
          transform: hov ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          transition: "all .4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: "default", position: "relative", overflow: "hidden",
        }}>
        {/* Animated gradient background */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${dept.color}08 0%, transparent 60%)`,
          opacity: hov ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />
        
        {/* Floating circle */}
        <div style={{
          position: "absolute", top: -30, right: -30, width: 100, height: 100,
          background: `${dept.color}12`, borderRadius: "50%",
          transform: hov ? "scale(2) rotate(45deg)" : "scale(1) rotate(0deg)", 
          transition: "all .5s ease",
        }} />
        
        {/* Top accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: hov ? "100%" : "0%", height: 4,
          background: `linear-gradient(90deg, ${dept.color}, ${C.accent})`,
          transition: "width 0.4s ease",
          borderRadius: "18px 18px 0 0",
        }} />
        
        <div style={{ position: "relative" }}>
          {/* Icon with bounce animation */}
          <div style={{ 
            fontSize: "2rem", marginBottom: "0.8rem",
            display: "inline-block",
            animation: hov ? "iconBounce 1s ease infinite" : "none",
            filter: hov ? `drop-shadow(0 4px 12px ${dept.color}40)` : "none",
            transition: "filter 0.3s ease",
          }}>{dept.icon}</div>
          
          <div style={{ 
            fontWeight: 800, fontSize: "1rem", color: C.darkPrimary, marginBottom: 6, 
            fontFamily: "'Bricolage Grotesque', sans-serif",
            transform: hov ? "translateX(4px)" : "translateX(0)",
            transition: "transform 0.3s ease",
          }}>{dept.title}</div>
          
          <div style={{ 
            fontSize: "0.82rem", color: C.textLight, lineHeight: 1.75,
            transform: hov ? "translateX(4px)" : "translateX(0)",
            transition: "transform 0.3s ease 0.05s",
          }}>{dept.desc}</div>
        </div>
        
        {/* Bottom accent line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent, ${dept.color}, transparent)`,
          opacity: hov ? 1 : 0,
          transition: "opacity 0.4s ease",
        }} />
      </div>
    </Reveal>
  );
}

// Past team year card
function PastTeamCard({ year, members, achievements, index }) {
  const [expanded, setExpanded] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <Reveal delay={index * 0.1} dir="up">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: C.surface, borderRadius: 18,
          border: `1px solid ${hov || expanded ? C.primary + "40" : C.border}`,
          boxShadow: hov || expanded ? `0 16px 40px rgba(30,136,229,.1)` : "0 2px 10px rgba(0,0,0,.05)",
          transition: "all .35s ease",
          overflow: "hidden",
        }}>
        {/* Header */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "1.5rem", textAlign: "left",
          }}>
          {/* Year badge */}
          <div style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
            background: expanded ? primaryGrad : `linear-gradient(135deg, ${C.primary}18, ${C.primary}08)`,
            border: `1.5px solid ${expanded ? C.primary : C.primary + "30"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .35s",
          }}>
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "1rem", fontWeight: 900,
              color: expanded ? "#fff" : C.primary,
              transition: "color .35s",
            }}>{year}</span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: C.darkPrimary, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 4 }}>
              Batch {year}–{parseInt(year)+1}
            </div>
            <div style={{ fontSize: "0.82rem", color: C.textLight }}>
              {members.length} team members · {achievements.length} key achievements
            </div>
          </div>

          {/* Avatars preview */}
          <div style={{ display: "flex", marginRight: "1rem" }}>
            {members.slice(0, 4).map((m, i) => (
              <div key={i} style={{
                width: 34, height: 34, borderRadius: "50%",
                background: `linear-gradient(135deg, ${m.color}30, ${m.color}10)`,
                border: `2px solid #fff`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", fontWeight: 800, color: m.color,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                marginLeft: i === 0 ? 0 : -10, zIndex: 4 - i,
                boxShadow: "0 2px 6px rgba(0,0,0,.1)",
              }}>{m.initials}</div>
            ))}
            {members.length > 4 && (
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: C.bg, border: `2px solid #fff`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.62rem", fontWeight: 700, color: C.textLight,
                marginLeft: -10, zIndex: 0,
              }}>+{members.length - 4}</div>
            )}
          </div>

          {/* Chevron */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: expanded ? `${C.primary}15` : C.bg,
            border: `1px solid ${expanded ? C.primary + "40" : C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all .3s",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={expanded ? C.primary : C.textLight} strokeWidth="2.5" style={{ transition: "transform .3s", transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </button>

        {/* Expanded content */}
        <div style={{
          maxHeight: expanded ? 600 : 0,
          overflow: "hidden",
          transition: "max-height .5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "1.5rem 2rem 2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              {/* Members grid */}
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: C.primary, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 16, height: 1.5, background: C.primary, borderRadius: 2 }} /> Team Members
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  {members.map((m, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "0.6rem 0.8rem", borderRadius: 10,
                      background: C.bg, border: `1px solid ${C.border}`,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: `${m.color}18`, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.6rem", fontWeight: 800, color: m.color,
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}>{m.initials}</div>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: C.darkPrimary, lineHeight: 1.2 }}>{m.name}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: m.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: C.success, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 16, height: 1.5, background: C.success, borderRadius: 2 }} /> Achievements
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {achievements.map((a, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 10, alignItems: "flex-start",
                      padding: "0.7rem 0.9rem", borderRadius: 10,
                      background: `${C.success}08`, border: `1px solid ${C.success}20`,
                    }}>
                      <span style={{ color: C.success, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: "0.82rem", color: C.textMid, lineHeight: 1.55 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: TEAM
// ══════════════════════════════════════════════════════════════════════════════
function TeamPage({ setPage }) {
  const [activeTab, setActiveTab] = useState("current");

  // 5 Executive Bodies
  const executives = [
    { initials:"AK", color:C.primary,  name:"Ali Khan",       role:"President",         batch:"SE Batch 2022", bio:"Leading SES with a focus on technical excellence and community growth. Final year SE student passionate about distributed systems, cloud-native architecture, and open-source contributions.", linkedin:"#", github:"#" },
    { initials:"SR", color:C.accent,   name:"Sana Raza",      role:"Vice President",    batch:"SE Batch 2022", bio:"Overseeing all operations and member experience. Strong background in project management, full-stack web development, and building inclusive tech communities at MUET.", linkedin:"#", github:"#" },
    { initials:"HM", color:"#7C3AED",  name:"Hassan Mughal",  role:"General Secretary", batch:"SE Batch 2022", bio:"Manages internal communication, documentation, and coordination between all SES departments. Passionate about developer tooling and automation.", linkedin:"#", github:"#" },
    { initials:"RM", color:"#DB2777",  name:"Rabia Memon",    role:"Treasurer",         batch:"SE Batch 2023", bio:"Handles all financial matters, budgeting, and resource allocation for SES events and activities. Expert in financial planning and accounting.", linkedin:"#", github:"#" },
    { initials:"FS", color:C.warning,  name:"Fatima Siddiqui", role:"Joint Secretary",  batch:"SE Batch 2023", bio:"Assists the General Secretary in administrative tasks and member coordination. Focused on improving internal processes and member engagement.", linkedin:"#", github:"#" },
  ];

  // 8 Different Teams
  const teams = [
    { 
      icon: "💻", 
      color: C.primary, 
      name: "Technical Team",
      desc: "Building projects, conducting code reviews, and maintaining SES infrastructure.",
      lead: { initials: "IB", name: "Ibrahim Bhutto", role: "Tech Lead" },
      members: [
        { initials:"AS", name:"Ahmed Shaikh" },
        { initials:"KA", name:"Khalid Ansari" },
        { initials:"ZA", name:"Zain Ali" },
      ]
    },
    { 
      icon: "🎨", 
      color: "#DB2777", 
      name: "Graphic Design Team",
      desc: "Creating stunning visuals, posters, and brand assets for all SES events.",
      lead: { initials: "OM", name: "Omar Mirza", role: "Design Lead" },
      members: [
        { initials:"HN", name:"Hira Naz" },
        { initials:"SJ", name:"Sameer Junejo" },
      ]
    },
    { 
      icon: "📱", 
      color: C.accent, 
      name: "Media Team",
      desc: "Photography, videography, and capturing memorable moments at all events.",
      lead: { initials: "AM", name: "Ayesha Malik", role: "Media Lead" },
      members: [
        { initials:"FA", name:"Fahad Ahmed" },
        { initials:"NK", name:"Noor Khan" },
        { initials:"RS", name:"Raza Shah" },
      ]
    },
    { 
      icon: "📢", 
      color: "#7C3AED", 
      name: "PR & Marketing Team",
      desc: "Managing outreach, sponsorships, partnerships, and public relations.",
      lead: { initials: "MJ", name: "Maryam Jatoi", role: "PR Lead" },
      members: [
        { initials:"BB", name:"Bilal Brohi" },
        { initials:"SA", name:"Sadia Ahmed" },
      ]
    },
    { 
      icon: "📝", 
      color: C.warning, 
      name: "Content Team",
      desc: "Writing blogs, newsletters, social media posts, and educational content.",
      lead: { initials: "NA", name: "Nadia Ali", role: "Content Lead" },
      members: [
        { initials:"HK", name:"Hassan Khaskheli" },
        { initials:"TA", name:"Taha Ali" },
      ]
    },
    { 
      icon: "🎯", 
      color: C.success, 
      name: "Events Team",
      desc: "Planning, organizing, and executing all SES events and workshops.",
      lead: { initials: "ZA", name: "Zainab Ahmed", role: "Events Head" },
      members: [
        { initials:"YK", name:"Yasir Khan" },
        { initials:"SB", name:"Sara Baloch" },
        { initials:"UA", name:"Usman Ali" },
      ]
    },
    { 
      icon: "🤝", 
      color: "#F59E0B", 
      name: "Mentorship Team",
      desc: "Connecting juniors with seniors and industry professionals for guidance.",
      lead: { initials: "AB", name: "Asad Bhatti", role: "Mentorship Lead" },
      members: [
        { initials:"RN", name:"Rida Naz" },
        { initials:"MH", name:"Moiz Hassan" },
      ]
    },
    { 
      icon: "🌐", 
      color: "#06B6D4", 
      name: "Community Team",
      desc: "Building community engagement, managing Discord, and member activities.",
      lead: { initials: "SB", name: "Sara Baloch", role: "Community Lead" },
      members: [
        { initials:"AH", name:"Ahsan Hussain" },
        { initials:"FM", name:"Fatima Memon" },
      ]
    },
  ];

  const depts = [
    { icon:"💻", color:C.primary,   title:"Technical Wing",  desc:"Organizes workshops, coding sessions, and technical content for all SES events and programs." },
    { icon:"🎨", color:"#DB2777",   title:"Design & Media",  desc:"All visual design, social media graphics, video production, and brand identity." },
    { icon:"📢", color:"#7C3AED",   title:"PR & Marketing",  desc:"Outreach, sponsorships, corporate partnerships, and SES public presence." },
    { icon:"🎯", color:C.success,   title:"Events & Ops",    desc:"Plans and executes all SES events, logistics, and member engagement activities." },
    { icon:"📝", color:C.warning,   title:"Content & Blog",  desc:"Written content, blogs, newsletters, and educational resources for members." },
    { icon:"🤝", color:"#F59E0B",   title:"Mentorship",      desc:"Connects juniors with seniors and industry professionals for guided growth." },
    { icon:"🌐", color:"#06B6D4",   title:"Community",       desc:"Builds community engagement, manages online platforms, and member activities." },
    { icon:"📱", color:C.accent,    title:"Media & Content", desc:"Photography, videography, and social media management for SES." },
  ];

  const pastTeams = [
    {
      year: "2024",
      members: [
        { initials:"RK", color:C.primary,  name:"Raheel Khan",     role:"President" },
        { initials:"AM", color:C.accent,   name:"Amna Mirza",      role:"Vice President" },
        { initials:"TH", color:"#7C3AED", name:"Tariq Hussain",   role:"Secretary" },
        { initials:"SN", color:C.success,  name:"Saima Noor",      role:"Events Head" },
        { initials:"BK", color:"#DB2777", name:"Bilal Khan",      role:"Tech Lead" },
        { initials:"HA", color:C.warning,  name:"Hina Ahmed",      role:"Design Lead" },
      ],
      achievements: [
        "Organized Annual Hackathon 2024 with 100+ participants",
        "Launched mentorship program pairing 60 juniors with seniors",
        "Partnered with 3 tech companies for internship referrals",
        "Grew membership from 300 to 420 students",
        "Hosted 12 technical workshops across the academic year",
      ],
    },
    {
      year: "2023",
      members: [
        { initials:"SK", color:C.primary,  name:"Saad Khan",       role:"President" },
        { initials:"FA", color:C.accent,   name:"Fatima Ali",      role:"Vice President" },
        { initials:"MR", color:"#7C3AED", name:"Moiz Raza",       role:"Secretary" },
        { initials:"ZQ", color:C.success,  name:"Zara Qureshi",    role:"Events Head" },
        { initials:"UJ", color:"#DB2777", name:"Umar Javed",      role:"Tech Lead" },
        { initials:"NG", color:C.warning,  name:"Noor Ghouri",     role:"PR Head" },
      ],
      achievements: [
        "Founded the CodeStorm competitive programming series",
        "Established the SES GitHub organization with 8 repos",
        "Hosted the first inter-university coding competition",
        "Launched SES official website and social media presence",
        "Organized 8 industry guest talks with senior engineers",
      ],
    },
    {
      year: "2022",
      members: [
        { initials:"HQ", color:C.primary,  name:"Hamza Qasim",     role:"President" },
        { initials:"RA", color:C.accent,   name:"Rida Abbas",      role:"Vice President" },
        { initials:"KS", color:"#7C3AED", name:"Kamran Shah",     role:"Secretary" },
        { initials:"NB", color:C.success,  name:"Nadia Baig",      role:"Events Head" },
        { initials:"AB", color:"#DB2777", name:"Asad Bhai",       role:"Tech Lead" },
        { initials:"SM", color:C.warning,  name:"Sara Memon",      role:"Design" },
      ],
      achievements: [
        "Revived SES after COVID-19 with hybrid events model",
        "Re-established connections with alumni network",
        "Organized first post-COVID hackathon with 60 participants",
        "Created SES Discord server with 200+ members",
      ],
    },
    {
      year: "2021",
      members: [
        { initials:"OA", color:C.primary,  name:"Omar Abbasi",     role:"President" },
        { initials:"MB", color:C.accent,   name:"Mariam Baig",     role:"Vice President" },
        { initials:"ZH", color:"#7C3AED", name:"Zubair Hussain",  role:"Secretary" },
        { initials:"SF", color:C.success,  name:"Sadaf Fatima",    role:"Events" },
        { initials:"IA", color:"#DB2777", name:"Irfan Ahmed",     role:"Tech" },
      ],
      achievements: [
        "Founded SES MUET in 2019, formalized structure in 2021",
        "Hosted inaugural SES seminar with 150 attendees",
        "Launched first edition of the programming workshop series",
        "Established constitution and governance framework",
      ],
    },
  ];

  const tabs = [
    { id: "current", label: "Current Team" },
    { id: "past",    label: "Past Teams" },
    { id: "depts",   label: "Departments" },
  ];

  return (
    <>
      {/* ── PAGE HERO ── */}
      <div style={{
        background: bgHeroGrad, padding: "5rem 4rem 0",
        borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden",
      }}>
        {/* decorative grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.primary}06 1px, transparent 1px), linear-gradient(90deg, ${C.primary}06 1px, transparent 1px)`, backgroundSize: "52px 52px" }} />
        <div style={{ position: "absolute", right: -100, top: -80, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.primary}10, transparent)` }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div className="mono" style={{ fontSize: "0.72rem", color: C.textLight, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              <span style={{ color: C.primary, cursor: "pointer" }} onClick={() => setPage("home")}>Home</span>
              <span style={{ margin: "0 8px" }}>/</span>Team
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Eyebrow>The People Behind SES</Eyebrow>
            <h1 className="display" style={{ fontSize: "clamp(2.2rem,4vw,3.8rem)", fontWeight: 900, color: C.darkPrimary, letterSpacing: "-0.035em", marginBottom: "1rem" }}>
              Meet the <Hl>Team</Hl>
            </h1>
            <p style={{ color: C.textMid, maxWidth: 560, lineHeight: 1.85, fontSize: "1.02rem", marginBottom: "2.5rem" }}>
              Passionate students who dedicate their time and energy to make SES MUET what it is — a community that genuinely cares about your growth.
            </p>
          </Reveal>

          {/* Stats bar */}
          <Reveal delay={0.15}>
            <div style={{ display: "flex", gap: "2.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              {[["5","Executive Bodies"],["8","Teams"],["80+","Alumni"],["25+","Active Members"]].map(([num, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 3, height: 36, background: `linear-gradient(${C.primary}, ${C.accent})`, borderRadius: 2 }} />
                  <div>
                    <div className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: C.darkPrimary, lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: "0.75rem", color: C.textLight, marginTop: 2 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Tab nav */}
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem",
                padding: "0.85rem 1.8rem", border: "none", cursor: "pointer",
                background: "none", position: "relative", transition: "color .2s",
                color: activeTab === t.id ? C.primary : C.textLight,
                borderBottom: `2.5px solid ${activeTab === t.id ? C.primary : "transparent"}`,
                marginBottom: -1,
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 4rem 5rem" }}>

        {/* ── CURRENT TEAM TAB ── */}
        {activeTab === "current" && (
          <>
            {/* Leadership flip cards */}
            <div style={{ marginBottom: "1rem" }}><Eyebrow>Executive Council</Eyebrow></div>
            <Reveal><SectionTitle style={{ marginBottom: "0.5rem" }}>Leadership <Hl>Council</Hl></SectionTitle></Reveal>
            <Reveal delay={0.05}><p style={{ color: C.textLight, fontSize: "0.85rem", marginBottom: "2.5rem" }}>Click any card to learn more ↓</p></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "1.2rem", marginBottom: "5rem" }}>
              {executives.map((l, i) => <ExecutiveCard key={i} member={l} index={i} />)}
            </div>

            {/* Teams Section */}
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, marginBottom: "3.5rem" }} />
            <div style={{ marginBottom: "1rem" }}><Eyebrow>Specialized Teams</Eyebrow></div>
            <Reveal><SectionTitle style={{ marginBottom: "0.5rem" }}>Our <Hl>Teams</Hl></SectionTitle></Reveal>
            <Reveal delay={0.05}><p style={{ color: C.textLight, fontSize: "0.85rem", marginBottom: "2.5rem" }}>8 specialized teams working together to make SES great</p></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.5rem", marginBottom: "5rem" }}>
              {teams.map((t, i) => <TeamCard key={i} team={t} index={i} />)}
            </div>

            {/* Join CTA */}
            <Reveal>
              <div style={{
                background: primaryGrad, borderRadius: 20, padding: "3rem",
                textAlign: "center", position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.accent}25 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🚀</div>
                  <h3 className="display" style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem" }}>Want to join the team?</h3>
                  <p style={{ color: "rgba(255,255,255,.75)", marginBottom: "1.5rem", maxWidth: 440, margin: "0 auto 1.5rem" }}>We recruit new team members every semester. Open to all MUET SE students with passion and drive.</p>
                  <Btn variant="white" onClick={() => setPage("contact")}>Apply to Join Team →</Btn>
                </div>
              </div>
            </Reveal>
          </>
        )}

        {/* ── PAST TEAMS TAB ── */}
        {activeTab === "past" && (
          <>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <div>
                  <Eyebrow>Alumni & Legacy</Eyebrow>
                  <SectionTitle>Past <Hl>Teams</Hl></SectionTitle>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <p style={{ color: C.textMid, fontSize: "1rem", lineHeight: 1.8, maxWidth: 600, marginBottom: "3rem" }}>
                Every great organization is built on the shoulders of those who came before. Honoring the teams that shaped SES MUET into what it is today.
              </p>
            </Reveal>

            {/* Timeline indicator */}
            <Reveal delay={0.1}>
              <div style={{
                display: "flex", alignItems: "center", gap: 0,
                marginBottom: "3rem", overflowX: "auto", paddingBottom: 8,
              }}>
                {pastTeams.map((t, i) => (
                  <div key={t.year} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${C.primary}25, ${C.primary}08)`,
                      border: `2px solid ${C.primary}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
                      fontWeight: 700, color: C.primary,
                    }}>{t.year}</div>
                    {i < pastTeams.length - 1 && (
                      <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${C.primary}40, ${C.primary}15)` }} />
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${C.primary}15, transparent)` }} />
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: C.textLight }}>Today</div>
                </div>
              </div>
            </Reveal>

            {/* Accordion cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {pastTeams.map((t, i) => (
                <PastTeamCard key={t.year} year={t.year} members={t.members} achievements={t.achievements} index={i} />
              ))}
            </div>

            {/* Tribute banner */}
            <Reveal delay={0.1} style={{ marginTop: "3rem" }}>
              <div style={{
                background: `linear-gradient(135deg, ${C.primary}08, ${C.accent}06)`,
                border: `1px solid ${C.primary}20`, borderRadius: 16,
                padding: "2rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏅</div>
                <h4 className="display" style={{ fontSize: "1.2rem", fontWeight: 800, color: C.darkPrimary, marginBottom: "0.4rem" }}>Standing on the Shoulders of Giants</h4>
                <p style={{ fontSize: "0.88rem", color: C.textMid, maxWidth: 480, margin: "0 auto" }}>
                  Every SES achievement today was made possible by the alumni who built the foundation. We are grateful for their service and dedication.
                </p>
              </div>
            </Reveal>
          </>
        )}

        {/* ── DEPARTMENTS TAB ── */}
        {activeTab === "depts" && (
          <>
            <Reveal>
              <div style={{ marginBottom: "1rem" }}><Eyebrow>Structure</Eyebrow></div>
              <SectionTitle style={{ marginBottom: "0.8rem" }}>Our <Hl>Departments</Hl></SectionTitle>
            </Reveal>
            <Reveal delay={0.06}>
              <p style={{ color: C.textMid, fontSize: "1rem", lineHeight: 1.8, maxWidth: 580, marginBottom: "3rem" }}>
                SES operates across 8 specialized departments, each led by dedicated team members with a clear mission.
              </p>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.2rem", marginBottom: "4rem" }}>
              {depts.map((d, i) => <DeptCard key={i} dept={d} index={i} />)}
            </div>

            {/* How departments work together */}
            <Reveal delay={0.1}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "2.5rem", marginBottom: "2rem" }}>
                <div style={{ marginBottom: "1rem" }}><Eyebrow>Collaboration</Eyebrow></div>
                <SectionTitle style={{ fontSize: "1.6rem", marginBottom: "1.5rem" }}>How Departments <Hl>Collaborate</Hl></SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
                  {[
                    { icon:"🔄", title:"Weekly Syncs", desc:"All department heads meet weekly to align on upcoming events, share updates, and resolve blockers." },
                    { icon:"📋", title:"Shared Roadmap", desc:"One unified semester roadmap maintained by the secretary keeps everyone aligned on priorities." },
                    { icon:"🎯", title:"Joint Ownership", desc:"Major events are co-owned by multiple departments — ensuring quality and collective investment." },
                  ].map((c, i) => (
                    <div key={i} style={{ textAlign: "center", padding: "1.5rem" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{c.icon}</div>
                      <div className="display" style={{ fontWeight: 700, fontSize: "0.95rem", color: C.darkPrimary, marginBottom: "0.4rem" }}>{c.title}</div>
                      <div style={{ fontSize: "0.82rem", color: C.textLight, lineHeight: 1.7 }}>{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ textAlign: "center" }}>
                <Btn variant="primary" onClick={() => setPage("contact")}>Join a Department →</Btn>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: CONTACT / JOIN
// ══════════════════════════════════════════════════════════════════════════════
function ContactPage({ setPage }) {
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", batch:"", dept:"", message:"" });
  const [sent, setSent] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ firstName:"", lastName:"", email:"", batch:"", dept:"", message:"" });
  };

  const inputStyle = {
    width:"100%", background:C.bg, border:`1.5px solid ${C.border}`,
    borderRadius:10, padding:"0.75rem 1rem",
    fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:"0.92rem",
    color:C.textDark, outline:"none", transition:"border-color .25s",
  };

  return (
    <>
      <div style={{ background:bgHeroGrad, padding:"5rem 4rem 4rem", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="mono" style={{ fontSize:"0.72rem", color:C.textLight, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1.5rem" }}>
            <span style={{ color:C.primary, cursor:"pointer" }} onClick={() => setPage("home")}>Home</span>
            <span style={{ margin:"0 8px" }}>/</span>Contact
          </div>
          <Eyebrow>Get In Touch</Eyebrow>
          <h1 className="display" style={{ fontSize:"clamp(2.2rem,4vw,3.8rem)", fontWeight:900, color:C.darkPrimary, letterSpacing:"-0.035em", marginBottom:"1rem" }}>
            Join <Hl>SES MUET</Hl>
          </h1>
          <p style={{ color:C.textMid, maxWidth:540, lineHeight:1.85, fontSize:"1.02rem" }}>Membership is free and open to all MUET students. Fill out the form and we'll be in touch within 48 hours.</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"5rem 4rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:"5rem", alignItems:"start" }}>
          {/* Left info */}
          <div>
            <h2 className="display" style={{ fontSize:"1.6rem", fontWeight:800, color:C.darkPrimary, marginBottom:"0.5rem" }}>Why Join SES?</h2>
            <p style={{ color:C.textMid, lineHeight:1.85, marginBottom:"2rem", fontSize:"0.95rem" }}>Be part of a community that actively shapes your career. Here's what you unlock as a member:</p>
            {[
              { icon:"🎯", title:"Access to All Events", desc:"Hackathons, workshops, and talks — all free for members." },
              { icon:"🧠", title:"Mentorship", desc:"Get paired with seniors and industry professionals." },
              { icon:"🤝", title:"Network", desc:"Connect with 500+ peers and alumni in top tech companies." },
              { icon:"📜", title:"Certificate", desc:"Official SES membership certificate for your resume." },
              { icon:"💼", title:"Career Support", desc:"Resume reviews, mock interviews, and referrals." },
            ].map((b, i) => (
              <div key={i} style={{ display:"flex", gap:"1rem", alignItems:"flex-start", marginBottom:"1.2rem", padding:"0.8rem", borderRadius:10, transition:"all .25s" }}
                onMouseEnter={e => e.currentTarget.style.background=`${C.primary}07`}
                onMouseLeave={e => e.currentTarget.style.background="none"}>
                <div style={{ width:38, height:38, borderRadius:9, background:`${C.primary}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:"0.9rem", color:C.darkPrimary, marginBottom:2 }}>{b.title}</div>
                  <div style={{ fontSize:"0.8rem", color:C.textLight, lineHeight:1.6 }}>{b.desc}</div>
                </div>
              </div>
            ))}

            {/* Contact info */}
            <div style={{ marginTop:"2rem", padding:"1.5rem", background:C.surface, border:`1px solid ${C.border}`, borderRadius:14 }}>
              <div className="mono" style={{ fontSize:"0.65rem", color:C.textLight, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"1rem" }}>Direct Contact</div>
              {[["📧","Email","ses@muet.edu.pk"],["📍","Location","MUET, Jamshoro, Sindh"],["⏰","Response Time","Within 48 hours"]].map(([icon,label,val]) => (
                <div key={label} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:"0.7rem" }}>
                  <span style={{ fontSize:"1rem" }}>{icon}</span>
                  <div>
                    <div className="mono" style={{ fontSize:"0.6rem", color:C.textLight, textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</div>
                    <div style={{ fontSize:"0.85rem", color:C.textDark, fontWeight:500 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:"2.5rem", boxShadow:"0 4px 24px rgba(30,136,229,.08)" }}>
            {sent ? (
              <div style={{ textAlign:"center", padding:"3rem 0" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
                <h3 className="display" style={{ fontSize:"1.4rem", fontWeight:800, color:C.darkPrimary, marginBottom:"0.5rem" }}>Application Submitted!</h3>
                <p style={{ color:C.textMid }}>We'll get back to you within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handle}>
                <h3 className="display" style={{ fontSize:"1.3rem", fontWeight:800, color:C.darkPrimary, marginBottom:"1.5rem" }}>Membership Application</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
                  {[["firstName","First Name","Ali"],["lastName","Last Name","Khan"]].map(([k,l,ph]) => (
                    <div key={k}>
                      <label style={{ display:"block", marginBottom:6, fontSize:"0.78rem", fontWeight:600, color:C.textMid }}>{l}</label>
                      <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]:e.target.value }))} placeholder={ph} required style={inputStyle}
                        onFocus={e => e.target.style.borderColor=C.primary}
                        onBlur={e => e.target.style.borderColor=C.border} />
                    </div>
                  ))}
                </div>
                {[["email","MUET Email","21sw001@st.muet.edu.pk","email"]].map(([k,l,ph,type]) => (
                  <div key={k} style={{ marginBottom:"1rem" }}>
                    <label style={{ display:"block", marginBottom:6, fontSize:"0.78rem", fontWeight:600, color:C.textMid }}>{l}</label>
                    <input type={type} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]:e.target.value }))} placeholder={ph} required style={inputStyle}
                      onFocus={e => e.target.style.borderColor=C.primary}
                      onBlur={e => e.target.style.borderColor=C.border} />
                  </div>
                ))}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
                  <div>
                    <label style={{ display:"block", marginBottom:6, fontSize:"0.78rem", fontWeight:600, color:C.textMid }}>Batch Year</label>
                    <select value={form.batch} onChange={e => setForm(f => ({ ...f, batch:e.target.value }))} required style={{ ...inputStyle, cursor:"pointer", appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23718096' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 1rem center" }}
                      onFocus={e => e.target.style.borderColor=C.primary}
                      onBlur={e => e.target.style.borderColor=C.border}>
                      <option value="">Select batch</option>
                      {[2021,2022,2023,2024,2025].map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:"block", marginBottom:6, fontSize:"0.78rem", fontWeight:600, color:C.textMid }}>Department</label>
                    <select value={form.dept} onChange={e => setForm(f => ({ ...f, dept:e.target.value }))} required style={{ ...inputStyle, cursor:"pointer", appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23718096' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 1rem center" }}
                      onFocus={e => e.target.style.borderColor=C.primary}
                      onBlur={e => e.target.style.borderColor=C.border}>
                      <option value="">Select dept.</option>
                      <option>Software Engineering</option>
                      <option>Computer Systems</option>
                      <option>Information Technology</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom:"1.5rem" }}>
                  <label style={{ display:"block", marginBottom:6, fontSize:"0.78rem", fontWeight:600, color:C.textMid }}>Why do you want to join?</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} rows={4} placeholder="Tell us what excites you about SES..." style={{ ...inputStyle, resize:"vertical", lineHeight:1.65 }}
                    onFocus={e => e.target.style.borderColor=C.primary}
                    onBlur={e => e.target.style.borderColor=C.border} />
                </div>
                <Btn variant="primary" style={{ width:"100%", justifyContent:"center" }}>
                  Submit Application
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Btn>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  useGlobalStyle();
  const [page, setPage] = useState("home");
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const pages = { home:HomePage, events:EventsPage, programs:ProgramsPage, team:TeamPage, contact:ContactPage };
  const PageComponent = pages[page] || HomePage;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Navbar page={page} setPage={setPage} />
      <main style={{ flex:1, paddingTop:68 }}>
        <PageComponent setPage={setPage} />
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
