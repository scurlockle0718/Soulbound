import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X } from 'lucide-react';

interface EpilogueScreenProps {
  onClose: () => void;
  epilogueText?: string;
}

export function EpilogueScreen({ onClose, epilogueText }: EpilogueScreenProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

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
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0f0f1e] flex flex-col items-center justify-center overflow-hidden"
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
        className="absolute top-8 right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 z-50"
      >
        <X className="w-5 h-5 text-white/80" />
      </motion.button>

      {/* Tap to continue hint */}
      {currentPhase < sections.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-sm pointer-events-none"
        >
          Tap to continue
        </motion.div>
      )}

      {/* Content - Scrollable */}
      <div className="relative z-10 w-full max-w-[380px] px-8 h-full flex items-center justify-center overflow-y-auto">
        <div className="py-20">
          <AnimatePresence mode="wait">
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
                    <h2 className="text-[#f5a623] text-2xl tracking-widest mb-4 whitespace-pre-wrap">
                      {section}
                    </h2>
                  ) : (
                    <p className="text-[#e8e8e8] leading-relaxed whitespace-pre-wrap">
                      {section}
                    </p>
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
