import React, { useState } from 'react';
import {
  CalendarCheck,
  Video,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Interview } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const InterviewTracker: React.FC = () => {
  const { currentStudent } = useAuth();
  const [interviews] = useState<Interview[]>(() =>
    StorageService.getInterviews()
  );
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const studentInterviews = interviews.filter(
    (i) => !i.studentId || (currentStudent && i.studentId === currentStudent.id)
  );

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interview Tracker</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track technical, managerial, and HR interview schedules, meeting links, and round outcomes
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
          {studentInterviews.filter((i) => i.status === 'Scheduled').length} Scheduled Interviews
        </div>
      </div>

      {studentInterviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No interviews scheduled yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once your job applications pass preliminary assessments, recruiters will schedule
            Technical, Managerial, or HR rounds here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {studentInterviews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      {item.companyName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.role}</h3>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <div className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 mb-4">
                  {item.interviewRound}
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-semibold text-slate-800">{item.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="font-semibold text-slate-800">{item.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Mode:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      {item.mode.includes('Online') ? (
                        <Video className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {item.mode}
                    </span>
                  </div>
                  {item.interviewer && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-400">Interviewer:</span>
                      <span className="text-slate-700">{item.interviewer}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedInterview(item)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Round Guidelines & Checklist
                </button>

                {item.meetingLink ? (
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">Campus In-Person</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInterview && (
        <Modal
          isOpen={!!selectedInterview}
          onClose={() => setSelectedInterview(null)}
          title={`${selectedInterview.companyName} • ${selectedInterview.interviewRound}`}
          subtitle={`Role: ${selectedInterview.role} • ${selectedInterview.date} at ${selectedInterview.time}`}
          maxWidth="lg"
          footer={
            <button
              onClick={() => setSelectedInterview(null)}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-200">
              <h4 className="font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                How to Excel in this {selectedInterview.interviewRound}:
              </h4>
              <p className="leading-relaxed">
                {selectedInterview.interviewRound.includes('Technical')
                  ? 'Be ready to code on shared editor or whiteboard. Explain your time & space complexities aloud before writing implementation.'
                  : selectedInterview.interviewRound.includes('HR')
                  ? 'Focus on behavioral questions using the STAR technique (Situation, Task, Action, Result). Express genuine enthusiasm for company culture.'
                  : 'Be ready to discuss end-to-end design of your capstone college project and trade-offs made.'}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900">Recommended Pre-Interview Checklist:</h5>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p>✓ Ensure stable internet connectivity and clean neutral background.</p>
                <p>✓ Keep a copy of your uploaded resume opened for quick reference.</p>
                <p>✓ Prepare 2 thoughtful questions to ask the interviewer at the close.</p>
                <p>✓ Join the meeting link 5 minutes prior to start time.</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
