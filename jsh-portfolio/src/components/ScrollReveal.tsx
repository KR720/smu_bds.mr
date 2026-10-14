import { motion } from 'motion/react';
import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  variant?: 'grow' | 'fade-up' | 'slide-left' | 'slide-right' | 'zoom-in';
  id?: string;
  className?: string;
  amount?: number;
  key?: React.Key;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  variant = 'grow',
  id,
  className = '',
  amount = 0.15,
}: ScrollRevealProps) {
  const getVariants = () => {
    switch (variant) {
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.75 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        };
      case 'grow':
      default:
        // Kakao-style smooth scaling grow & fade-in
        return {
          hidden: { opacity: 0, scale: 0.9, y: 25 },
          visible: { opacity: 1, scale: 1, y: 0 },
        };
    }
  };

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: amount }}
      variants={getVariants()}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for responsive luxury feel
      }}
    >
      {children}
    </motion.div>
  );
}
