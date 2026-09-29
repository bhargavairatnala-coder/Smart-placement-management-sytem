import React, { useMemo } from 'react';
import {
  Download,
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { ProgressBar } from '../../components/common/ProgressBar';

export const ReportsPage: React.FC = () => {
  const students = StorageService.getStudents();
  const applications = StorageService.getApplications();

  const totalStudents = students.length;
  const placedStudents = students.filter(
    (s) => s.placementStatus === 'Placed' || s.placementStatus === 'Multiple Offers'
  );
  const inProcessStudents = students.filter((s) => s.placementStatus === 'In Process');

  const placementPercentage =
    totalStudents > 0 ? Math.round((placedStudents.length / totalStudents) * 100) : 0;

  const companyApplications = useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach((a) => {
      map[a.companyName] = (map[a.companyName] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      pct: applications.length > 0 ? Math.round((count / applications.length) * 100) : 0,
    }));
  }, [applications]);

  const selectedApps = applications.filter((a) => a.status === 'Selected');

  const handleExportCSV = () => {
    const rows = [
      ['Student Name', 'Department', 'CGPA', 'Placement Status', 'Placed Company'],
      ...students.map((s) => [
        s.fullName,
        s.department,
        s.cgpa.toString(),
        s.placementStatus,
        s.placedCompany || 'N/A',
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Placement_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Placement Analytics & Institutional Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official summary metrics for academic council, accreditation bodies, and corporate review
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Candidates</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalStudents}</p>
          <p className="text-xs text-slate-500 mt-1">Final-year cohort</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Placed Students</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{placedStudents.length}</p>
          <p className="text-xs text-slate-500 mt-1">{placementPercentage}% Aggregate Placed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-amber-600 uppercase">In Active Rounds</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{inProcessStudents.length}</p>
          <p className="text-xs text-slate-500 mt-1">Interviews in progress</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Applications</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{applications.length}</p>
          <p className="text-xs text-slate-500 mt-1">Across all companies</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Company-wise Application Volumes</h3>
          <p className="text-xs text-slate-500 mb-4">Distribution of candidate drive submissions</p>

          <div className="space-y-4">
            {companyApplications.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="text-slate-600">
                    <strong>{item.count} applications</strong> ({item.pct}%)
                  </span>
                </div>
                <ProgressBar percentage={item.pct} showValue={false} height="sm" color="indigo" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Final Offers & Selections</h3>
            <p className="text-xs text-slate-500 mb-4">Candidates who completed all hiring rounds</p>

            <div className="space-y-2.5">
              {selectedApps.length === 0 ? (
                <p className="text-xs text-slate-400">No candidates finalized yet.</p>
              ) : (
                selectedApps.map((sel) => (
                  <div
                    key={sel.id}
                    className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{sel.studentName}</span>
                      <span className="text-emerald-800 text-[11px] font-semibold">
                        {sel.companyName} • {sel.role}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      Selected
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Average CTC for placed students: <strong>₹18.4 LPA</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
