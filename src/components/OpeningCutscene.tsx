import { useState, useEffect } from 'react';

interface OpeningCutsceneProps {
  onComplete: () => void;
  prologueText?: string;
  prologueMusicUrl?: string;
  isRewatch?: boolean;
}

export function OpeningCutscene({ onComplete, prologueText, prologueMusicUrl, isRewatch = false }: OpeningCutsceneProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  console.log('🎬 OpeningCutscene mounted - isRewatch:', isRewatch);

  // Default prologue if none provided
  const defaultPrologue = `Welcome to a Co-Op Journey Written in the Language of Stars.

In a quiet corner of the world, two travelers meet—not at the end of a quest, but at the beginning of one. The path ahead is stitched with lanternlight cafés, hidden bookshops, neon arcades, and the quiet hush of forest trails.

This record is not a duty, nor a binding oath—
but a remembrance of shared wonder.

Let the journey begin.`;

  const prologue = prologueText || defaultPrologue;
  const sections = prologue.split('\n\n').filter(s => s.trim());

  const handleClick = () => {
    if (currentPhase < sections.length + 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      // Only set localStorage flag if this is the first watch, not a rewatch
      if (!isRewatch) {
        localStorage.setItem('soulbound_seen_cutscene', 'true');
      }
      onComplete();
    }
  };

  const handleSkip = () => {
    // Only set localStorage flag if this is the first watch, not a rewatch
    if (!isRewatch) {
      localStorage.setItem('soulbound_seen_cutscene', 'true');
    }
    onComplete();
  };

  return (
    <div 
      onClick={handleClick}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'linear-gradient(to bottom, #0a0a1a, #1a1a2e, #0f0f1e)',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: '20px',
        overflow: 'hidden'
      }}
    >
      {/* Animated stars background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none'
      }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: 'white',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${3 + Math.random() * 2}s infinite`
            }}
          />
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        Skip
      </button>

      {/* Tap to continue hint */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px',
        pointerEvents: 'none'
      }}>
        Tap to continue
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Title - always shows first */}
        {currentPhase >= 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              color: '#e6be8a',
              fontSize: '48px',
              fontFamily: 'serif',
              letterSpacing: '4px',
              marginBottom: '10px',
              textShadow: '0 0 20px rgba(230, 190, 138, 0.5)'
            }}>
              Soulbound
            </h1>
            <div style={{
              width: '120px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, #e6be8a, transparent)',
              margin: '0 auto'
            }} />
          </div>
        )}

        {/* Prologue sections */}
        <div style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {sections.map((section, index) => (
            currentPhase === index + 1 && (
              <p
                key={index}
                style={{
                  color: '#e8e8e8',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  fontStyle: section.includes('Let the journey begin') || section.includes('remembrance') ? 'italic' : 'normal',
                  opacity: 1,
                  animation: 'fadeIn 0.8s ease-in-out'
                }}
              >
                {section}
              </p>
            )
          ))}
        </div>
      </div>

      {/* Music player */}
      {prologueMusicUrl && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '8px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <iframe
            src={prologueMusicUrl}
            width="0"
            height="0"
            style={{ display: 'none' }}
            allow="autoplay"
          />
          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>♪</span>
        </div>
      )}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}