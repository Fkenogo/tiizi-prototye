import React, { useState } from 'react';
import { Group, Member } from '../../types';
import { X, Users, MapPin, CheckCircle2, Shield } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: Member;
  onCreateGroup: (group: Group) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  currentMember,
  onCreateGroup,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Nairobi, Kenya');
  const [ruleInput, setRuleInput] = useState('Encourage all paces and support daily consistency.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name,
      tagline: tagline || 'Moving together, staying accountable.',
      description:
        description ||
        'A supportive group community dedicated to active fitness and intentional wellness practices.',
      location,
      image:
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80',
      isPrivate: false,
      memberCount: 1,
      stewardIds: [currentMember.id],
      activeChallengeIds: [],
      tags: ['Community', 'Wellness', 'Accountability'],
      rules: [ruleInput, 'Log activities honestly — our truth builds our culture.'],
    };

    onCreateGroup(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
              Establish Community
            </span>
            <h2 className="text-base font-extrabold text-zinc-900 mt-0.5">
              Create a Tiizi Group
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
              Group Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Karura Sunrise Runners, Westlands Yoga Collective"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 font-semibold focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
              Tagline (One sentence ethos)
            </label>
            <input
              type="text"
              placeholder="e.g. Moving early, supporting each other, staying accountable."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
              Location / Area
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
              Core Community Rule
            </label>
            <input
              type="text"
              value={ruleInput}
              onChange={(e) => setRuleInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2">
            <Shield className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-800">You will become Group Steward.</span>{' '}
              You will be able to manage group settings, invite members, and launch challenges.
              <span className="block mt-1 text-zinc-500">Default: any group member may create challenges unless the group later adopts a rule restricting it.</span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              Establish Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
