import React, { useMemo } from 'react';
import {
  GraduationCap,
  Briefcase,
  FileText,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { DashboardCard } from '../../components/common/DashboardCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatusBadge } from '../../components/common/StatusBadge';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenJobDetails?: (jobId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateTab,
}) => {
  const { currentStudent } = useAuth();

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-500">Student session not loaded.</div>;
  }

  const allJobs = StorageService.getJobs();
  const allApplications = StorageService.getApplicationsByStudent(currentStudent.id);
  const allAssessments = StorageService.getAssessments();
  const allInterviews = StorageService.getInterviews().filter(
    (i) => i.studentId === currentStudent.id || !i.studentId
  );
  const prepCategories = StorageService.getPreparationCategories();

  const profileCompletion = StorageService.calculateProfileCompletion(currentStudent);

  const eligibleJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const res = StorageService.checkEligibility(currentStudent, job);
      return res.isEligible;
    });
  }, [allJobs, currentStudent]);

  const prepInsights = useMemo(() => {
    return prepCategories.map((cat) => {
      const total = cat.topics.length;
      const completed = cat.topics.filter((t) => t.completed).length;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { name: cat.name, pct, total, completed };
    });
  }, [prepCategories]);

  const lowPrepAreas = prepInsights.filter((p) => p.pct < 70);

  const missingSkillsSummary = useMemo(() => {
    const studentSkillsLower = (currentStudent.skills || []).map((s) => s.toLowerCase());
    const missingSet = new Set<string>();

    allJobs.forEach((job) => {
      job.requiredSkills.forEach((req) => {
        if (!studentSkillsLower.includes(req.toLowerCase())) {
          missingSet.add(req);
        }
      });
    });

    return Array.from(missingSet).slice(0, 4);
  }, [allJobs, currentStudent]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-800 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-indigo-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Campus Placement Season 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentStudent.fullName}!
            </h1>
            <p className="text-indigo-100/90 text-sm max-w-xl leading-relaxed">
              {currentStudent.department} • CGPA: <strong>{currentStudent.cgpa.toFixed(2)}</strong> •{' '}
              Graduation: <strong>{currentStudent.graduationYear}</strong>
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('jobs')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-800 font-bold text-xs shadow-sm hover:bg-indigo-50 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5" />
                Browse {allJobs.length} Job Openings
              </button>
              <button
                onClick={() => onNavigateTab('preparation')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 border border-white/20 text-white font-semibold text-xs transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Resume Prep Checklist
              </button>
            </div>
          </div>

          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-100">Profile Completion</span>
              <span className="text-sm font-bold text-white">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-200">
              {profileCompletion === 100
                ? 'Your profile is fully verified for all campus recruiters!'
                : 'Complete all fields and resume to boost recruiter visibility.'}
            </p>
            {profileCompletion < 100 && (
              <button
                onClick={() => onNavigateTab('profile')}
                className="mt-2 text-xs font-bold text-white underline hover:text-indigo-200"
              >
                Complete Profile →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <DashboardCard
          title="Profile"
          value={`${profileCompletion}%`}
          subtitle={profileCompletion >= 80 ? 'Well prepared' : 'Needs update'}
          icon={GraduationCap}
          iconColor="text-indigo-600"
          iconBgColor="bg-indigo-50"
          onClick={() => onNavigateTab('profile')}
        />
        <DashboardCard
          title="Eligible Jobs"
          value={eligibleJobs.length}
          subtitle={`Out of ${allJobs.length} drives`}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          onClick={() => onNavigateTab('jobs')}
        />
        <DashboardCard
          title="Applications"
          value={allApplications.length}
          subtitle="Submitted drives"
          icon={FileText}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          onClick={() => onNavigateTab('applications')}
        />
        <DashboardCard
          title="Interviews"
          value={allInterviews.length}
          subtitle="Scheduled / active"
          icon={CalendarCheck}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          onClick={() => onNavigateTab('interviews')}
        />
        <DashboardCard
          title="Skills"
          value={currentStudent.skills?.length || 0}
          subtitle="Verified tags"
          icon={Award}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
          onClick={() => onNavigateTab('profile')}
        />
        <div
          onClick={() => onNavigateTab('applications')}
          className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Status</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <StatusBadge status={currentStudent.placementStatus} size="sm" />
            <p className="text-[11px] text-slate-400 mt-1">
              {currentStudent.placedCompany
                ? `${currentStudent.placedCompany} (${currentStudent.placedPackage})`
                : 'Active Candidate'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white rounded-2xl border border-amber-200/80 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Smart Placement Insights</h3>
            <p className="text-[11px] text-slate-500">
              Personalized data recommendations based on your current academic & preparation profile
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-2xs">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Job Match Summary
            </p>
            <p className="text-slate-600 leading-relaxed">
              Your profile currently matches{' '}
              <strong className="text-indigo-700">{eligibleJobs.length} active placement drives</strong> based
              on your {currentStudent.cgpa} CGPA and {currentStudent.department} department.
            </p>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="mt-2 text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              View Eligible Drives <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-2xs">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Preparation Focus Areas
            </p>
            <p className="text-slate-600 leading-relaxed">
              {lowPrepAreas.length > 0
                ? `${lowPrepAreas.map((p) => p.name.split(' ')[0]).slice(0, 2).join(' and ')} are areas where you have incomplete preparation topics.`
                : 'Great job! You have reached over 70% completion in all technical preparation topics.'}
            </p>
            <button
              onClick={() => onNavigateTab('preparation')}
              className="mt-2 text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              Continue Practice <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-2xs">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Suggested Skill Additions
            </p>
            <p className="text-slate-600 leading-relaxed">
              High-package openings are frequently requiring:{' '}
              <span className="font-semibold text-slate-800">
                {missingSkillsSummary.join(', ') || 'System Design, Docker'}
              </span>
              . Consider adding them to your profile.
            </p>
            <button
              onClick={() => onNavigateTab('profile')}
              className="mt-2 text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              Update Skills <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-amber-100 text-[10px] text-slate-400 italic">
          Disclaimer: Insights are advisory based on past company recruitment patterns and do not
          guarantee placement offers.
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
              <p className="text-xs text-slate-500">Track active recruitment rounds & next steps</p>
            </div>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              View All ({allApplications.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {allApplications.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No applications yet</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Explore available placement opportunities and apply with 1-click.
              </p>
              <button
                onClick={() => onNavigateTab('jobs')}
                className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-2.5">Company & Role</th>
                    <th className="pb-2.5">Applied Date</th>
                    <th className="pb-2.5">Current Status</th>
                    <th className="pb-2.5">Next Milestone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allApplications.slice(0, 4).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 pr-3">
                        <span className="font-bold text-slate-900 block">{app.companyName}</span>
                        <span className="text-[11px] text-slate-500">{app.role}</span>
                      </td>
                      <td className="py-3 text-slate-600">{app.appliedDate}</td>
                      <td className="py-3">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="py-3 text-slate-600 max-w-xs truncate" title={app.nextStep}>
                        {app.nextStep}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                Upcoming Assessments
              </h3>
              <button
                onClick={() => onNavigateTab('assessments')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View
              </button>
            </div>

            <div className="space-y-2.5">
              {allAssessments.slice(0, 2).map((asm) => (
                <div key={asm.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{asm.companyName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {asm.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">{asm.assessmentName}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Date: {asm.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Preparation Tracker</h3>
            <div className="space-y-3">
              {prepInsights.slice(0, 3).map((cat) => (
                <ProgressBar
                  key={cat.name}
                  percentage={cat.pct}
                  label={cat.name.split('(')[0].trim()}
                  height="sm"
                  color={cat.pct > 70 ? 'emerald' : cat.pct > 40 ? 'indigo' : 'amber'}
                />
              ))}
            </div>
            <button
              onClick={() => onNavigateTab('preparation')}
              className="w-full mt-4 py-2 text-center text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Open Full Checklist ({prepCategories.length} Topics) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
