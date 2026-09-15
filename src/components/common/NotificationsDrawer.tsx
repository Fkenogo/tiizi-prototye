import React from 'react';
import { NotificationAlert } from '../../types';
import { Bell, Check, X, Flame, Target, Trophy, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationAlert[];
  onMarkAllRead: () => void;
  onSelectChallenge: (challengeId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectChallenge,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col border-l border-zinc-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 text-sm">Notifications</h3>
                  <p className="text-xs text-zinc-500">Group and Challenge reminders</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium px-2 py-1 hover:bg-orange-50 rounded"
                >
                  Mark all read
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 stroke-1" />
                  <p className="text-sm">No notifications right now</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const getIcon = () => {
                    switch (n.type) {
                      case 'streak_reminder':
                        return <Clock className="w-4 h-4 text-amber-600" />;
                      case 'target_nearing':
                        return <Target className="w-4 h-4 text-orange-600" />;
                      case 'kudo':
                        return <Flame className="w-4 h-4 text-rose-600" />;
                      case 'milestone':
                        return <Trophy className="w-4 h-4 text-emerald-600" />;
                      default:
                        return <Bell className="w-4 h-4 text-zinc-600" />;
                    }
                  };

                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.targetChallengeId) {
                          onSelectChallenge(n.targetChallengeId);
                          onClose();
                        }
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        n.read
                          ? 'bg-zinc-50/70 border-zinc-100 hover:bg-zinc-100'
                          : 'bg-orange-50/50 border-orange-200/70 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white shadow-xs shrink-0 mt-0.5">
                          {getIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-semibold text-zinc-900 truncate">
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                            {n.body}
                          </p>
                          {n.targetChallengeId && (
                            <span className="inline-block mt-2 text-[11px] font-medium text-orange-600 hover:underline">
                              View challenge &rarr;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-100 bg-zinc-50 text-[11px] text-zinc-500 text-center">
              Tiizi only alerts for meaningful accountability, never spam.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
