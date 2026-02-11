import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DatePlanner } from './DatePlanner';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SuccessView: React.FC = () => {
    
  useEffect(() => {
    // Heart confetti shower logic
    const duration = 3000;
    const end = Date.now() + duration;

    try {
        const interval = setInterval(function() {
            if (Date.now() > end) {
                return clearInterval(interval);
            }
            
            // Left side burst
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                shapes: ['heart'],
                colors: ['#ff0000', '#ff69b4', '#e11d48']
            });
            // Right side burst
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                shapes: ['heart'],
                colors: ['#ff0000', '#ff69b4', '#e11d48']
            });
        }, 150);

        return () => clearInterval(interval);
    } catch (e) {
        console.error("Confetti error", e);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center max-w-4xl animate-in fade-in duration-1000">
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
        className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-2xl text-center w-full border-4 border-white/60 mb-10 relative overflow-hidden bg-gradient-to-b from-white/90 to-pink-50/90"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 text-valentine-200"
            >
                <Sparkles size={200} />
            </motion.div>
             <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 text-valentine-200"
            >
                <Sparkles size={180} />
            </motion.div>
        </div>
        
        <motion.div
            initial={{ scale: 0 }}
            animate={{ 
                scale: 1, 
                rotate: [0, -10, 10, 0] 
            }}
            transition={{ 
                delay: 0.3,
                scale: { type: "spring", stiffness: 200 },
                rotate: { duration: 0.5, ease: "easeInOut", type: "tween" }
            }}
            className="text-9xl mb-6 filter drop-shadow-xl inline-block relative z-10"
        >
            🥰
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10"
        >
            <h1 className="font-handwriting text-6xl md:text-8xl text-valentine-600 mb-6 leading-tight drop-shadow-sm">
            YAAAY!!! <br/> 
            <span className="text-valentine-400 text-5xl md:text-6xl">Best. Day. Ever.</span>
            </h1>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/50 inline-block shadow-sm">
                <p className="text-xl md:text-2xl text-gray-700 font-sans leading-relaxed max-w-2xl mx-auto">
                You just made me the happiest person in the universe! 🌎✨ <br/>
                <span className="font-bold text-valentine-500 block mt-2 text-3xl font-handwriting">I love you so much!</span>
                </p>
            </div>
        </motion.div>

        <motion.div 
            className="flex justify-center gap-6 mt-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
        >
           {[0, 1, 2].map((i) => (
               <motion.div
                 key={i}
                 animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.2, 1]
                 }}
                 transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut" 
                 }}
               >
                 <Heart className="w-12 h-12 text-valentine-500 fill-valentine-400 drop-shadow-md" />
               </motion.div>
           ))}
        </motion.div>
      </motion.div>

      <DatePlanner />
    </div>
  );
};