import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { StorageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';

const ALL_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected',
  'Rejected',
];

export const ApplicationManagement: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(() =>
    StorageService.getApplications()
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('Applied');
  const [statusNote, setStatusNote] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const companies = useMemo(() => {
    const list = Array.from(new Set(applications.map((a) => a.companyName)));
    return ['All', ...list];
  }, [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.studentName.toLowerCase().includes(q) ||
        app.companyName.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q) ||
        app.studentDepartment.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      const matchesCompany = companyFilter === 'All' || app.companyName === companyFilter;

      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [applications, search, statusFilter, companyFilter]);

  const handleOpenStatusModal = (app: Application) => {
    setActiveApp(app);
    setSelectedStatus(app.status);
    setStatusNote(app.notes || '');
  };

  const handleUpdateStatus = () => {
    if (!activeApp) return;

    StorageService.updateApplicationStatus(activeApp.id, selectedStatus, statusNote);
    const refreshed = StorageService.getApplications();
    setApplications(refreshed);

    if (selectedStatus === 'Selected') {
      const student = StorageService.getStudentById(activeApp.studentId);
      if (student) {
        student.placementStatus = 'Placed';
        student.placedCompany = activeApp.companyName;
        StorageService.saveStudent(student);
      }
    }

    setToastMsg(
      `Status for ${activeApp.studentName} updated to "${selectedStatus}". Student notified automatically!`
    );
    setTimeout(() => setToastMsg(null), 4000);
    setActiveApp(null);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Application Pipeline & Status Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate applications and advance candidates through recruitment stages
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
          {applications.length} Total Submissions
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by student, company, or department..."
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-600"
          >
            {companies.map((c) => (
              <option key={c} value={c}>
                Company: {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-600"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-5">Student Candidate</th>
                <th className="py-3 px-4">Department & CGPA</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-5 text-right">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-900 block">{app.studentName}</span>
                    <span className="text-[11px] text-slate-400">{app.studentEmail}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-800 font-medium block">
                      {app.studentDepartment}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-700">
                      CGPA: {app.studentCgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{app.companyName}</span>
                    <span className="text-[11px] text-slate-500">{app.role}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {app.appliedDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                    >
                      <span>Update Stage</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeApp && (
        <Modal
          isOpen={!!activeApp}
          onClose={() => setActiveApp(null)}
          title={`Update Status: ${activeApp.studentName}`}
          subtitle={`${activeApp.companyName} • ${activeApp.role}`}
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setActiveApp(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Save & Notify Candidate
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                New Recruitment Stage *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedStatus === st
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{st}</span>
                    {selectedStatus === st && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Recruiter Notes / Instructions
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Cleared Technical Round 1 with high score. Scheduled for Bar Raiser."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2">
              <Send className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Saving this will immediately broadcast an in-app notification to{' '}
                <strong>{activeApp.studentName}</strong> and refresh their dashboard pipeline.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
