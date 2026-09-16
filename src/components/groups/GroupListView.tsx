import React, { useState } from 'react';
import { Group, Member, Challenge } from '../../types';
import {
  Users,
  MapPin,
  Calendar,
  Plus,
  ArrowRight,
  Search,
  CheckCircle2,
  Shield,
  Sparkles,
} from 'lucide-react';

interface GroupListViewProps {
  groups: Group[];
  challenges: Challenge[];
  currentMember: Member;
  onSelectGroup: (group: Group) => void;
  onOpenCreateGroup: () => void;
}

export const GroupListView: React.FC<GroupListViewProps> = ({
  groups,
  challenges,
  currentMember,
  onSelectGroup,
  onOpenCreateGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter((g) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(query) ||
      g.location.toLowerCase().includes(query) ||
      g.tagline.toLowerCase().includes(query) ||
      g.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Community Groups
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Local fitness and wellness circles hosting shared challenges and daily accountability.
          </p>
        </div>

        <button
          onClick={onOpenCreateGroup}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm shadow-orange-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Group</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search groups by name, location, or focus (e.g. running, mindfulness, Nairobi)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white rounded-xl border border-zinc-200 shadow-2xs focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-10 text-center max-w-md mx-auto">
          <h3 className="text-base font-bold text-zinc-900">No groups match your search</h3>
          <p className="text-xs text-zinc-500 mt-1">Try a different name, place or focus — or create a new circle. Prototype data only.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => {
          const groupChallenges = challenges.filter(
            (c) => c.groupId === group.id && c.status === 'active'
          );
          const isSteward = group.stewardIds.includes(currentMember.id);

          return (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className="bg-white rounded-2xl border border-zinc-200 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              {/* Cover Image */}
              <div className="relative h-36 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>{group.location}</span>
                  </span>
                </div>

                {isSteward && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/95 px-2 py-0.5 rounded-md shadow-2xs">
                      Steward
                    </span>
                  </div>
                )}
                {group.healthState && group.healthState !== 'healthy' && (
                  <div className="absolute bottom-3 right-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs ${group.healthState === 'restricted' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'}`}>
                      {group.healthState === 'restricted' ? 'Restricted' : 'Under review'}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h2 className="text-base font-extrabold tracking-tight group-hover:text-orange-300 transition-colors">
                    {group.name}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    "{group.tagline}"
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-3">
                    {group.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer stats & link */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{group.memberCount} members</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>{groupChallenges.length} active</span>
                    </span>
                  </div>

                  <span className="text-orange-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-xs">
                    <span>Enter Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
