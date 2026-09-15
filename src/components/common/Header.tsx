import React, { useState } from 'react';
import { Member, Group } from '../../types';
import {
  Flame,
  Bell,
  Users,
  Calendar,
  Compass,
  Plus,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'today' | 'challenges' | 'groups' | 'catalogue';
  onSelectTab: (tab: 'today' | 'challenges' | 'groups' | 'catalogue') => void;
  currentMember: Member;
  activeGroup: Group;
  allGroups: Group[];
  onSelectGroup: (group: Group) => void;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenCreateChallenge: () => void;
  onOpenLogModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentMember,
  activeGroup,
  allGroups,
  onSelectGroup,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenCreateChallenge,
  onOpenLogModal,
}) => {
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Group Context */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => onSelectTab('today')}
              className="flex items-center gap-2 group focus:outline-hidden text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 leading-none">
                  tiizi
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-orange-600 leading-none mt-0.5">
                  Together We Move
                </span>
              </div>
            </button>

            {/* Active Group Pill & Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/90 hover:bg-zinc-200/80 border border-zinc-200/80 text-xs font-semibold text-zinc-800 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span className="truncate max-w-[160px]">{activeGroup.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {groupDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setGroupDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-30">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Your Groups
                    </div>
                    {allGroups.map((grp) => (
                      <button
                        key={grp.id}
                        onClick={() => {
                          onSelectGroup(grp);
                          setGroupDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          grp.id === activeGroup.id
                            ? 'bg-orange-50 font-bold text-orange-700'
                            : 'text-zinc-700 hover:bg-zinc-50 font-medium'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate">{grp.name}</p>
                          <p className="text-[10px] text-zinc-400 font-normal">
                            {grp.memberCount} members
                          </p>
                        </div>
                        {grp.id === activeGroup.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('today')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'today'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onSelectTab('challenges')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'challenges'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Challenges
            </button>
            <button
              onClick={() => onSelectTab('groups')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'groups'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => onSelectTab('catalogue')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'catalogue'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Activity Guide
            </button>
          </nav>

          {/* Action CTAs & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Log Action */}
            <button
              onClick={onOpenLogModal}
              className="bg-zinc-900 hover:bg-black text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>Log Activity</span>
            </button>

            {/* Start Challenge CTA */}
            <button
              onClick={onOpenCreateChallenge}
              className="hidden lg:flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs shadow-orange-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Challenge</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* User Avatar & Role */}
            <div className="flex items-center gap-2 pl-1 border-l border-zinc-200">
              <img
                src={currentMember.avatar}
                alt={currentMember.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/20"
              />
              <div className="hidden xl:block text-left leading-tight">
                <p className="text-xs font-bold text-zinc-900 truncate max-w-[100px]">
                  {currentMember.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider">
                  {currentMember.role === 'steward' ? 'Steward' : 'Member'}
                </p>
              </div>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-xs text-zinc-500">Active Group:</span>
            <span className="text-xs font-bold text-zinc-900">{activeGroup.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onSelectTab('today');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-bold text-center ${
                currentTab === 'today'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => {
                onSelectTab('challenges');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-bold text-center ${
                currentTab === 'challenges'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              Challenges
            </button>
            <button
              onClick={() => {
                onSelectTab('groups');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-bold text-center ${
                currentTab === 'groups'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => {
                onSelectTab('catalogue');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-bold text-center ${
                currentTab === 'catalogue'
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              Activity Guide
            </button>
          </div>
          <button
            onClick={() => {
              onOpenCreateChallenge();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Challenge</span>
          </button>
        </div>
      )}
    </header>
  );
};
