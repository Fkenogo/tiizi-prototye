import React, { useState } from 'react';
import {
  Member,
  Group,
  Challenge,
  ActivitySubmission,
  CommunityMoment,
  NotificationAlert,
  SurfaceMode,
  OperatorSection,
  NavigationVariant,
} from './types';
import {
  CURRENT_USER_AMINA,
  ALL_MEMBERS,
  INITIAL_GROUPS,
  INITIAL_CHALLENGES,
  INITIAL_SUBMISSIONS,
  INITIAL_MOMENTS,
  INITIAL_NOTIFICATIONS,
  EXTRA_CHALLENGES,
  EXTENDED_NOTIFICATIONS,
  EXTENDED_GROUPS_META,
} from './data/mockData';
import { Header, MemberTab } from './components/common/Header';
import { ExperienceBar } from './components/common/ExperienceBar';
import { ReferenceDrawer } from './components/reference/ReferenceDrawer';
import { ProfileDrawer } from './components/common/ProfileDrawer';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { TodayView } from './components/today/TodayView';
import { ChallengeListView } from './components/challenges/ChallengeListView';
import { ChallengeDetailView } from './components/challenges/ChallengeDetailView';
import { CreateChallengeWizard } from './components/challenges/CreateChallengeWizard';
import { LogActivityModal } from './components/activity/LogActivityModal';
import { GroupListView } from './components/groups/GroupListView';
import { GroupDetailView } from './components/groups/GroupDetailView';
import { CreateGroupModal } from './components/groups/CreateGroupModal';
import { ActivityCatalogueView } from './components/catalogue/ActivityCatalogueView';
import { ShareModal } from './components/social/ShareModal';
import { ArchitectureDocsModal } from './components/reference/ArchitectureDocsModal';
import { AssumptionsRegisterModal } from './components/reference/AssumptionsRegisterModal';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { TemplateGalleryView } from './components/templates/TemplateGalleryView';
import { SupportView } from './components/support/SupportView';
import { ProfileFullView } from './components/profile/ProfileFullView';
import { EmptyState } from './components/common/EmptyState';
import { OperatorShell } from './components/operator/OperatorShell';
import { OperatorOverview } from './components/operator/OperatorOverview';
import { OperatorUsers } from './components/operator/OperatorUsers';
import { OperatorGroups } from './components/operator/OperatorGroups';
import { OperatorActivities } from './components/operator/OperatorActivities';
import { OperatorChallenges } from './components/operator/OperatorChallenges';
import { OperatorTemplates } from './components/operator/OperatorTemplates';
import { OperatorApprovals, OperatorAttention } from './components/operator/OperatorWorkqueues';
import {
  OperatorDonations,
  OperatorContent,
  OperatorAccess,
  OperatorHealth,
  OperatorAudit,
  OperatorSettings,
} from './components/operator/OperatorPlatform';
import { ASSUMPTIONS_REGISTER } from './data/assumptionsData';

function withGroupMeta(groups: Group[]): Group[] {
  return groups.map((g) => {
    const meta = EXTENDED_GROUPS_META[g.id];
    if (!meta) return g;
    return {
      ...g,
      healthState: meta.healthState,
      creationPermission: meta.creationPermission,
      pendingRequests: meta.pendingRequests,
      flaggedReason: meta.flaggedReason,
      allowMemberCreation: meta.creationPermission === 'open' ? true : g.allowMemberCreation ?? false,
    };
  });
}

export default function App() {
  // Surface + navigation state (Reference Mode switch lives in the drawer)
  const [surface, setSurface] = useState<SurfaceMode>('member');
  const [operatorSection, setOperatorSection] = useState<OperatorSection>('overview');
  const [memberTab, setMemberTab] = useState<MemberTab>('today');
  const [navVariant, setNavVariant] = useState<NavigationVariant>('variant_b');
  const [simulateIncident, setSimulateIncident] = useState(false);
  const [onboardingPreview, setOnboardingPreview] = useState('brand_new');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Entities State (existing prototype state preserved, extended with new mock states)
  const [currentMember, setCurrentMember] = useState<Member>(CURRENT_USER_AMINA);
  const [activeGroup, setActiveGroup] = useState<Group>(withGroupMeta(INITIAL_GROUPS)[0]);
  const [allGroups, setAllGroups] = useState<Group[]>(withGroupMeta(INITIAL_GROUPS));
  const [challenges, setChallenges] = useState<Challenge[]>([...INITIAL_CHALLENGES, ...EXTRA_CHALLENGES]);
  const [submissions, setSubmissions] = useState<ActivitySubmission[]>(INITIAL_SUBMISSIONS);
  const [moments, setMoments] = useState<CommunityMoment[]>(INITIAL_MOMENTS);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    ...INITIAL_NOTIFICATIONS,
    ...EXTENDED_NOTIFICATIONS,
  ]);

  // Modals & Drawers State
  const [referenceDrawerOpen, setReferenceDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [wizardTemplateId, setWizardTemplateId] = useState<string | undefined>(undefined);
  const [wizardKey, setWizardKey] = useState(0);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logChallengeId, setLogChallengeId] = useState<string | undefined>(undefined);
  const [logActivityId, setLogActivityId] = useState<string | undefined>(undefined);
  const [shareModalChallenge, setShareModalChallenge] = useState<Challenge | null>(null);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [architectureDocsOpen, setArchitectureDocsOpen] = useState(false);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState(false);
  const [targetExceeded, setTargetExceeded] = useState(false);

  const handleToggleExceeded = () => {
    const nextState = !targetExceeded;
    setTargetExceeded(nextState);
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === 'ch-walk-nairobi') {
          const total = nextState ? 524.0 : 438.5;
          const percent = (total / c.targetValue) * 100;
          return { ...c, collectiveProgress: { totalAccumulated: total, target: c.targetValue, percent, completedEarly: nextState } };
        }
        return c;
      })
    );
  };

  const goMember = (tab: MemberTab) => {
    setSurface('member');
    setSelectedChallengeId(null);
    setSelectedGroupId(null);
    setMemberTab(tab);
  };

  const handleSelectJourney = (journeyId: string) => {
    switch (journeyId) {
      case 'journey-today': goMember('today'); break;
      case 'journey-collective': setSurface('member'); setSelectedChallengeId('ch-walk-nairobi'); setMemberTab('challenges'); break;
      case 'journey-competitive': setSurface('member'); setSelectedChallengeId('ch-race-100k'); setMemberTab('challenges'); break;
      case 'journey-streak': setSurface('member'); setSelectedChallengeId('ch-30day-movement'); setMemberTab('challenges'); break;
      case 'journey-create': setSurface('member'); setWizardTemplateId(undefined); setWizardKey((k) => k + 1); setCreateChallengeOpen(true); break;
      case 'journey-catalogue': goMember('catalogue'); break;
      case 'journey-onboarding': goMember('onboarding'); break;
      case 'journey-templates': goMember('templates'); break;
      case 'journey-support': goMember('support'); break;
      case 'journey-operator': setSurface('operator'); setOperatorSection('overview'); break;
      default: break;
    }
  };

  const handleSwitchMember = (member: Member) => setCurrentMember(member);

  const handleOpenLogModal = (challengeId?: string, activityId?: string) => {
    // Product rule: no logging before participation — guard here as well as in views.
    if (challengeId) {
      const ch = challenges.find((c) => c.id === challengeId);
      const isParticipant = ch?.participants.some((p) => p.memberId === currentMember.id);
      if (ch && !isParticipant) return;
      if (ch && (ch.status === 'upcoming' || ch.status === 'closed' || ch.status === 'completed')) return;
    }
    setLogChallengeId(challengeId);
    setLogActivityId(activityId);
    setLogModalOpen(true);
  };

  const handleJoinChallenge = (challengeId: string) => {
    const ch = challenges.find((c) => c.id === challengeId);
    if (!ch || ch.status === 'closed' || ch.status === 'completed' || ch.status === 'upcoming') return;
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          const exists = c.participants.some((p) => p.memberId === currentMember.id);
          if (exists) return c;
          const newParticipant = {
            memberId: currentMember.id, name: currentMember.name, avatar: currentMember.avatar,
            accumulatedValue: 0, unit: c.targetUnit, lastContributionAt: 'Just joined',
            rank: null, finished: false, daysCompleted: 0, currentStreak: 0, bestStreak: 0,
            todayCompleted: false, todayRequirementsDone: {},
          };
          return { ...c, participants: [...c.participants, newParticipant] };
        }
        return c;
      })
    );
    if (ch) {
      setMoments((prev) => [
        { id: `mom-${Date.now()}`, type: 'activity_logged', actorName: currentMember.name, actorAvatar: currentMember.avatar, actorId: currentMember.id, challengeId: ch.id, challengeTitle: ch.title, challengeType: ch.type, headline: 'Affirmatively Joined Challenge', detail: `${currentMember.name} joined ${ch.title} in ${ch.groupName}. Ready to contribute!`, timestamp: 'Just now', kudos: 3, hasKudoed: false },
        ...prev,
      ]);
    }
  };

  const handleActivitySubmitted = (newSubmission: ActivitySubmission, updatedChallenge: Challenge) => {
    setSubmissions((prev) => [newSubmission, ...prev]);
    setChallenges((prev) => prev.map((c) => (c.id === updatedChallenge.id ? updatedChallenge : c)));
    const newMoment: CommunityMoment = {
      id: `mom-${Date.now()}`,
      type: updatedChallenge.type === 'streak' && newSubmission.value >= 1 ? 'daily_done' : 'activity_logged',
      actorName: currentMember.name, actorAvatar: currentMember.avatar, actorId: currentMember.id,
      challengeId: updatedChallenge.id, challengeTitle: updatedChallenge.title, challengeType: updatedChallenge.type,
      headline: `Logged ${newSubmission.value} ${newSubmission.unit} of ${newSubmission.activityName}`,
      detail: newSubmission.note || `Progress applied to ${updatedChallenge.title} in ${updatedChallenge.groupName}.`,
      timestamp: 'Just now', kudos: 1, hasKudoed: false,
    };
    setMoments((prev) => [newMoment, ...prev]);
  };

  const handleCreateChallenge = (newChallenge: Challenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);
    setSelectedChallengeId(newChallenge.id);
    setMemberTab('challenges');
    setMoments((prev) => [
      { id: `mom-${Date.now()}`, type: 'milestone', actorName: currentMember.name, actorAvatar: currentMember.avatar, actorId: currentMember.id, challengeId: newChallenge.id, challengeTitle: newChallenge.title, challengeType: newChallenge.type, headline: 'Launched New Community Challenge', detail: `New challenge open for participation: "${newChallenge.title}" in ${newChallenge.groupName}.`, timestamp: 'Just now', kudos: 4, hasKudoed: false },
      ...prev,
    ]);
  };

  const handleCreateGroup = (newGroup: Group) => {
    setAllGroups((prev) => [{ ...newGroup, healthState: 'healthy', creationPermission: 'open', pendingRequests: 0 }, ...prev]);
    setActiveGroup(newGroup);
    setSelectedGroupId(newGroup.id);
    setMemberTab('groups');
  };

  const handleRunAgain = (oldChallenge: Challenge) => {
    const freshChallenge: Challenge = {
      ...oldChallenge, id: `ch-${Date.now()}`, title: `${oldChallenge.title} (Cycle 2)`,
      status: 'active', startDate: 'Sep 15, 2026', endDate: 'Sep 29, 2026',
      isFlagged: false, flaggedReason: undefined, finalized: false, inviteState: 'none',
      participants: oldChallenge.participants.map((p) => ({ ...p, accumulatedValue: 0, rank: null, finished: false, daysCompleted: 0, currentStreak: 0, todayCompleted: false, todayRequirementsDone: {} })),
      collectiveProgress: oldChallenge.type === 'collective' ? { totalAccumulated: 0, target: oldChallenge.targetValue, percent: 0, completedEarly: false } : undefined,
    };
    setChallenges((prev) => [freshChallenge, ...prev]);
    setSelectedChallengeId(freshChallenge.id);
  };

  const handleKudoMoment = (momentId: string) => {
    setMoments((prev) => prev.map((m) => (m.id === momentId ? { ...m, kudos: m.hasKudoed ? m.kudos - 1 : m.kudos + 1, hasKudoed: !m.hasKudoed } : m)));
  };

  const handleKudoSubmission = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          const has = s.kudosGivenBy.includes(currentMember.id);
          return { ...s, kudosCount: has ? s.kudosCount - 1 : s.kudosCount + 1, kudosGivenBy: has ? s.kudosGivenBy.filter((id) => id !== currentMember.id) : [...s.kudosGivenBy, currentMember.id] };
        }
        return s;
      })
    );
  };

  const handleUseTemplate = (tplId: string) => {
    setWizardTemplateId(tplId);
    setWizardKey((k) => k + 1);
    setCreateChallengeOpen(true);
  };

  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId);
  const viewingGroup = selectedGroupId ? allGroups.find((g) => g.id === selectedGroupId) || activeGroup : null;

  // ---- Operator surface (dedicated console, desktop-first but responsive) ----
  if (surface === 'operator') {
    return (
      <div className="min-h-screen bg-zinc-100">
        <OperatorShell section={operatorSection} onNavigate={setOperatorSection} onExitToMember={() => setSurface('member')} alertCount={7}>
          {operatorSection === 'overview' && <OperatorOverview />}
          {operatorSection === 'users' && <OperatorUsers />}
          {operatorSection === 'groups' && <OperatorGroups />}
          {operatorSection === 'activities' && <OperatorActivities />}
          {operatorSection === 'challenges' && <OperatorChallenges />}
          {operatorSection === 'templates' && <OperatorTemplates onUseTemplate={(id) => { setSurface('member'); handleUseTemplate(id); }} />}
          {operatorSection === 'approvals' && (
            <div className="space-y-6"><OperatorApprovals /><OperatorAttention /></div>
          )}
          {operatorSection === 'donations' && <OperatorDonations />}
          {operatorSection === 'content' && <OperatorContent />}
          {operatorSection === 'access' && <OperatorAccess />}
          {operatorSection === 'health' && <OperatorHealth simulatedIncident={simulateIncident} />}
          {operatorSection === 'audit' && <OperatorAudit />}
          {operatorSection === 'settings' && <OperatorSettings />}
        </OperatorShell>
        <ReferenceDrawer
          isOpen={referenceDrawerOpen}
          onClose={() => setReferenceDrawerOpen(false)}
          currentMember={currentMember}
          onSwitchMember={handleSwitchMember}
          onSelectJourney={handleSelectJourney}
          onOpenArchitectureDocs={() => setArchitectureDocsOpen(true)}
          onOpenAssumptionsRegister={() => setAssumptionsModalOpen(true)}
          onToggleExceededState={handleToggleExceeded}
          targetExceeded={targetExceeded}
          surface={surface}
          onSwitchSurface={setSurface}
          navVariant={navVariant}
          onSwitchNavVariant={setNavVariant}
          simulateIncident={simulateIncident}
          onToggleIncident={() => setSimulateIncident((v) => !v)}
          onboardingState={onboardingPreview}
          onSelectOnboardingState={setOnboardingPreview}
        />
        <button onClick={() => setReferenceDrawerOpen(true)} className="fixed bottom-4 right-4 z-40 px-3.5 py-2 rounded-xl bg-zinc-900 text-zinc-100 text-xs font-bold border border-zinc-700 shadow-lg cursor-pointer">Reference Mode</button>
        <ArchitectureDocsModal isOpen={architectureDocsOpen} onClose={() => setArchitectureDocsOpen(false)} />
        <AssumptionsRegisterModal isOpen={assumptionsModalOpen} onClose={() => setAssumptionsModalOpen(false)} />
      </div>
    );
  }

  // ---- Member surface ----
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-zinc-900 pb-16 md:pb-0">
      <ExperienceBar
        currentMember={currentMember}
        onSwitchMember={handleSwitchMember}
        onSelectJourney={handleSelectJourney}
        onOpenArchitectureDocs={() => setArchitectureDocsOpen(true)}
        onOpenAssumptionsRegister={() => setAssumptionsModalOpen(true)}
        onToggleExceededState={handleToggleExceeded}
        targetExceeded={targetExceeded}
      />

      <Header
        currentTab={memberTab}
        onSelectTab={(tab) => { setSelectedChallengeId(null); setSelectedGroupId(null); setMemberTab(tab); }}
        currentMember={currentMember}
        unreadNotificationCount={notifications.filter((n) => !n.read).length}
        navVariant={navVariant}
        onOpenNotifications={() => setNotificationsDrawerOpen(true)}
        onOpenReferenceDrawer={() => setReferenceDrawerOpen(true)}
        onOpenProfileDrawer={() => setProfileDrawerOpen(true)}
      />

      <main className="flex-1 pb-16">
        {selectedChallenge ? (
          <ChallengeDetailView
            challenge={selectedChallenge}
            currentMember={currentMember}
            submissions={submissions}
            onBack={() => setSelectedChallengeId(null)}
            onJoinChallenge={handleJoinChallenge}
            onOpenLogModal={handleOpenLogModal}
            onOpenShareModal={(ch) => setShareModalChallenge(ch)}
            onRunAgain={handleRunAgain}
            onKudoSubmission={handleKudoSubmission}
          />
        ) : memberTab === 'today' ? (
          <TodayView
            currentMember={currentMember}
            challenges={challenges}
            activeGroup={activeGroup}
            moments={moments}
            onSelectChallenge={(chId) => setSelectedChallengeId(chId)}
            onOpenLogModal={handleOpenLogModal}
            onJoinChallenge={handleJoinChallenge}
            onNavigateToChallenges={() => setMemberTab('challenges')}
            onNavigateToGroup={(grpId) => {
              if (grpId) {
                const found = allGroups.find((g) => g.id === grpId);
                if (found) setActiveGroup(found);
                setSelectedGroupId(grpId);
              }
              setMemberTab('groups');
            }}
            onKudoMoment={handleKudoMoment}
          />
        ) : memberTab === 'challenges' ? (
          <ChallengeListView
            challenges={challenges}
            currentMember={currentMember}
            onSelectChallenge={(chId) => setSelectedChallengeId(chId)}
            onJoinChallenge={handleJoinChallenge}
            onLogChallenge={(chId) => handleOpenLogModal(chId)}
            onOpenCreateChallenge={() => { setWizardTemplateId(undefined); setWizardKey((k) => k + 1); setCreateChallengeOpen(true); }}
            onRunAgain={handleRunAgain}
          />
        ) : memberTab === 'groups' ? (
          viewingGroup ? (
            <GroupDetailView
              group={viewingGroup}
              currentMember={currentMember}
              challenges={challenges}
              moments={moments}
              onBack={() => setSelectedGroupId(null)}
              onSelectChallenge={(chId) => setSelectedChallengeId(chId)}
              onJoinChallenge={handleJoinChallenge}
              onLogChallenge={(chId) => handleOpenLogModal(chId)}
              onOpenCreateChallenge={() => { setWizardTemplateId(undefined); setWizardKey((k) => k + 1); setCreateChallengeOpen(true); }}
              onOpenCreateGroup={() => setCreateGroupOpen(true)}
              onKudoMoment={handleKudoMoment}
            />
          ) : (
            <GroupListView
              groups={allGroups}
              challenges={challenges}
              currentMember={currentMember}
              onSelectGroup={(grp) => { setActiveGroup(grp); setSelectedGroupId(grp.id); }}
              onOpenCreateGroup={() => setCreateGroupOpen(true)}
            />
          )
        ) : memberTab === 'catalogue' ? (
          <ActivityCatalogueView />
        ) : memberTab === 'onboarding' ? (
          <OnboardingView onBrowseGroups={() => setMemberTab('groups')} onBrowseChallenges={() => setMemberTab('challenges')} onOpenToday={() => setMemberTab('today')} />
        ) : memberTab === 'templates' ? (
          <TemplateGalleryView onUseTemplate={handleUseTemplate} />
        ) : memberTab === 'support' ? (
          <SupportView />
        ) : memberTab === 'profile' ? (
          <ProfileFullView member={currentMember} groups={allGroups} challenges={challenges} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-10"><EmptyState title="Content unavailable in this language (mock)" body="The requested view has no Kiswahili copy in this prototype and fell back to nothing. Switch language to English or pick another destination." actionLabel="Back to Today" onAction={() => setMemberTab('today')} tone="neutral" /></div>
        )}
      </main>

      <footer className="bg-white border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-900 tracking-tight">tiizi</span>
            <span>• Tiizi Experience Reference (candidate — not yet adopted)</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button onClick={() => goMember('onboarding')} className="font-bold text-xs underline cursor-pointer">Onboarding</button>
            <button onClick={() => goMember('templates')} className="font-bold text-xs underline cursor-pointer">Templates</button>
            <button onClick={() => goMember('support')} className="font-bold text-xs underline cursor-pointer">Support</button>
            <button onClick={() => goMember('profile')} className="font-bold text-xs underline cursor-pointer">Profile &amp; settings</button>
            <button onClick={() => { setSurface('operator'); setOperatorSection('overview'); }} className="font-bold text-xs underline cursor-pointer">Operator console</button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setAssumptionsModalOpen(true)} className="text-amber-700 hover:text-amber-800 font-bold text-xs underline cursor-pointer">Assumptions Register ({ASSUMPTIONS_REGISTER.length})</button>
            <button onClick={() => setArchitectureDocsOpen(true)} className="text-orange-600 hover:text-orange-700 font-bold text-xs underline cursor-pointer">UX Architecture Reference</button>
          </div>
        </div>
      </footer>

      <ReferenceDrawer
        isOpen={referenceDrawerOpen}
        onClose={() => setReferenceDrawerOpen(false)}
        currentMember={currentMember}
        onSwitchMember={handleSwitchMember}
        onSelectJourney={handleSelectJourney}
        onOpenArchitectureDocs={() => setArchitectureDocsOpen(true)}
        onOpenAssumptionsRegister={() => setAssumptionsModalOpen(true)}
        onToggleExceededState={handleToggleExceeded}
        targetExceeded={targetExceeded}
        surface={surface}
        onSwitchSurface={setSurface}
        navVariant={navVariant}
        onSwitchNavVariant={setNavVariant}
        simulateIncident={simulateIncident}
        onToggleIncident={() => setSimulateIncident((v) => !v)}
        onboardingState={onboardingPreview}
        onSelectOnboardingState={setOnboardingPreview}
      />

      <ProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        currentMember={currentMember}
        allGroups={allGroups}
        challenges={challenges}
        onSelectGroup={(grpId) => { setSelectedGroupId(grpId); setMemberTab('groups'); }}
        onSelectChallenge={(chId) => { setSelectedChallengeId(chId); setMemberTab('challenges'); }}
        onOpenReferenceDrawer={() => setReferenceDrawerOpen(true)}
        onOpenTemplates={() => goMember('templates')}
        onOpenSupport={() => goMember('support')}
        onOpenFullProfile={() => goMember('profile')}
        onOpenOnboarding={() => goMember('onboarding')}
      />

      <CreateChallengeWizard
        key={wizardKey}
        isOpen={createChallengeOpen}
        onClose={() => setCreateChallengeOpen(false)}
        allGroups={allGroups}
        activeGroup={activeGroup}
        currentMember={currentMember}
        onCreateChallenge={handleCreateChallenge}
        initialTemplateId={wizardTemplateId}
      />

      <CreateGroupModal isOpen={createGroupOpen} onClose={() => setCreateGroupOpen(false)} currentMember={currentMember} onCreateGroup={handleCreateGroup} />

      <LogActivityModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        challenges={challenges}
        currentMember={currentMember}
        initialChallengeId={logChallengeId}
        initialActivityId={logActivityId}
        onActivitySubmitted={handleActivitySubmitted}
      />

      {shareModalChallenge && (
        <ShareModal isOpen={!!shareModalChallenge} onClose={() => setShareModalChallenge(null)} challenge={shareModalChallenge} currentMember={currentMember} />
      )}

      <NotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onSelectChallenge={(chId) => { setSelectedChallengeId(chId); setMemberTab('challenges'); }}
      />

      <ArchitectureDocsModal isOpen={architectureDocsOpen} onClose={() => setArchitectureDocsOpen(false)} />
      <AssumptionsRegisterModal isOpen={assumptionsModalOpen} onClose={() => setAssumptionsModalOpen(false)} />
    </div>
  );
}
