import React, { useState } from 'react';
import {
  FileText,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

interface MyApplicationsProps {
  onNavigateTab: (tab: string) => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({ onNavigateTab }) => {
  const { currentStudent } = useAuth();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  if (!currentStudent) return null;

  const applications = StorageService.getApplicationsByStudent(currentStudent.id);

  const getStepTimeline = (status: ApplicationStatus) => {
    const steps: { name: ApplicationStatus; label: string }[] = [
      { name: 'Applied', label: 'Application Submitted' },
      { name: 'Shortlisted', label: 'Profile Shortlisted' },
      { name: 'Assessment', label: 'Online Coding / Test' },
      { name: 'Interview', label: 'Technical & HR Rounds' },
      { name: 'Selected', label: 'Offer Received' },
    ];

    const statusOrder = ['Applied', 'Shortlisted', 'Assessment', 'Interview', 'Selected'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, idx) => {
      let state: 'completed' | 'active' | 'upcoming' | 'rejected' = 'upcoming';
      if (status === 'Rejected') {
        state = idx === 0 ? 'completed' : 'rejected';
      } else if (idx < currentIndex) {
        state = 'completed';
      } else if (idx === currentIndex) {
        state = 'active';
      }
      return { ...step, state };
    });
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Job Applications</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline tracking across all campus placement drives
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('jobs')}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          + Apply for New Job
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven&apos;t applied to any placement opportunities yet. Explore open drives and submit your profile.
          </p>
          <button
            onClick={() => onNavigateTab('jobs')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Explore Job Drives
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-5">Company</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Next Step</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {app.companyName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{app.role}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {app.appliedDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={app.nextStep}>
                      {app.nextStep}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Details: ${selectedApp.companyName}`}
          subtitle={`Role: ${selectedApp.role} • Submitted on ${selectedApp.appliedDate}`}
          maxWidth="xl"
          footer={
            <div className="flex justify-between w-full">
              <span className="text-xs text-slate-400 self-center">
                Application ID: {selectedApp.id}
              </span>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Current Phase</p>
                <div className="mt-1">
                  <StatusBadge status={selectedApp.status} size="lg" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Next Action</p>
                <p className="text-xs font-semibold text-slate-800 mt-1 max-w-xs">
                  {selectedApp.nextStep}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
                Recruitment Round Progression
              </h4>
              <div className="space-y-2">
                {getStepTimeline(selectedApp.status).map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                      step.state === 'active'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                        : step.state === 'completed'
                        ? 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        step.state === 'active'
                          ? 'bg-indigo-600 text-white'
                          : step.state === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step.state === 'completed' ? '✓' : idx + 1}
                    </span>
                    <span className="flex-1 text-xs">{step.label}</span>
                    <span className="text-[10px] font-semibold uppercase">
                      {step.state === 'active'
                        ? 'Current Round'
                        : step.state === 'completed'
                        ? 'Passed'
                        : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedApp.notes && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-700">
                <p className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                  Placement Cell Verification Note:
                </p>
                <p className="text-xs text-amber-950">{selectedApp.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
