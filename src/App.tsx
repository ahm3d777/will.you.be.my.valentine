import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { FloatingHearts } from './components/FloatingHearts';
import { ProposalCard } from './components/ProposalCard';
import { SuccessView } from './components/SuccessView';
import { CreateLink } from './components/CreateLink';
import { readPersonalization } from './lib/params';
import { celebrate, vibrate } from './lib/effects';

const App: React.FC = () => {
  const isCreatePage = window.location.pathname.replace(/\/+$/, '') === '/create';
  const person = useMemo(() => readPersonalization(), []);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    vibrate([60, 40, 120]);
    celebrate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
      <FloatingHearts />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col items-center justify-center px-4 pb-24 pt-20">
        {isCreatePage ? (
          <CreateLink />
        ) : (
          <AnimatePresence mode="wait">
            {!accepted ? (
              <motion.div
                key="ask"
                className="flex w-full justify-center"
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.35 }}
              >
                <ProposalCard person={person} onAccept={handleAccept} />
              </motion.div>
            ) : (
              <motion.div key="yes" className="w-full">
                <SuccessView person={person} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {!isCreatePage && (
        <div className="relative z-10 -mt-16 flex justify-center pb-6">
        <a
          href="/create"
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-valentine-700 shadow-lg ring-1 ring-valentine-200 backdrop-blur transition hover:bg-white hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-300"
        >
          <PenLine className="h-4 w-4" /> Make your own
        </a>
        </div>
      )}
    </div>
  );
};

export default App;
