import React from 'react';
import { CANONICAL_ACTIVITIES } from '../../data/canonicalActivities';
import {
  X,
  BookOpen,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Activity,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

interface ActivityInfoModalProps {
  activityId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectToLog?: (activityId: string) => void;
}

export const ActivityInfoModal: React.FC<ActivityInfoModalProps> = ({
  activityId,
  isOpen,
  onClose,
  onSelectToLog,
}) => {
  if (!isOpen || !activityId) return null;

  const activity = CANONICAL_ACTIVITIES.find((a) => a.id === activityId);
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  {activity.category} • {activity.subCategory}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {activity.id}
                </span>
              </div>
              <h2 className="text-lg font-black text-zinc-900 mt-0.5">
                {activity.name}
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Description */}
          <div>
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
              {activity.description}
            </p>
          </div>

          {/* How it works */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              <span>How It Works & Proper Form</span>
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {activity.howItWorks}
            </p>
          </div>

          {/* What counts / Supported Metrics */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>How progress is measured</span>
            </h3>
            <div className="space-y-1 text-xs">
              {activity.supportedMetrics.map((m) => (
                <div key={m} className="flex items-center justify-between text-zinc-700">
                  <span className="font-semibold">{m}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    Supported: {(activity.supportedUnits[m] || []).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Form Guidance */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
            <h3 className="font-bold text-amber-950 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Safety & Recovery Guidance</span>
            </h3>
            <p className="text-amber-900 leading-relaxed text-[11px]">
              {activity.safetyGuidance}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-white flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            Tiizi Activity Guide
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onSelectToLog && (
              <button
                onClick={() => {
                  onClose();
                  onSelectToLog(activity.id);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Log This Activity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
