import React, { useState } from 'react';
import {
  Plus,
} from 'lucide-react';
import { Assessment } from '../../types';
import { StorageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const AdminAssessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>(() =>
    StorageService.getAssessments()
  );
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'Microsoft',
    assessmentName: 'Codility Advanced Algorithms Challenge',
    date: '2026-10-12',
    time: '11:00 AM - 12:30 PM',
    duration: '90 minutes',
    platform: 'Codility Enterprise',
    topicsCoveredStr: 'Graphs, Dynamic Programming, SQL Optimization',
    totalQuestions: 3,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsm: Assessment = {
      id: `asm-${Date.now()}`,
      companyName: formData.companyName,
      assessmentName: formData.assessmentName,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      platform: formData.platform,
      status: 'Upcoming',
      topicsCovered: formData.topicsCoveredStr.split(',').map((s) => s.trim()),
      totalQuestions: formData.totalQuestions,
    };

    StorageService.saveAssessment(newAsm);
    setAssessments(StorageService.getAssessments());

    StorageService.createNotification({
      targetUser: 'all',
      title: `Assessment Scheduled: ${newAsm.companyName}`,
      message: `${newAsm.assessmentName} on ${newAsm.date} (${newAsm.duration}). Check assessments tab.`,
      type: 'assessment',
      linkTab: 'assessments',
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assessment Coordination</h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish online proctored coding assessments, test slots, and examine student completion rates
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Assessment</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((asm) => (
          <div
            key={asm.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-700 uppercase">{asm.companyName}</span>
                <StatusBadge status={asm.status} size="sm" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-3">{asm.assessmentName}</h3>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-3">
                <p>Date: <strong>{asm.date}</strong></p>
                <p>Time: <strong>{asm.time}</strong></p>
                <p>Duration: <strong>{asm.duration}</strong></p>
                <p>Platform: <strong>{asm.platform}</strong></p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Topics Covered:
                </span>
                <div className="flex flex-wrap gap-1">
                  {asm.topicsCovered.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {asm.score && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700">
                Sample Score Recorded: {asm.score}
              </div>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Schedule Placement Assessment"
          subtitle="Publish test timings and notify eligible candidates"
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assessment Name *</label>
              <input
                type="text"
                required
                value={formData.assessmentName}
                onChange={(e) => setFormData({ ...formData, assessmentName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration *</label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Platform *</label>
              <input
                type="text"
                required
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Topics Covered (comma separated)
              </label>
              <input
                type="text"
                value={formData.topicsCoveredStr}
                onChange={(e) => setFormData({ ...formData, topicsCoveredStr: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Schedule & Notify
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
