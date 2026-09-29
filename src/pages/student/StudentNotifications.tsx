import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Briefcase,
  CalendarCheck,
  FileCheck2,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';

interface StudentNotificationsProps {
  onNavigateTab: (tab: string) => void;
}

export const StudentNotifications: React.FC<StudentNotificationsProps> = ({ onNavigateTab }) => {
  const { currentStudent, userRole } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications(currentStudent?.id || 'std-101', userRole || 'student')
  );

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(
      StorageService.getNotifications(currentStudent?.id || 'std-101', userRole || 'student')
    );
  };

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead(currentStudent?.id || 'std-101');
    setNotifications(
      StorageService.getNotifications(currentStudent?.id || 'std-101', userRole || 'student')
    );
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'interview':
        return <CalendarCheck className="w-4 h-4 text-purple-600" />;
      case 'assessment':
        return <FileCheck2 className="w-4 h-4 text-amber-600" />;
      case 'status':
        return <CheckCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Placement Alerts & Notices</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time notifications on drive deadlines, test slots, and recruiter actions
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No notifications</h3>
          <p className="text-xs text-slate-500 mt-1">
            You are completely caught up with all placement cell communications.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                !item.read ? 'bg-indigo-50/40' : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block shrink-0" />
                    )}
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-2">{item.message}</p>

                <div className="flex items-center gap-3">
                  {item.linkTab && (
                    <button
                      onClick={() => onNavigateTab(item.linkTab!)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <span>View in {item.linkTab.toUpperCase()}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  {!item.read && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
