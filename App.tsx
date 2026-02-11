import React, { useState, useEffect } from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { ProposalCard } from './components/ProposalCard';
import { SuccessView } from './components/SuccessView';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#f43f5e', '#fda4af', '#ffe4e6'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-200">
      <FloatingHearts />
      
      <main className="relative z-10 w-full max-w-4xl px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {!accepted ? (
          <ProposalCard onAccept={handleAccept} />
        ) : (
          <SuccessView />
        )}
      </main>
    </div>
  );
};

export default App;