import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface KudoButtonProps {
  initialCount: number;
  hasKudoedInitial?: boolean;
  onKudo?: (newCount: number) => void;
  size?: 'sm' | 'md';
  variant?: 'subtle' | 'pill';
  label?: string;
}

export const KudoButton: React.FC<KudoButtonProps> = ({
  initialCount,
  hasKudoedInitial = false,
  onKudo,
  size = 'md',
  variant = 'pill',
  label = 'Kudos',
}) => {
  const [count, setCount] = useState(initialCount);
  const [hasKudoed, setHasKudoed] = useState(hasKudoedInitial);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newHasKudoed = !hasKudoed;
    const newCount = newHasKudoed ? count + 1 : Math.max(0, count - 1);
    setHasKudoed(newHasKudoed);
    setCount(newCount);
    if (newHasKudoed) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 700);
    }
    if (onKudo) {
      onKudo(newCount);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-1.5 font-medium transition-all select-none cursor-pointer ${
        variant === 'pill'
          ? hasKudoed
            ? 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
            : 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200'
          : hasKudoed
          ? 'text-orange-600 hover:text-orange-700'
          : 'text-zinc-500 hover:text-zinc-700'
      } ${
        isSmall
          ? 'px-2.5 py-1 text-xs rounded-full'
          : 'px-3.5 py-1.5 text-sm rounded-full'
      }`}
      aria-label={`Give Kudo. Current count: ${count}`}
    >
      <motion.span
        animate={animating ? { scale: [1, 1.4, 0.9, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative flex items-center justify-center"
      >
        <Heart
          className={`${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
            hasKudoed ? 'fill-orange-500 text-orange-500' : 'text-zinc-500'
          }`}
        />
        {animating && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -16, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute -top-1 pointer-events-none text-orange-500"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.span>
        )}
      </motion.span>
      <span className="font-semibold tabular-nums">{count}</span>
      {label && <span className="font-normal opacity-90 hidden sm:inline">{label}</span>}
    </button>
  );
};
