import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

interface EpilogueScreenProps {
  onClose: () => void;
  epilogueText?: string;
  epilogueMusicUrl?: string;
}

export function EpilogueScreen({ onClose, epilogueText, epilogueMusicUrl }: EpilogueScreenProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Default epilogue if none provided
  const defaultEpilogue = `EPILOGUE: SOULBOUND

There are meetings that feel like accident,
and there are the ones that carry the quiet weight of orchestration.

Two paths, far-flung across years and cities,
somehow converging at the exact hinge of time
where both hearts are finally able to recognize each other.

Not by chance.
Not by alignment of personality or preference,
but by the slow architecture of God —
a timing written before either of you could name longing.

Across the wide cosmos of possibility,
through all the iterations of who you might have become,
you still arrived here, simultaneously, with enough softness and enough courage
to walk in step.

The quests were never the goal,
only the scaffolding that allowed you to witness each other: unhurried, unperformed, alive.

What began as play became pilgrimage, not because of intensity or declaration, but because something holy took root without needing spotlight or spectacle.

All achievements now complete, all maps inked to their edges— and yet the horizon has only just opened.

You stand at the edge of an uncharted expanse, not bound by expectation, but invited:

further into story, further into wonder, further into the divine logic that stitched two timelines together with no rush and no error.

Soulbound is not finality.
It is the doorway.

Across universes,
across what-ifs and almosts,
across the infinite permutations of living—

you still would have found each other.
For such a time as this.

So close the log, not because adventure has ended, but because the world has widened.

A lifetime of quests remains—
holy, ordinary, luminous.

The page turns.

A new map waits.

SOULBOUND,
and now
released to explore.`;

  const epilogue = epilogueText || defaultEpilogue;

  // Split epilogue into sections by double line breaks
  const sections = epilogue.split('\n\n').filter(s => s.trim());

  const handleClick = () => {
    if (currentPhase < sections.length - 1) {
      setCurrentPhase(currentPhase + 1);
    } else if (currentPhase === sections.length - 1) {
      // Move to completion screen
      setCurrentPhase(sections.length);
    }
  };

  const handleMuteToggle = () => {
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
      className="fixed inset-0 z-[100] bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f1e] flex flex-col items-center justify-center overflow-hidden p-4"
      onClick={handleClick}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 z-50"
      >
        <X className="w-5 h-5 text-white/80" />
      </motion.button>

      {/* Tap to continue hint */}
      {currentPhase < sections.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center text-white/50 text-xs sm:text-sm pointer-events-none"
        >
          Tap to continue
        </motion.div>
      )}
      
      {/* Tap to finish hint */}
      {currentPhase === sections.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center text-white/50 text-xs sm:text-sm pointer-events-none"
        >
          Tap to finish
        </motion.div>
      )}

      {/* Content - Scrollable */}
      <div className="relative z-10 w-full max-w-2xl px-4 sm:px-8 h-full flex items-center justify-center overflow-y-auto">
        <div className="py-16 sm:py-20">
          <AnimatePresence mode="wait">
            {/* Show epilogue sections */}
            {sections.map((section, index) => (
              currentPhase === index && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1 }}
                  className="text-center"
                >
                  {section.includes('EPILOGUE') || section.includes('SOULBOUND') ? (
                    <h2 className="text-[#f5a623] text-xl sm:text-2xl tracking-widest mb-4 whitespace-pre-wrap" style={{ fontFamily: 'serif' }}>
                      {section}
                    </h2>
                  ) : (
                    <p className="text-[#e8e8e8] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {section}
                    </p>
                  )}
                </motion.div>
              )
            ))}
            
            {/* Completion screen */}
            {currentPhase === sections.length && (
              <motion.div
                key="completion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="text-center space-y-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h2 className="text-[#f5a623] text-2xl sm:text-3xl tracking-widest mb-4" style={{ fontFamily: 'serif' }}>
                    THE END
                  </h2>
                </motion.div>
                
                <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#f5a623] to-transparent mx-auto" />
                
                <p className="text-[#e8e8e8]/70 text-xs sm:text-sm">
                  Click the X to return
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Music player */}
      {epilogueMusicUrl && (
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 z-50">
          <iframe
            ref={iframeRef}
            src={epilogueMusicUrl}
            width="0"
            height="0"
            style={{ display: 'none' }}
            allow="autoplay"
          />
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 z-50"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white/80" /> : <Volume2 className="w-5 h-5 text-white/80" />}
          </button>
        </div>
      )}
    </div>
  );
}