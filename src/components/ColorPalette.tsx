
'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const initialPalette = [
  "from-rose-400 to-pink-500", "from-purple-400 to-indigo-500", "from-blue-400 to-cyan-500", "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500", "from-red-400 to-rose-500", "from-violet-400 to-purple-500", "from-slate-400 to-gray-500",
];

function shuffle([...array]: string[]) {
  return array.sort(() => Math.random() - 0.5);
}

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

export function ColorPalette() {
  const [palette, setPalette] = useState(initialPalette);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isInView) {
      timeout = setTimeout(() => setPalette(shuffle(palette)), 2000);
    }
    return () => clearTimeout(timeout);
  }, [palette, isInView]);

  return (
    <div ref={ref} className="relative bg-card/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2 font-headline">
            Your Color Palette
          </h3>
          <p className="text-muted-foreground">Personalized just for you</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <AnimatePresence>
            {palette.map((color) => (
              <motion.li
                key={color}
                layout
                transition={spring}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${color} shadow-lg list-none`}
                whileHover={{ scale: 1.3, zIndex: 1, transition: { duration: 0.2 } }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
