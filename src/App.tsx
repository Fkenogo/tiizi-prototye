import React, { useState } from 'react';
import {
  Member,
  Group,
  Challenge,
  ActivitySubmission,
  CommunityMoment,
  NotificationAlert,
} from './types';
import {
  CURRENT_USER_AMINA,
  STEWARD_WANJIKU,
  MEMBER_DAVID,
  MEMBER_KIPCHOGE,
  ALL_MEMBERS,
  INITIAL_GROUPS,
  INITIAL_CHALLENGES,
  INITIAL_SUBMISSIONS,
  INITIAL_MOMENTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Header } from './components/common/Header';
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

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'today' | 'challenges' | 'groups' | 'catalogue'>('today');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Entities State
  const [currentMember, setCurrentMember] = useState<Member>(CURRENT_USER_AMINA);
  const [activeGroup, setActiveGroup] = useState<Group>(INITIAL_GROUPS[0]);
  const [allGroups, setAllGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [submissions, setSubmissions] = useState<ActivitySubmission[]>(INITIAL_SUBMISSIONS);
  const [moments, setMoments] = useState<CommunityMoment[]>(INITIAL_MOMENTS);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);

  // Modals & Drawers State
  const [referenceDrawerOpen, setReferenceDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [createChallengeOpen, setCreateChallengeOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logChallengeId, setLogChallengeId] = useState<string | undefined>(undefined);
  const [logActivityId, setLogActivityId] = useState<string | undefined>(undefined);
  const [shareModalChallenge, setShareModalChallenge] = useState<Challenge | null>(null);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [architectureDocsOpen, setArchitectureDocsOpen] = useState(false);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState(false);
  const [targetExceeded, setTargetExceeded] = useState(false);

  // Toggle Exceeded State for Collective demonstration (>100%)
  const handleToggleExceeded = () => {
    const nextState = !targetExceeded;
    setTargetExceeded(nextState);

    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === 'ch-walk-nairobi') {
          const total = nextState ? 524.0 : 438.5;
          const percent = (total / c.targetValue) * 100;
          return {
            ...c,
            collectiveProgress: {
              totalAccumulated: total,
              target: c.targetValue,
              percent,
              completedEarly: nextState,
            },
          };
        }
        return c;
      })
    );
  };

  // Quick Journey switcher from ReferenceDrawer
  const handleSelectJourney = (journeyId: string) => {
    switch (journeyId) {
      case 'journey-today':
        setSelectedChallengeId(null);
        setSelectedGroupId(null);
        setCurrentTab('today');
        break;
      case 'journey-collective':
        setSelectedChallengeId('ch-walk-nairobi');
        setCurrentTab('challenges');
        break;
      case 'journey-competitive':
        setSelectedChallengeId('ch-race-100k');
        setCurrentTab('challenges');
        break;
      case 'journey-streak':
        setSelectedChallengeId('ch-30day-movement');
        setCurrentTab('challenges');
        break;
      case 'journey-create':
        setCreateChallengeOpen(true);
        break;
      case 'journey-catalogue':
        setSelectedChallengeId(null);
        setSelectedGroupId(null);
        setCurrentTab('catalogue');
        break;
      default:
        break;
    }
  };

  // Switch Member Persona
  const handleSwitchMember = (member: Member) => {
    setCurrentMember(member);
  };

  // Open Log Modal helper
  const handleOpenLogModal = (challengeId?: string, activityId?: string) => {
    setLogChallengeId(challengeId);
    setLogActivityId(activityId);
    setLogModalOpen(true);
  };

  // Join Challenge
  const handleJoinChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          const exists = c.participants.some((p) => p.memberId === currentMember.id);
          if (exists) return c;

          const newParticipant = {
            memberId: currentMember.id,
            name: currentMember.name,
            avatar: currentMember.avatar,
            accumulatedValue: 0,
            unit: c.targetUnit,
            lastContributionAt: 'Just joined',
            rank: null,
            finished: false,
            daysCompleted: 0,
            currentStreak: 0,
            bestStreak: 0,
            todayCompleted: false,
            todayRequirementsDone: {},
          };

          return {
            ...c,
            participants: [...c.participants, newParticipant],
          };
        }
        return c;
      })
    );

    // Add Moment
    const ch = challenges.find((c) => c.id === challengeId);
    if (ch) {
      setMoments((prev) => [
        {
          id: `mom-${Date.now()}`,
          type: 'activity_logged',
          actorName: currentMember.name,
          actorAvatar: currentMember.avatar,
          actorId: currentMember.id,
          challengeId: ch.id,
          challengeTitle: ch.title,
          challengeType: ch.type,
          headline: 'Affirmatively Joined Challenge',
          detail: `${currentMember.name} joined ${ch.title} in ${ch.groupName}. Ready to contribute!`,
          timestamp: 'Just now',
          kudos: 3,
          hasKudoed: false,
        },
        ...prev,
      ]);
    }
  };

  // Handle Log submission callback
  const handleActivitySubmitted = (
    newSubmission: ActivitySubmission,
    updatedChallenge: Challenge
  ) => {
    setSubmissions((prev) => [newSubmission, ...prev]);

    setChallenges((prev) =>
      prev.map((c) => (c.id === updatedChallenge.id ? updatedChallenge : c))
    );

    // Create community moment
    const newMoment: CommunityMoment = {
      id: `mom-${Date.now()}`,
      type:
        updatedChallenge.type === 'streak' && newSubmission.value >= 1
          ? 'daily_done'
          : 'activity_logged',
      actorName: currentMember.name,
      actorAvatar: currentMember.avatar,
      actorId: currentMember.id,
      challengeId: updatedChallenge.id,
      challengeTitle: updatedChallenge.title,
      challengeType: updatedChallenge.type,
      headline: `Logged ${newSubmission.value} ${newSubmission.unit} of ${newSubmission.activityName}`,
      detail:
        newSubmission.note ||
        `Progress applied to ${updatedChallenge.title} in ${updatedChallenge.groupName}.`,
      timestamp: 'Just now',
      kudos: 1,
      hasKudoed: false,
    };
    setMoments((prev) => [newMoment, ...prev]);
  };

  // Create Challenge callback
  const handleCreateChallenge = (newChallenge: Challenge) => {
    setChallenges((prev) => [newChallenge, ...prev]);
    setSelectedChallengeId(newChallenge.id);
    setCurrentTab('challenges');

    // Community moment
    setMoments((prev) => [
      {
        id: `mom-${Date.now()}`,
        type: 'milestone',
        actorName: currentMember.name,
        actorAvatar: currentMember.avatar,
        actorId: currentMember.id,
        challengeId: newChallenge.id,
        challengeTitle: newChallenge.title,
        challengeType: newChallenge.type,
        headline: 'Launched New Community Challenge',
        detail: `New challenge open for participation: "${newChallenge.title}" in ${newChallenge.groupName}.`,
        timestamp: 'Just now',
        kudos: 4,
        hasKudoed: false,
      },
      ...prev,
    ]);
  };

  // Create Group callback
  const handleCreateGroup = (newGroup: Group) => {
    setAllGroups((prev) => [newGroup, ...prev]);
    setActiveGroup(newGroup);
    setSelectedGroupId(newGroup.id);
    setCurrentTab('groups');
  };

  // Run Again callback for completed challenges
  const handleRunAgain = (oldChallenge: Challenge) => {
    const freshChallenge: Challenge = {
      ...oldChallenge,
      id: `ch-${Date.now()}`,
      title: `${oldChallenge.title} (Cycle 2)`,
      status: 'active',
      startDate: 'Sep 15, 2026',
      endDate: 'Sep 29, 2026',
      participants: oldChallenge.participants.map((p) => ({
        ...p,
        accumulatedValue: 0,
        rank: null,
        finished: false,
        daysCompleted: 0,
        currentStreak: 0,
        todayCompleted: false,
        todayRequirementsDone: {},
      })),
      collectiveProgress:
        oldChallenge.type === 'collective'
          ? {
              totalAccumulated: 0,
              target: oldChallenge.targetValue,
              percent: 0,
              completedEarly: false,
            }
          : undefined,
    };

    setChallenges((prev) => [freshChallenge, ...prev]);
    setSelectedChallengeId(freshChallenge.id);
  };

  // Kudo handlers
  const handleKudoMoment = (momentId: string) => {
    setMoments((prev) =>
      prev.map((m) =>
        m.id === momentId
          ? {
              ...m,
              kudos: m.hasKudoed ? m.kudos - 1 : m.kudos + 1,
              hasKudoed: !m.hasKudoed,
            }
          : m
      )
    );
  };

  const handleKudoSubmission = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          const has = s.kudosGivenBy.includes(currentMember.id);
          return {
            ...s,
            kudosCount: has ? s.kudosCount - 1 : s.kudosCount + 1,
            kudosGivenBy: has
              ? s.kudosGivenBy.filter((id) => id !== currentMember.id)
              : [...s.kudosGivenBy, currentMember.id],
          };
        }
        return s;
      })
    );
  };

  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId);
  const viewingGroup = selectedGroupId
    ? allGroups.find((g) => g.id === selectedGroupId) || activeGroup
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-zinc-900 pb-16 md:pb-0">
      {/* 0. Engineering Experience Reference Top Controller Bar */}
      <ExperienceBar
        currentMember={currentMember}
        onSwitchMember={handleSwitchMember}
        onSelectJourney={handleSelectJourney}
        onOpenArchitectureDocs={() => setArchitectureDocsOpen(true)}
        onOpenAssumptionsRegister={() => setAssumptionsModalOpen(true)}
        onToggleExceededState={handleToggleExceeded}
        targetExceeded={targetExceeded}
      />

      {/* 1. Main Mobile-First Tiizi Header with Reference Trigger */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedChallengeId(null);
          setSelectedGroupId(null);
          setCurrentTab(tab);
        }}
        currentMember={currentMember}
        unreadNotificationCount={notifications.filter((n) => !n.read).length}
        onOpenNotifications={() => setNotificationsDrawerOpen(true)}
        onOpenReferenceDrawer={() => setReferenceDrawerOpen(true)}
        onOpenProfileDrawer={() => setProfileDrawerOpen(true)}
      />

      {/* 2. Dynamic Human-Facing Content Body */}
      <main className="flex-1 pb-16">
        {selectedChallenge ? (
          /* Detailed Challenge Screen */
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
        ) : currentTab === 'today' ? (
          /* Today View: What should I do in Tiizi right now? */
          <TodayView
            currentMember={currentMember}
            challenges={challenges}
            activeGroup={activeGroup}
            moments={moments}
            onSelectChallenge={(chId) => setSelectedChallengeId(chId)}
            onOpenLogModal={handleOpenLogModal}
            onJoinChallenge={handleJoinChallenge}
            onNavigateToChallenges={() => setCurrentTab('challenges')}
            onNavigateToGroup={(grpId) => {
              if (grpId) {
                const found = allGroups.find((g) => g.id === grpId);
                if (found) setActiveGroup(found);
                setSelectedGroupId(grpId);
              }
              setCurrentTab('groups');
            }}
            onKudoMoment={handleKudoMoment}
          />
        ) : currentTab === 'challenges' ? (
          /* Challenges List View */
          <ChallengeListView
            challenges={challenges}
            currentMember={currentMember}
            onSelectChallenge={(chId) => setSelectedChallengeId(chId)}
            onJoinChallenge={handleJoinChallenge}
            onLogChallenge={(chId) => handleOpenLogModal(chId)}
            onOpenCreateChallenge={() => setCreateChallengeOpen(true)}
            onRunAgain={handleRunAgain}
          />
        ) : currentTab === 'groups' ? (
          viewingGroup ? (
            /* Group Detail View */
            <GroupDetailView
              group={viewingGroup}
              currentMember={currentMember}
              challenges={challenges}
              moments={moments}
              onBack={() => setSelectedGroupId(null)}
              onSelectChallenge={(chId) => setSelectedChallengeId(chId)}
              onJoinChallenge={handleJoinChallenge}
              onLogChallenge={(chId) => handleOpenLogModal(chId)}
              onOpenCreateChallenge={() => setCreateChallengeOpen(true)}
              onOpenCreateGroup={() => setCreateGroupOpen(true)}
              onKudoMoment={handleKudoMoment}
            />
          ) : (
            /* Groups Directory View */
            <GroupListView
              groups={allGroups}
              challenges={challenges}
              currentMember={currentMember}
              onSelectGroup={(grp) => {
                setActiveGroup(grp);
                setSelectedGroupId(grp.id);
              }}
              onOpenCreateGroup={() => setCreateGroupOpen(true)}
            />
          )
        ) : (
          /* Activity Guide Catalogue */
          <ActivityCatalogueView />
        )}
      </main>

      {/* Footer Note */}
      <footer className="bg-white border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-900 tracking-tight">tiizi</span>
            <span>• Tiizi Experience Reference v1</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Product truth governs engines; Experience Reference governs human-facing assembly.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAssumptionsModalOpen(true)}
              className="text-amber-700 hover:text-amber-800 font-bold text-xs underline cursor-pointer"
            >
              Assumptions Register (10)
            </button>
            <button
              onClick={() => setArchitectureDocsOpen(true)}
              className="text-orange-600 hover:text-orange-700 font-bold text-xs underline cursor-pointer"
            >
              UX Architecture Reference
            </button>
          </div>
        </div>
      </footer>

      {/* 3. Reference Mode Drawer */}
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
      />

      {/* 4. Profile & Persona Drawer */}
      <ProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        currentMember={currentMember}
        allGroups={allGroups}
        challenges={challenges}
        onSelectGroup={(grpId) => {
          setSelectedGroupId(grpId);
          setCurrentTab('groups');
        }}
        onSelectChallenge={(chId) => {
          setSelectedChallengeId(chId);
          setCurrentTab('challenges');
        }}
        onOpenReferenceDrawer={() => setReferenceDrawerOpen(true)}
      />

      {/* 5. Modals */}
      <CreateChallengeWizard
        isOpen={createChallengeOpen}
        onClose={() => setCreateChallengeOpen(false)}
        allGroups={allGroups}
        activeGroup={activeGroup}
        currentMember={currentMember}
        onCreateChallenge={handleCreateChallenge}
      />

      <CreateGroupModal
        isOpen={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        currentMember={currentMember}
        onCreateGroup={handleCreateGroup}
      />

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
        <ShareModal
          isOpen={!!shareModalChallenge}
          onClose={() => setShareModalChallenge(null)}
          challenge={shareModalChallenge}
          currentMember={currentMember}
        />
      )}

      <NotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onSelectChallenge={(chId) => {
          setSelectedChallengeId(chId);
          setCurrentTab('challenges');
        }}
      />

      <ArchitectureDocsModal
        isOpen={architectureDocsOpen}
        onClose={() => setArchitectureDocsOpen(false)}
      />

      <AssumptionsRegisterModal
        isOpen={assumptionsModalOpen}
        onClose={() => setAssumptionsModalOpen(false)}
      />
    </div>
  );
}
