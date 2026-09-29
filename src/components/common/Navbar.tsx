import React from 'react';
import {
  GraduationCap,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenNotifications?: () => void;
  unreadCount?: number;
  onOpenGuideModal: () => void;
  onNavigateLanding?: (section: string) => void;
  currentTab?: string;
  onSwitchTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  unreadCount = 0,
  onOpenGuideModal,
  onNavigateLanding,
  onSwitchTab,
}) => {
  const { userRole, currentStudent, adminUser, logout, quickDemoLogin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              if (userRole) {
                onSwitchTab?.('dashboard');
              } else {
                onNavigateLanding?.('home');
              }
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Smart Placement
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/60 uppercase">
                  Portal
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500">
                Prepare Smart. Apply Smart. Get Placed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shadow-xs"
              title="View Architecture, Viva Questions & Backend Connection Guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Project & Viva Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {userRole ? (
              <>
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                    {userRole === 'admin' ? (
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    ) : (
                      currentStudent?.fullName?.charAt(0) || <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {userRole === 'admin' ? adminUser?.name : currentStudent?.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {userRole === 'admin' ? 'Placement Admin' : currentStudent?.department || 'Student'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => quickDemoLogin('student')}
                  className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  Student Demo
                </button>
                <button
                  onClick={() => quickDemoLogin('admin')}
                  className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Admin Demo
                </button>
                <button
                  onClick={() => onNavigateLanding?.('login-student')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-600/20 transition-all"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
