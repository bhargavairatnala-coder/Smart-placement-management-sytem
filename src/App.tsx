import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StorageService } from './services/storage';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Public & Auth Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProjectGuideModal } from './pages/guide/ProjectGuideModal';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyProfile } from './pages/student/MyProfile';
import { JobsPage } from './pages/student/JobsPage';
import { MyApplications } from './pages/student/MyApplications';
import { AssessmentsPage } from './pages/student/AssessmentsPage';
import { InterviewTracker } from './pages/student/InterviewTracker';
import { PlacementPreparation } from './pages/student/PlacementPreparation';
import { StudentNotifications } from './pages/student/StudentNotifications';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagement } from './pages/admin/StudentManagement';
import { CompanyManagement } from './pages/admin/CompanyManagement';
import { JobManagement } from './pages/admin/JobManagement';
import { ApplicationManagement } from './pages/admin/ApplicationManagement';
import { AdminAssessments } from './pages/admin/AdminAssessments';
import { AdminInterviews } from './pages/admin/AdminInterviews';
import { ReportsPage } from './pages/admin/ReportsPage';

const AppContent: React.FC = () => {
  const { userRole, currentStudent, isAuthenticated } = useAuth();

  // Navigation states
  const [publicView, setPublicView] = useState<'landing' | 'login' | 'register'>('landing');
  const [loginRole, setLoginRole] = useState<'student' | 'admin'>('student');
  const [studentTab, setStudentTab] = useState<string>('dashboard');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Responsive mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Storage notification count reactive listener
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setUpdateKey((prev) => prev + 1);
    };
    window.addEventListener('spms_storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('spms_storage_updated', handleStorageUpdate);
    };
  }, []);

  // Compute live counts
  const unreadCount = React.useMemo(() => {
    if (userRole === 'student' && currentStudent) {
      const notifs = StorageService.getNotifications(currentStudent.id, 'student');
      return notifs.filter((n) => !n.read).length;
    } else if (userRole === 'admin') {
      const notifs = StorageService.getNotifications('admin', 'admin');
      return notifs.filter((n) => !n.read).length;
    }
    return 0;
  }, [userRole, currentStudent, updateKey]);

  const studentApplicationsCount = React.useMemo(() => {
    if (userRole === 'student' && currentStudent) {
      return StorageService.getApplicationsByStudent(currentStudent.id).length;
    }
    return 0;
  }, [userRole, currentStudent, updateKey]);

  const studentInterviewsCount = React.useMemo(() => {
    if (userRole === 'student' && currentStudent) {
      return StorageService.getInterviews().filter(
        (i) => (!i.studentId || i.studentId === currentStudent.id) && i.status === 'Scheduled'
      ).length;
    }
    return 0;
  }, [userRole, currentStudent, updateKey]);

  // Handle landing navigation actions
  const handleSelectLogin = (target: 'student' | 'admin' | 'register') => {
    if (target === 'register') {
      setPublicView('register');
    } else {
      setLoginRole(target);
      setPublicView('login');
    }
  };

  // If user is not authenticated, show Landing, Login, or Register
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {publicView === 'landing' && (
          <LandingPage
            onSelectLogin={handleSelectLogin}
            onOpenGuide={() => setGuideModalOpen(true)}
          />
        )}

        {publicView === 'login' && (
          <LoginPage
            initialRole={loginRole}
            onNavigateRegister={() => setPublicView('register')}
            onNavigateHome={() => setPublicView('landing')}
          />
        )}

        {publicView === 'register' && (
          <RegisterPage
            onNavigateLogin={() => {
              setLoginRole('student');
              setPublicView('login');
            }}
            onNavigateHome={() => setPublicView('landing')}
          />
        )}

        <ProjectGuideModal
          isOpen={guideModalOpen}
          onClose={() => setGuideModalOpen(false)}
        />
      </div>
    );
  }

  // --- Authenticated Student View ---
  if (userRole === 'student') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
        <Navbar
          onOpenNotifications={() => setStudentTab('notifications')}
          unreadCount={unreadCount}
          onOpenGuideModal={() => setGuideModalOpen(true)}
          currentTab={studentTab}
          onSwitchTab={(tab) => setStudentTab(tab)}
        />

        {/* Mobile Sidebar Toggle Bar */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <span>Navigation Menu</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">
              {studentTab}
            </span>
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Student: {currentStudent?.fullName?.split(' ')[0]}
          </span>
        </div>

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Desktop & Mobile Sidebar */}
          <div
            className={`${
              mobileMenuOpen ? 'block' : 'hidden'
            } md:block fixed inset-0 z-30 md:static md:z-auto bg-slate-900/40 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-64 max-w-[80vw] h-full bg-white shadow-xl md:shadow-none"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                currentTab={studentTab}
                onTabChange={(tab) => {
                  setStudentTab(tab);
                  setMobileMenuOpen(false);
                }}
                unreadCount={unreadCount}
                openApplicationsCount={studentApplicationsCount}
                upcomingInterviewsCount={studentInterviewsCount}
              />
            </div>
          </div>

          {/* Main Student Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
            {studentTab === 'dashboard' && (
              <StudentDashboard onNavigateTab={(tab) => setStudentTab(tab)} />
            )}
            {studentTab === 'profile' && <MyProfile />}
            {studentTab === 'jobs' && (
              <JobsPage onNavigateTab={(tab) => setStudentTab(tab)} />
            )}
            {studentTab === 'applications' && (
              <MyApplications onNavigateTab={(tab) => setStudentTab(tab)} />
            )}
            {studentTab === 'assessments' && <AssessmentsPage />}
            {studentTab === 'interviews' && <InterviewTracker />}
            {studentTab === 'preparation' && <PlacementPreparation />}
            {studentTab === 'notifications' && (
              <StudentNotifications onNavigateTab={(tab) => setStudentTab(tab)} />
            )}
          </main>
        </div>

        <ProjectGuideModal
          isOpen={guideModalOpen}
          onClose={() => setGuideModalOpen(false)}
        />
      </div>
    );
  }

  // --- Authenticated Admin View ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar
        onOpenNotifications={() => setAdminTab('applications')}
        unreadCount={unreadCount}
        onOpenGuideModal={() => setGuideModalOpen(true)}
        currentTab={adminTab}
        onSwitchTab={(tab) => setAdminTab(tab)}
      />

      {/* Mobile Sidebar Toggle Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <span>Admin Menu</span>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">
            {adminTab}
          </span>
        </button>
        <span className="text-xs text-indigo-700 font-semibold">Placement Cell</span>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop & Mobile Sidebar */}
        <div
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block fixed inset-0 z-30 md:static md:z-auto bg-slate-900/40 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 max-w-[80vw] h-full bg-white shadow-xl md:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              currentTab={adminTab}
              onTabChange={(tab) => {
                setAdminTab(tab);
                setMobileMenuOpen(false);
              }}
              unreadCount={unreadCount}
            />
          </div>
        </div>

        {/* Main Admin Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {adminTab === 'dashboard' && (
            <AdminDashboard onNavigateTab={(tab) => setAdminTab(tab)} />
          )}
          {adminTab === 'students' && <StudentManagement />}
          {adminTab === 'companies' && <CompanyManagement />}
          {adminTab === 'jobs' && <JobManagement />}
          {adminTab === 'applications' && <ApplicationManagement />}
          {adminTab === 'assessments' && <AdminAssessments />}
          {adminTab === 'interviews' && <AdminInterviews />}
          {adminTab === 'reports' && <ReportsPage />}
        </main>
      </div>

      <ProjectGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
