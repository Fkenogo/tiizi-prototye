import React from 'react';
import { OperatorSection } from '../../types';
import { LayoutDashboard, Users, UsersRound, Dumbbell, Trophy, LayoutTemplate, Inbox, HeartHandshake, Languages, KeyRound, Activity, ScrollText, Settings, ShieldAlert } from 'lucide-react';

const NAV: { id: OperatorSection; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
  { id: 'groups', label: 'Groups', icon: <UsersRound className="w-4 h-4" /> },
  { id: 'activities', label: 'Activities & Knowledge', icon: <Dumbbell className="w-4 h-4" /> },
  { id: 'challenges', label: 'Challenges', icon: <Trophy className="w-4 h-4" /> },
  { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: 'approvals', label: 'Approvals', icon: <Inbox className="w-4 h-4" /> },
  { id: 'donations', label: 'Donations / Support', icon: <HeartHandshake className="w-4 h-4" /> },
  { id: 'content', label: 'Content & Localisation', icon: <Languages className="w-4 h-4" /> },
  { id: 'access', label: 'Access & Roles', icon: <KeyRound className="w-4 h-4" /> },
  { id: 'health', label: 'Platform Health', icon: <Activity className="w-4 h-4" /> },
  { id: 'audit', label: 'Audit Log', icon: <ScrollText className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export const OperatorShell: React.FC<{ section: OperatorSection; onNavigate: (s: OperatorSection) => void; onExitToMember: () => void; alertCount: number; children: React.ReactNode }> = ({
  section, onNavigate, onExitToMember, alertCount, children,
}) => (
  <div className="min-h-screen bg-zinc-100 text-zinc-900 lg:grid lg:grid-cols-[240px_1fr]">
    <aside className="bg-zinc-950 text-zinc-200 lg:min-h-screen flex lg:flex-col">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between lg:justify-start gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Tiizi Operator</p>
          <p className="font-black tracking-tight text-white leading-none mt-0.5">Operations console <span className="ml-1 text-[9px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">MOCK</span></p>
        </div>
        <button onClick={onExitToMember} className="lg:hidden text-[11px] font-bold px-2.5 py-1.5 bg-zinc-800 rounded-lg cursor-pointer">Member view</button>
      </div>
      <nav className="flex lg:flex-col gap-1 p-2 sm:p-3 overflow-x-auto lg:overflow-visible">
        {NAV.map((n) => (
          <button key={n.id} onClick={() => onNavigate(n.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${section === n.id ? 'bg-orange-600 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}`}>
            {n.icon}<span>{n.label}</span>
            {n.id === 'approvals' && <span className="ml-auto text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">{alertCount}</span>}
          </button>
        ))}
      </nav>
      <div className="hidden lg:block mt-auto p-4 border-t border-zinc-800">
        <button onClick={onExitToMember} className="w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl cursor-pointer">← Exit to Member experience</button>
        <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">Professional console, not a consumer feed. All actions mock with audit trail.</p>
      </div>
    </aside>
    <div className="min-w-0">
      <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-white border-b border-zinc-200">
        <p className="text-xs text-zinc-500">Environment: <strong className="text-zinc-900">Prototype</strong> · Region: Nairobi (mock) · Data is obviously non-production</p>
        <button onClick={onExitToMember} className="text-xs font-bold text-orange-700 hover:underline cursor-pointer">Exit to Member experience →</button>
      </div>
      <main className="p-4 sm:p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  </div>
);
