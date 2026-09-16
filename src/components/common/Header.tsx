import React, { useState } from 'react';
import { Member, Group, NavigationVariant } from '../../types';
import {
  Flame,
  Bell,
  Users,
  Compass,
  CheckCircle2,
  Sliders,
  Calendar,
  Layers,
  BookOpen,
  ChevronRight,
  Shield,
  Activity,
  Menu,
  X,
  HelpCircle,
} from 'lucide-react';

export type MemberTab = 'today' | 'challenges' | 'groups' | 'catalogue' | 'templates' | 'support' | 'profile' | 'onboarding';

interface HeaderProps {
  currentTab: MemberTab;
  onSelectTab: (tab: MemberTab) => void;
  currentMember: Member;
  unreadNotificationCount: number;
  navVariant?: NavigationVariant;
  onOpenNotifications: () => void;
  onOpenReferenceDrawer: () => void;
  onOpenProfileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  currentMember,
  unreadNotificationCount,
  navVariant = 'variant_b',
  onOpenNotifications,
  onOpenReferenceDrawer,
  onOpenProfileDrawer,
}) => {
  return (
    <>
      {/* Top Application Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-15 gap-4">
            {/* Left: Brand Mark */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectTab('today')}
                className="flex items-center gap-2.5 group focus:outline-hidden text-left cursor-pointer"
                title="Tiizi Home"
              >
                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/25 group-hover:scale-105 transition-transform">
                  <Flame className="w-4.5 h-4.5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg tracking-tight text-zinc-900 leading-none">
                      tiizi
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-sm border border-orange-200/60 hidden sm:inline-block">
                      Together We Move
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Center: Desktop Navigation Tabs (Mobile uses bottom bar) */}
            <nav className="hidden md:flex items-center bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/60 space-x-0.5">
              <button
                onClick={() => onSelectTab('today')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'today'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => onSelectTab('challenges')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'challenges'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                Challenges
              </button>
              <button
                onClick={() => onSelectTab('groups')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'groups'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                Groups
              </button>
              {/* Only in Variant A is Activity Guide a primary nav tab */}
              {navVariant === 'variant_a' && (
                <button
                  onClick={() => onSelectTab('catalogue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    currentTab === 'catalogue'
                      ? 'bg-white text-orange-600 font-bold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                  title="Activity Guide"
                >
                  Activity Guide
                </button>
              )}
            </nav>

            {/* Right: Actions (Reference Mode trigger, Notifications, Profile) */}
            <div className="flex items-center gap-2">
              {/* Contextual Guide quick-link for Variant B */}
              {navVariant === 'variant_b' && (
                <button
                  onClick={() => onSelectTab('catalogue')}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    currentTab === 'catalogue'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border-zinc-200'
                  }`}
                  title="Explore the Activity Guide"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Activity Guide</span>
                </button>
              )}

              {/* Engineering Experience Reference Mode Trigger */}
              <button
                onClick={onOpenReferenceDrawer}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs font-semibold shadow-xs transition-colors cursor-pointer border border-zinc-700/80"
                title="Open Engineering Experience Reference & Engine Controls"
              >
                <Sliders className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Reference Mode</span>
                <span className="sm:hidden">Ref</span>
              </button>

              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Persona Avatar / Profile Sheet Trigger */}
              <button
                onClick={onOpenProfileDrawer}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-zinc-100 transition-colors border border-zinc-200/80 cursor-pointer"
                title={`Viewing as ${currentMember.name}`}
              >
                <img
                  src={currentMember.avatar}
                  alt={currentMember.name}
                  className="w-6.5 h-6.5 rounded-full object-cover ring-1 ring-orange-500/50"
                />
                <span className="text-xs font-semibold text-zinc-800 hidden sm:inline max-w-[100px] truncate">
                  {currentMember.name.split(' ')[0]}
                </span>
                {currentMember.role === 'steward' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" title="Group Steward" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-First Sticky Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-lg px-2 pb-safe"
      >
        <div className="flex items-center justify-around h-14">
          <button
            onClick={() => onSelectTab('today')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-0.5 cursor-pointer transition-colors ${
              currentTab === 'today'
                ? 'text-orange-600 font-bold'
                : 'text-zinc-500 hover:text-zinc-900 font-medium'
            }`}
          >
            <Flame
              className={`w-5 h-5 ${
                currentTab === 'today' ? 'fill-orange-600 text-orange-600' : ''
              }`}
            />
            <span className="text-[11px]">Today</span>
          </button>

          <button
            onClick={() => onSelectTab('challenges')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-0.5 cursor-pointer transition-colors ${
              currentTab === 'challenges'
                ? 'text-orange-600 font-bold'
                : 'text-zinc-500 hover:text-zinc-900 font-medium'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[11px]">Challenges</span>
          </button>

          <button
            onClick={() => onSelectTab('groups')}
            className={`flex-1 flex flex-col items-center justify-center h-full gap-0.5 cursor-pointer transition-colors ${
              currentTab === 'groups'
                ? 'text-orange-600 font-bold'
                : 'text-zinc-500 hover:text-zinc-900 font-medium'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[11px]">Groups</span>
          </button>

          {/* If Variant A, show Activities in bottom bar; if Variant B, 3 tabs ensure maximum touch area & focus */}
          {navVariant === 'variant_a' && (
            <button
              onClick={() => onSelectTab('catalogue')}
              className={`flex-1 flex flex-col items-center justify-center h-full gap-0.5 cursor-pointer transition-colors ${
                currentTab === 'catalogue'
                  ? 'text-orange-600 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 font-medium'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[11px]">Activities</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

