import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { ProposalProps } from '../types';

export const ProposalCard: React.FC<ProposalProps> = ({ onAccept }) => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [hoverCount, setHoverCount] = useState(0);
  const [mascot, setMascot] = useState("🐻"); // Default cute bear

  // Messages shown when trying to hover the "No" button
  const funMessages = [
    "Are you sure?",
    "Think again!",
    "Pretty please?",
    "Don't break my heart!",
    "I'll give you chocolate!",
    "Last chance!",
    "You can't catch me!",
    "Okay, just click Yes!"
  ];

  const currentMessage = funMessages[Math.min(hoverCount, funMessages.length - 1)];

  const moveNoButton = () => {
    const x = (Math.random() - 0.5) * 250;
    const y = (Math.random() - 0.5) * 250;
    setNoButtonPosition({ x, y });
    setYesScale(prev => Math.min(prev + 0.1, 2.5)); // Grow the yes button
    setHoverCount(prev => prev + 1);
    setMascot(hoverCount > 3 ? "😭" : "🥺"); // Cry if they keep trying to say no
  };

  const resetMascot = () => {
    setMascot("🐻");
  };

  const happyMascot = () => {
    setMascot("🥰");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-[2rem] shadow-xl text-center max-w-lg w-full relative border-4 border-white/50"
      >
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20">
            <motion.div
                animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-9xl filter drop-shadow-xl cursor-default"
                role="img" 
                aria-label="Cute mascot"
            >
                {mascot}
            </motion.div>
        </div>

        <h1 className="font-handwriting text-5xl md:text-6xl text-valentine-600 mt-12 mb-4 leading-tight drop-shadow-sm">
          Will you be my Valentine?
        </h1>
        
        <p className="text-valentine-800 text-lg mb-8 font-sans font-medium bg-white/40 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
            I promise to buy you food and tell you you're pretty 🥺👉👈
        </p>

        {/* Removed fixed height and absolute positioning to ensure No button is always visible */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center relative min-h-[160px] md:min-h-[120px]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={happyMascot}
            onMouseLeave={resetMascot}
            onClick={onAccept}
            style={{ scale: yesScale }}
            className="bg-gradient-to-r from-valentine-400 to-valentine-500 hover:from-valentine-500 hover:to-valentine-600 text-white font-bold py-4 px-10 rounded-full shadow-lg text-2xl flex items-center gap-2 transition-all z-20 ring-4 ring-valentine-200 order-1"
          >
            <Heart className="fill-current w-8 h-8 animate-pulse" /> YES!
          </motion.button>

          <motion.div
            animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="z-10 order-2"
          >
            <button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton} // For mobile support
              className="bg-white hover:bg-gray-50 text-valentine-800 font-bold py-3 px-8 rounded-full shadow-md text-xl flex items-center gap-2 transition-colors cursor-pointer border-2 border-gray-200"
            >
              <X className="w-5 h-5" /> No
            </button>
          </motion.div>
        </div>

        {hoverCount > 0 && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }}
             key={hoverCount}
             className="absolute bottom-2 left-0 right-0"
           >
             <p className="text-valentine-500 font-bold font-handwriting text-2xl">
               {currentMessage}
             </p>
           </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};