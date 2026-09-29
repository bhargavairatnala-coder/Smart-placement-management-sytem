import React, { useMemo } from 'react';
import {
  Users,
  Building2,
  Briefcase,
  FileSpreadsheet,
  CheckCircle2,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { DashboardCard } from '../../components/common/DashboardCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const students = StorageService.getStudents();
  const companies = StorageService.getCompanies();
  const jobs = StorageService.getJobs();
  const applications = StorageService.getApplications();

  const totalStudents = students.length;
  const totalCompanies = companies.length;
  const totalJobs = jobs.length;
  const totalApplications = applications.length;

  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;
  const placedStudentsCount = students.filter(
    (s) => s.placementStatus === 'Placed' || s.placementStatus === 'Multiple Offers'
  ).length;

  const placementPct =
    totalStudents > 0 ? Math.round((placedStudentsCount / totalStudents) * 100) : 0;

  const deptBreakdown = useMemo(() => {
    const map: Record<string, { total: number; placed: number }> = {};
    students.forEach((s) => {
      const d = s.department || 'Other';
      if (!map[d]) map[d] = { total: 0, placed: 0 };
      map[d].total += 1;
      if (s.placementStatus === 'Placed' || s.placementStatus === 'Multiple Offers') {
        map[d].placed += 1;
      }
    });
    return Object.entries(map).map(([dept, data]) => ({
      dept,
      total: data.total,
      placed: data.placed,
      pct: data.total > 0 ? Math.round((data.placed / data.total) * 100) : 0,
    }));
  }, [students]);

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Placement Cell Administrative Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Placement Cell Executive Dashboard
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Monitor real-time company recruitment pipelines, candidate shortlisting, and placement percentages across departments.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigateTab('jobs')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            + Post Placement Drive
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors"
          >
            View Full Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <DashboardCard
          title="Total Students"
          value={totalStudents}
          subtitle="Final year batch"
          icon={Users}
          iconColor="text-indigo-600"
          iconBgColor="bg-indigo-50"
          onClick={() => onNavigateTab('students')}
        />
        <DashboardCard
          title="Companies"
          value={totalCompanies}
          subtitle="Corporate partners"
          icon={Building2}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
          onClick={() => onNavigateTab('companies')}
        />
        <DashboardCard
          title="Active Drives"
          value={totalJobs}
          subtitle="Open positions"
          icon={Briefcase}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50"
          onClick={() => onNavigateTab('jobs')}
        />
        <DashboardCard
          title="Applications"
          value={totalApplications}
          subtitle="Submitted profiles"
          icon={FileSpreadsheet}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
          onClick={() => onNavigateTab('applications')}
        />
        <DashboardCard
          title="Shortlisted"
          value={shortlistedCount}
          subtitle="In assessment/rounds"
          icon={Award}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50"
          onClick={() => onNavigateTab('applications')}
        />
        <DashboardCard
          title="Offers Made"
          value={selectedCount}
          subtitle={`${placementPct}% Placed`}
          icon={CheckCircle2}
          iconColor="text-teal-600"
          iconBgColor="bg-teal-50"
          onClick={() => onNavigateTab('reports')}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Department-wise Placement Progress
              </h3>
              <p className="text-xs text-slate-500">Placed percentage by academic branch</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Export Data →
            </button>
          </div>

          <div className="space-y-4">
            {deptBreakdown.map((item) => (
              <div key={item.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{item.dept}</span>
                  <span className="text-slate-900 font-bold">
                    {item.placed}/{item.total} Placed ({item.pct}%)
                  </span>
                </div>
                <ProgressBar
                  percentage={item.pct}
                  showValue={false}
                  height="md"
                  color={item.pct >= 75 ? 'emerald' : item.pct >= 40 ? 'indigo' : 'amber'}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Application Pipeline Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">Active student flow across hiring stages</p>

            <div className="space-y-2.5">
              {[
                { label: 'Applied (Under Verification)', count: applications.filter((a) => a.status === 'Applied').length, color: 'bg-sky-500' },
                { label: 'Shortlisted for Assessment', count: shortlistedCount, color: 'bg-blue-500' },
                { label: 'Coding / Skill Assessment', count: applications.filter((a) => a.status === 'Assessment').length, color: 'bg-amber-500' },
                { label: 'Technical & HR Interviews', count: applications.filter((a) => a.status === 'Interview').length, color: 'bg-purple-500' },
                { label: 'Final Offers Selected', count: selectedCount, color: 'bg-emerald-500' },
              ].map((stage) => {
                const pct =
                  totalApplications > 0 ? Math.round((stage.count / totalApplications) * 100) : 0;
                return (
                  <div
                    key={stage.label}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className="font-medium text-slate-700">{stage.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {stage.count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('applications')}
            className="w-full mt-4 py-2 text-center text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            Manage All Applications →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Applications Stream</h3>
            <p className="text-xs text-slate-500">Live candidate submissions across active drives</p>
          </div>
          <button
            onClick={() => onNavigateTab('applications')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View All ({totalApplications})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">CGPA</th>
                <th className="py-2.5 px-4">Company & Role</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{app.studentName}</td>
                  <td className="py-3 px-4 text-slate-600">{app.studentDepartment}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{app.studentCgpa.toFixed(2)}</td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="font-semibold">{app.companyName}</span> ({app.role})
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigateTab('applications')}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
