import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingHeart {
  id: number;
  x: number;
  scale: number;
  duration: number;
  delay: number;
}

export const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // Create random hearts for background
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // Random percentage for left position
      scale: 0.5 + Math.random() * 1, // Random size
      duration: 10 + Math.random() * 20, // Random duration between 10s and 30s
      delay: Math.random() * 10, // Random delay
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', x: `${heart.x}vw`, opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.8, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            scale: heart.scale
          }}
        >
          <Heart 
            className="text-valentine-300 fill-valentine-200" 
            size={40} 
            strokeWidth={1}
          />
        </motion.div>
      ))}
    </div>
  );
};