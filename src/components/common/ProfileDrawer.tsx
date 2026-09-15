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
