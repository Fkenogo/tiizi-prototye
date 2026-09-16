import React, { useState } from 'react';
import { ASSUMPTIONS_REGISTER } from '../../data/assumptionsData';
import { AssumptionCategory } from '../../types';
import {
  X,
  ShieldCheck,
  Compass,
  HelpCircle,
  Slash,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface AssumptionsRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssumptionsRegisterModal: React.FC<AssumptionsRegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AssumptionCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories: { label: string; value: AssumptionCategory | 'ALL'; color: string; icon: any }[] = [
    { label: 'All Items', value: 'ALL', color: 'bg-zinc-100 text-zinc-700', icon: Filter },
    {
      label: 'Experience Hypothesis',
      value: 'EXPERIENCE HYPOTHESIS',
      color: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: Compass,
    },
    {
      label: 'Product Truth',
      value: 'PRODUCT TRUTH',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: ShieldCheck,
    },
    {
      label: 'Needs Founder Decision',
      value: 'NEEDS FOUNDER DECISION',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: HelpCircle,
    },
    {
      label: 'Out of Scope',
      value: 'OUT OF SCOPE',
      color: 'bg-zinc-100 text-zinc-600 border-zinc-200',
      icon: Slash,
    },
  ];

  const filtered = ASSUMPTIONS_REGISTER.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (
      searchQuery.trim() &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.statement.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.rationale.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getBadgeStyle = (category: AssumptionCategory) => {
    switch (category) {
      case 'PRODUCT TRUTH':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'EXPERIENCE HYPOTHESIS':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'NEEDS FOUNDER DECISION':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'OUT OF SCOPE':
        return 'bg-zinc-100 text-zinc-600 border-zinc-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded">
                  Governed Framework
                </span>
                <span className="text-xs text-zinc-500 font-medium">Handoff Document</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-900 mt-0.5">
                Tiizi Experience Reference — Assumptions Register
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-zinc-100 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assumptions, product truths, or hypotheses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === c.value
                    ? 'bg-zinc-900 text-white shadow-2xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <span>{c.label}</span>
                <span className="text-[10px] opacity-70 font-mono">
                  (
                  {c.value === 'ALL'
                    ? ASSUMPTIONS_REGISTER.length
                    : ASSUMPTIONS_REGISTER.filter((i) => i.category === c.value).length}
                  )
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Assumptions List */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4 bg-zinc-50/40">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-3 hover:border-zinc-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-zinc-900">{item.title}</h3>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border self-start sm:self-auto ${getBadgeStyle(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
              </div>

              {/* Core Statement */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-0.5">
                  Governed Statement:
                </span>
                <p className="text-xs font-semibold text-zinc-800 leading-relaxed">
                  "{item.statement}"
                </p>
              </div>

              {/* Rationale & Prototype Behavior */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider mb-1">
                    Design & Product Rationale
                  </span>
                  <p className="text-zinc-600 leading-relaxed text-[11px]">{item.rationale}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-600 block tracking-wider mb-1">
                    Prototype Implementation Behavior
                  </span>
                  <p className="text-zinc-700 font-medium leading-relaxed text-[11px]">
                    {item.prototypeBehavior}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No assumptions found matching your search.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-white flex items-center justify-between text-xs text-zinc-500">
          <span>
            {ASSUMPTIONS_REGISTER.length} Governed items registered for engineering handoff
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Register
          </button>
        </div>
      </div>
    </div>
  );
};
