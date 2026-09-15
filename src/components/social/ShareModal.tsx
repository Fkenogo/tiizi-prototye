import React, { useState } from 'react';
import { Challenge, Member } from '../../types';
import { X, Flame, Award, CheckCircle2, Share2, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  currentMember: Member;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  challenge,
  currentMember,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Check out our Tiizi challenge "${challenge.title}" in ${challenge.groupName}! We're moving together and staying accountable.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const myData = challenge.participants.find((p) => p.memberId === currentMember.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <h3 className="text-sm font-extrabold text-zinc-900">
            Share Accountability Card
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Achievement Card */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-zinc-800">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-orange-600/20 rounded-full blur-2xl" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                    <Flame className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white">
                    tiizi
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-950/70 border border-orange-500/30 px-2 py-0.5 rounded-full">
                  {challenge.type} challenge
                </span>
              </div>

              <div>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  {challenge.groupName}
                </p>
                <h4 className="text-xl font-extrabold text-white mt-0.5">
                  {challenge.title}
                </h4>
              </div>

              {/* Stats Highlight */}
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-300 block uppercase">
                    {challenge.type === 'collective'
                      ? 'Collective Progress'
                      : challenge.type === 'competitive'
                      ? 'Finish Line'
                      : 'Streak Consistency'}
                  </span>
                  <span className="text-base font-extrabold text-white">
                    {challenge.type === 'collective'
                      ? `${challenge.collectiveProgress?.totalAccumulated} / ${challenge.targetValue} km (${challenge.collectiveProgress?.percent.toFixed(0)}%)`
                      : challenge.type === 'competitive'
                      ? '100 KM Target'
                      : `${myData?.currentStreak || 17} Days Active Streak`}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                <span>Together We Move</span>
                <span>tiizi.community</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-500 text-center">
            Share this milestone card with your group or social circle to celebrate community accountability.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Card Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Challenge Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
