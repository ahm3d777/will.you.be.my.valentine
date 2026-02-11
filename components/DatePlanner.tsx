import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Loader2, CheckCircle, Heart } from 'lucide-react';
import { generateDateIdeas } from '../services/geminiService';
import { DateIdea } from '../types';
import confetti from 'canvas-confetti';

export const DatePlanner: React.FC = () => {
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const results = await generateDateIdeas();
    setIdeas(results);
    setLoading(false);
    setGenerated(true);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#a7f3d0', '#fbbf24']
    });
  };

  // Rotations for the sticky note effect
  const rotations = [-2, 1, -1, 2];

  return (
    <div className="w-full max-w-2xl">
      {!generated ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="group bg-white text-valentine-600 hover:bg-valentine-50 border-4 border-valentine-200 font-bold py-6 px-10 rounded-full shadow-xl text-xl flex items-center gap-3 mx-auto transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed hover:rotate-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-8 h-8 text-valentine-400" />
            ) : (
              <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 group-hover:animate-spin" />
            )}
            <span className="font-handwriting text-3xl">
                {loading ? "Asking Cupid..." : "Plan Our Date!"}
            </span>
          </button>
          {loading && (
             <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="mt-4 text-valentine-500 font-handwriting text-xl"
             >
                Cooking up something sweet... 🥞
             </motion.p>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
            <h2 className="text-3xl font-handwriting text-valentine-700 text-center mb-6 bg-white/60 px-6 py-2 rounded-full shadow-sm inline-block border border-white">
                ✨ Pick a vibe for us ✨
            </h2>
            
            <div className="grid gap-6 md:grid-cols-1 w-full">
            {ideas.map((idea, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.8, rotate: rotations[index % rotations.length] * 5 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: rotations[index % rotations.length] }}
                    transition={{ 
                      delay: index * 0.2, 
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
                    className="bg-white/90 p-6 rounded-2xl flex items-center gap-5 shadow-lg border-2 border-pink-100 transform transition-transform cursor-pointer group"
                >
                    <div className="text-5xl bg-valentine-100 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                        {idea.emoji}
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="font-handwriting font-bold text-valentine-800 text-3xl mb-1">{idea.title}</h3>
                        <p className="text-gray-600 font-sans leading-relaxed">{idea.description}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 text-valentine-400">
                        <Heart className="fill-current w-6 h-6 animate-bounce" />
                    </div>
                </motion.div>
            ))}
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ideas.length * 0.2 + 0.5 }}
                className="text-center mt-10 flex flex-col items-center gap-6 w-full"
            >
                {!confirmed && (
                  <div className="w-full max-w-sm mx-auto p-5 bg-white/60 rounded-3xl backdrop-blur-md border-2 border-white shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3 relative z-10">
                       <span className="text-valentine-800 font-handwriting text-2xl font-bold">Excitement Meter</span>
                       <motion.span 
                         animate={{ scale: [1, 1.4, 1], rotate: [0, 20, -20, 0] }} 
                         transition={{ duration: 1, repeat: Infinity }}
                         className="text-2xl"
                       >
                         💖
                       </motion.span>
                    </div>
                    
                    <div className="h-6 bg-valentine-100 rounded-full overflow-hidden shadow-inner border border-valentine-200 relative z-10">
                       <motion.div
                         className="h-full bg-gradient-to-r from-pink-300 via-valentine-400 to-red-400"
                         initial={{ width: "0%" }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 8, ease: "easeInOut" }}
                       />
                       <motion.div
                            className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       />
                    </div>
                    
                    <motion.p 
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-sm text-valentine-600 mt-3 font-bold font-sans tracking-wide relative z-10"
                    >
                        Please say yes to the date too! 👉👈
                    </motion.p>

                    {/* Background decorations for the card */}
                    <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 rotate-12">💋</div>
                    <div className="absolute -top-4 -left-4 text-6xl opacity-10 -rotate-12">💌</div>
                  </div>
                )}

                {!confirmed ? (
                   <motion.button 
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleConfirm}
                     className="bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-5 px-12 rounded-full shadow-xl text-2xl flex items-center gap-3 mx-auto transition-all z-10 ring-4 ring-green-100"
                   >
                     <Calendar className="w-8 h-8" /> 
                     <span className="font-handwriting">Let's Do It!</span>
                   </motion.button>
                ) : (
                   <motion.div
                     initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                     animate={{ scale: 1, opacity: 1, rotate: 0 }}
                     type="spring"
                     className="bg-white p-8 rounded-[2rem] inline-block border-4 border-green-200 shadow-2xl relative"
                   >
                     <p className="text-green-500 font-bold text-4xl flex items-center gap-3 justify-center font-handwriting mb-2">
                        Yay! It's a Date! <CheckCircle className="w-10 h-10 fill-green-100" />
                     </p>
                     <p className="text-gray-500 text-lg font-sans">I'll pick you up! Get ready! 🚗💨</p>
                     
                     <motion.div 
                        className="absolute -top-4 -right-4 text-5xl"
                        animate={{ rotate: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                     >
                        🥳
                     </motion.div>
                   </motion.div>
                )}
            </motion.div>
        </motion.div>
      )}
    </div>
  );
};