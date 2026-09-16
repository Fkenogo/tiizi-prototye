import React from 'react';

interface EmptyStateProps {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'restricted' | 'error';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, body, actionLabel, onAction, tone = 'neutral' }) => {
  const toneCls =
    tone === 'restricted'
      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
      : tone === 'error'
        ? 'bg-rose-50/70 border-rose-200 text-rose-900'
        : 'bg-white border-zinc-200 text-zinc-700';
  return (
    <div className={`rounded-2xl border p-8 text-center max-w-lg mx-auto ${toneCls}`}>
      <h3 className="text-base font-extrabold text-zinc-900">{title}</h3>
      <p className="text-xs mt-1.5 leading-relaxed opacity-90">{body}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
      <p className="mt-3 text-[10px] uppercase tracking-wider font-bold text-zinc-400">Prototype state — mock data</p>
    </div>
  );
};
