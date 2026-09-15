import React, { useState } from 'react';
import { CANONICAL_ACTIVITIES } from '../../data/canonicalActivities';
import { CanonicalActivity } from '../../types';
import {
  Search,
  CheckCircle2,
  Info,
  Shield,
  Dumbbell,
  Heart,
  Wind,
  Droplets,
  Flame,
  Footprints,
  Activity,
  Compass,
  Zap,
} from 'lucide-react';

export const ActivityCatalogueView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Fitness' | 'Wellness'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActivity, setActiveActivity] = useState<CanonicalActivity>(
    CANONICAL_ACTIVITIES[0]
  );

  const filteredActivities = CANONICAL_ACTIVITIES.filter((act) => {
    if (selectedCategory !== 'All' && act.category !== selectedCategory) return false;
    if (
      searchQuery.trim() &&
      !act.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !act.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !act.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-orange-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-600" />;
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-amber-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-600" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-sky-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Title & Scope */}
      <div className="border-b border-zinc-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Canonical Activity Catalogue
        </h1>
        <p className="text-sm text-zinc-600 mt-1">
          Governed fitness and wellness practices. Challenges only configure verified activities, measurements, and safe form guidance.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activities (e.g. Walking, Plank, Breathing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl w-full sm:w-auto">
          {(['All', 'Fitness', 'Wellness'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Split view: List on left, Detail guidance on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cards List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredActivities.map((act) => {
            const isSelected = activeActivity.id === act.id;
            return (
              <div
                key={act.id}
                onClick={() => setActiveActivity(act)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-orange-50/80 border-orange-500 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-100 shrink-0">
                    {getIcon(act.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900">{act.name}</h3>
                    <p className="text-[11px] text-zinc-500">
                      {act.category} • {act.subCategory}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-zinc-400 block uppercase">
                    Metrics
                  </span>
                  <span className="text-[11px] font-bold text-zinc-700">
                    {act.supportedMetrics.join(', ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Activity Inspector */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-orange-100 text-orange-600 shadow-xs">
                {getIcon(activeActivity.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                    {activeActivity.category}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {activeActivity.subCategory}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-zinc-900 mt-1">
                  {activeActivity.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Overview & Purpose
              </h4>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {activeActivity.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Execution & Form Guidance</span>
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {activeActivity.howItWorks}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Safety & Precautions</span>
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {activeActivity.safetyGuidance}
              </p>
            </div>

            {/* Components notice if any (Left/Right) */}
            {activeActivity.components && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900">
                <span className="font-bold">Multi-Component Activity: </span>
                Requires bilateral reporting for balanced integrity: {activeActivity.components.join(' and ')}.
              </div>
            )}

            {/* Governed Metrics & Units Matrix */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Governed Metrics & Allowed Units
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {activeActivity.supportedMetrics.map((m) => (
                  <div
                    key={m}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex justify-between"
                  >
                    <span className="font-bold text-zinc-800">{m}</span>
                    <span className="text-zinc-500 font-mono">
                      {activeActivity.supportedUnits[m]?.join(' / ') || 'standard'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
