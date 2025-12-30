import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

interface OpeningCutsceneProps {
  onComplete: () => void;
  prologueText?: string;
  prologueMusicUrl?: string;
}

export function OpeningCutscene({ onComplete, prologueText, prologueMusicUrl }: OpeningCutsceneProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Default prologue if none provided
  const defaultPrologue = `Welcome to a Co-Op Journey Written in the Language of Stars.

In a quiet corner of the world, two travelers meet—not at the end of a quest, but at the beginning of one. The path ahead is stitched with lanternlight cafés, hidden bookshops, neon arcades, and the quiet hush of forest trails.

This record is not a duty, nor a binding oath—
but a remembrance of shared wonder.

Let the journey begin.`;

  const prologue = prologueText || defaultPrologue;

  // Split prologue into sections by double line breaks
  const sections = prologue.split('\n\n').filter(s => s.trim());

  const handleClick = () => {
    if (currentPhase < sections.length + 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      localStorage.setItem('soulbound_seen_cutscene', 'true');
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('soulbound_seen_cutscene', 'true');
    onComplete();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current) {
      iframeRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div 
      className="min-h-screen w-full z-[100] bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f1e] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer p-4"
      onClick={handleClick}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 z-50"
      >
        <span className="text-white/80 text-xs sm:text-sm">Skip</span>
        <SkipForward className="w-4 h-4 text-white/80" />
      </motion.button>

      {/* Tap to continue hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center text-white/50 text-xs sm:text-sm pointer-events-none"
      >
        Tap to continue
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-4 sm:px-8 text-center space-y-6 sm:space-y-8">
        {/* Title - always shows first */}
        <AnimatePresence mode="wait">
          {currentPhase >= 0 && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-[#e6be8a] text-4xl sm:text-5xl tracking-wider mb-2" style={{ fontFamily: 'serif' }}>
                Soulbound
              </h1>
              <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#e6be8a] to-transparent mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prologue sections */}
        <div className="min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {sections.map((section, index) => (
              currentPhase === index + 1 && (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className={`text-[#e8e8e8] text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                    section.includes('Let the journey begin') || section.includes('remembrance') 
                      ? 'italic text-base sm:text-lg' 
                      : ''
                  }`}
                >
                  {section}
                </motion.p>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Music player */}
      {prologueMusicUrl && (
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 z-50">
          <iframe
            ref={iframeRef}
            src={prologueMusicUrl}
            width="0"
            height="0"
            style={{ display: 'none' }}
            allow="autoplay"
          />
          <button onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-white/80" />}
          </button>
        </div>
      )}
    </div>
  );
}