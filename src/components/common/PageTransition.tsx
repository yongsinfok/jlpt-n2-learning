/**
 * PageTransition - Smooth page transitions with spring physics
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {
            opacity: 0,
            y: 20,
            scale: 0.98,
          },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
          },
          exit: {
            opacity: 0,
            y: -20,
            scale: 0.98,
          },
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 35,
          duration: 0.5,
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
