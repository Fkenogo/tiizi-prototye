import React from 'react';
import { Member, Group, Challenge } from '../../types';
import {
  X,
  User,
  Shield,
  Award,
  Flame,
  Calendar,
  MapPin,
  Heart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: Member;
  allGroups: Group[];
  challenges: Challenge[];
  onSelectGroup: (groupId: string) => void;
  onSelectChallenge: (challengeId: string) => void;
  onOpenReferenceDrawer: () => void;
  onOpenTemplates?: () => void;
  onOpenSupport?: () => void;
  onOpenFullProfile?: () => void;
  onOpenOnboarding?: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  currentMember,
  allGroups,
  challenges,
  onSelectGroup,
  onSelectChallenge,
  onOpenReferenceDrawer,
  onOpenTemplates,
  onOpenSupport,
  onOpenFullProfile,
  onOpenOnboarding,
}) => {
  if (!isOpen) return null;

  // Challenges user has joined
  const myChallenges = challenges.filter((c) =>
    c.participants.some((p) => p.memberId === currentMember.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col border-l border-zinc-200">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-zinc-900">Member Profile</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Identity Card */}
            <div className="flex items-center gap-3.5">
              <img
                src={currentMember.avatar}
                alt={currentMember.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-lg text-zinc-900 leading-tight">
                    {currentMember.name}
                  </h3>
                  {currentMember.role === 'steward' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                      Steward
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">{currentMember.handle}</p>
                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>{currentMember.location}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              {currentMember.bio}
            </p>

            {/* Governed Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100">
                <span className="text-lg font-black text-orange-600 block">
                  {myChallenges.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Active
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <span className="text-lg font-black text-zinc-800 block">
                  {currentMember.stats.challengesCompleted}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Finished
                </span>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-lg font-black text-amber-600 block">
                  {currentMember.stats.kudosReceived}
                </span>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Kudos
                </span>
              </div>
            </div>

            {/* Policy-qualified Platform Recognition (records, not credentials; distinct from community Kudos) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Platform Recognition</span>
                </h4>
                <span className="text-[10px] font-semibold text-zinc-400">
                  Policy-qualified records
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">Not automatic: only Derived Truth that meets Platform Policy is recorded here. Kudos from peers appear in the community feed, not here.</p>

              {currentMember.recognitions && currentMember.recognitions.length > 0 ? (
                <div className="space-y-2">
                  {currentMember.recognitions.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-linear-to-br from-amber-500/5 via-amber-500/10 to-transparent rounded-xl border border-amber-200/80 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-900 leading-snug">
                          {rec.title}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                          {rec.tier.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-normal">{rec.summary}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-500 border-t border-amber-200/40">
                        <span>{rec.challengeTitle}</span>
                        <span>{rec.issuedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-center text-xs text-zinc-500">
                  No recognition records yet. Some governed outcomes may qualify under Tiizi policy — Kudos are separate peer encouragement.
                </div>
              )}
            </div>

            {/* My Active Challenges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                My Active Challenges
              </h4>
              <div className="space-y-1.5">
                {myChallenges.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectChallenge(c.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-zinc-50 hover:bg-orange-50 border border-zinc-200/80 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold text-zinc-800 group-hover:text-orange-600 truncate">
                        {c.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {c.groupName} • {c.type}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary destinations (keeps primary nav uncrowded) */}
            <div className="grid grid-cols-2 gap-1.5">
              {onOpenFullProfile && (<button onClick={() => { onOpenFullProfile(); onClose(); }} className="py-2 px-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-[11px] cursor-pointer">Profile &amp; settings</button>)}
              {onOpenOnboarding && (<button onClick={() => { onOpenOnboarding(); onClose(); }} className="py-2 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] cursor-pointer">Onboarding guide</button>)}
              {onOpenTemplates && (<button onClick={() => { onOpenTemplates(); onClose(); }} className="py-2 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] cursor-pointer">Templates</button>)}
              {onOpenSupport && (<button onClick={() => { onOpenSupport(); onClose(); }} className="py-2 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] cursor-pointer">Support Tiizi</button>)}
            </div>

            {/* Persona Switch Prompt */}
            <div className="pt-2 border-t border-zinc-100">
              <button
                onClick={() => {
                  onClose();
                  onOpenReferenceDrawer();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Switch Persona in Reference Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
