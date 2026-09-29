import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  FileText,
  FileCheck2,
  CalendarCheck,
  BookMarked,
  Bell,
  LogOut,
  Users,
  Building2,
  FileSpreadsheet,
  CalendarDays,
  BarChart3,
  Shield,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeColor?: string;
}

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
  openApplicationsCount?: number;
  upcomingInterviewsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  unreadCount = 0,
  openApplicationsCount = 0,
  upcomingInterviewsCount = 0,
}) => {
  const { userRole, currentStudent, logout } = useAuth();

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'jobs', label: 'Jobs & Drives', icon: Briefcase },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      badge: openApplicationsCount > 0 ? openApplicationsCount : undefined,
    },
    { id: 'assessments', label: 'Assessments', icon: FileCheck2 },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: CalendarCheck,
      badge: upcomingInterviewsCount > 0 ? upcomingInterviewsCount : undefined,
    },
    { id: 'preparation', label: 'Preparation', icon: BookMarked },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileSpreadsheet },
    { id: 'assessments', label: 'Assessments', icon: FileCheck2 },
    { id: 'interviews', label: 'Interviews', icon: CalendarDays },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {userRole === 'admin' ? (
              <Shield className="w-5 h-5" />
            ) : (
              currentStudent?.fullName?.charAt(0) || 'S'
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {userRole === 'admin' ? 'Placement Cell Admin' : currentStudent?.fullName}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-500 truncate">
                {userRole === 'admin' ? 'Officer Portal' : currentStudent?.department || 'Student Portal'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {userRole === 'admin' ? 'Placement Administration' : 'Student Navigation'}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                    item.badgeColor || (isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {userRole === 'student' && (
        <div className="p-3 mx-3 mb-2 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/80">
          <div className="flex items-center gap-1.5 text-indigo-800 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Placement Tip</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Ensure your CGPA and 3+ core technical skills are updated to qualify for Tier-1 company drives.
          </p>
        </div>
      )}

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
