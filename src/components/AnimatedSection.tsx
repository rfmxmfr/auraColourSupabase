
'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function AnimatedSection({ children, className, id, delay = 0 }: AnimatedSectionProps) {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay,
      },
    },
  };

  return (
    <motion.section
      id={id}
      className={cn(className)}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
}
