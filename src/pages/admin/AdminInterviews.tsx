import React, { useState } from 'react';
import {
  Plus,
} from 'lucide-react';
import { Interview, Student } from '../../types';
import { StorageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const AdminInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>(() =>
    StorageService.getInterviews()
  );
  const [students] = useState<Student[]>(() => StorageService.getStudents());
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.fullName || '',
    companyName: 'Amazon',
    role: 'Software Development Engineer - AWS',
    interviewRound: 'Technical Round' as Interview['interviewRound'],
    date: '2026-10-15',
    time: '02:00 PM - 03:00 PM',
    mode: 'Online (Google Meet)' as Interview['mode'],
    meetingLink: 'https://meet.google.com/amz-round-final',
    interviewer: 'Senior Engineering Lead, AWS',
  });

  const handleStudentSelect = (stdId: string) => {
    const std = students.find((s) => s.id === stdId);
    if (std) {
      setFormData((prev) => ({
        ...prev,
        studentId: std.id,
        studentName: std.fullName,
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newInt: Interview = {
      id: `int-${Date.now()}`,
      studentId: formData.studentId,
      studentName: formData.studentName,
      companyName: formData.companyName,
      role: formData.role,
      interviewRound: formData.interviewRound,
      date: formData.date,
      time: formData.time,
      mode: formData.mode,
      meetingLink: formData.meetingLink,
      interviewer: formData.interviewer,
      status: 'Scheduled',
    };

    StorageService.saveInterview(newInt);
    setInterviews(StorageService.getInterviews());
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interview Scheduling Hub</h2>
          <p className="text-xs text-slate-500 mt-1">
            Coordinate Technical, Managerial, and HR interview slots directly with corporate panelists
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Candidate Interview</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {interviews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-700 uppercase">
                  {item.companyName}
                </span>
                <StatusBadge status={item.status} size="sm" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.role}</h3>
              <p className="text-xs font-semibold text-purple-700 mt-1">{item.interviewRound}</p>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-600">
                <p>
                  Candidate: <strong>{item.studentName || 'Open Candidate'}</strong>
                </p>
                <p>
                  Date & Time: <strong>{item.date} • {item.time}</strong>
                </p>
                <p>
                  Mode: <strong>{item.mode}</strong>
                </p>
                {item.interviewer && (
                  <p>
                    Panelist: <strong>{item.interviewer}</strong>
                  </p>
                )}
              </div>
            </div>

            {item.meetingLink && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs truncate">
                <span className="text-slate-400 block text-[10px]">Meeting URL:</span>
                <a
                  href={item.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  {item.meetingLink}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Schedule Candidate Interview Round"
          subtitle="Assign recruiter slots and send immediate notification"
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Candidate *</label>
              <select
                value={formData.studentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.department}, CGPA: {s.cgpa})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interview Round *</label>
              <select
                value={formData.interviewRound}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interviewRound: e.target.value as Interview['interviewRound'],
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Technical Round">Technical Round</option>
                <option value="Managerial Round">Managerial Round</option>
                <option value="HR Round">HR Round</option>
              </select>
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
                <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                <input
                  type="text"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mode *</label>
              <select
                value={formData.mode}
                onChange={(e) =>
                  setFormData({ ...formData, mode: e.target.value as Interview['mode'] })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Online (Google Meet)">Online (Google Meet)</option>
                <option value="In-Person (Campus Block B)">In-Person (Campus Block B)</option>
                <option value="Video Conference">Video Conference</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Meeting Link</label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
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
                Dispatch Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
