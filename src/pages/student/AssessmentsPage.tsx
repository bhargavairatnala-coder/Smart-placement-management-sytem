import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  HelpCircle,
} from 'lucide-react';
import { Assessment } from '../../types';
import { StorageService } from '../../services/storage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const AssessmentsPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>(() =>
    StorageService.getAssessments()
  );
  const [activeTest, setActiveTest] = useState<Assessment | null>(null);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testCompleted, setTestCompleted] = useState(false);

  const SAMPLE_QUESTIONS = [
    {
      q: 'What is the time complexity of searching an element in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correct: 1,
    },
    {
      q: 'Which SQL clause is used to filter records aggregated by a GROUP BY clause?',
      options: ['WHERE', 'ORDER BY', 'HAVING', 'FILTER'],
      correct: 2,
    },
    {
      q: 'In Java, which of these collections guarantees element uniqueness?',
      options: ['ArrayList', 'HashSet', 'Vector', 'LinkedList'],
      correct: 1,
    },
  ];

  const handleStartTest = (asm: Assessment) => {
    setActiveTest(asm);
    setSelectedAnswers({});
    setTestCompleted(false);
    setTestScore(null);
  };

  const handleFinishTest = () => {
    let score = 0;
    SAMPLE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score += 1;
      }
    });

    const finalPct = Math.round((score / SAMPLE_QUESTIONS.length) * 100);
    const scoreStr = `${finalPct}% (${score}/${SAMPLE_QUESTIONS.length})`;
    setTestScore(finalPct);
    setTestCompleted(true);

    if (activeTest) {
      StorageService.markAssessmentCompleted(activeTest.id, scoreStr);
      setAssessments(StorageService.getAssessments());
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Placement Assessments & Tests
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Company-specific online proctored coding assessments and cognitive tests
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
          {assessments.filter((a) => a.status === 'Upcoming').length} Upcoming Assessments
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {assessments.map((asm) => (
          <div
            key={asm.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {asm.companyName}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {asm.assessmentName}
                  </h3>
                </div>
                <StatusBadge status={asm.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{asm.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{asm.duration}</span>
                </div>
                <div className="col-span-2 text-slate-500 text-[11px]">
                  Platform: <strong>{asm.platform}</strong>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5">
                  Syllabus & Topics:
                </p>
                <div className="flex flex-wrap gap-1">
                  {asm.topicsCovered.map((tpc) => (
                    <span
                      key={tpc}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tpc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {asm.score && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Score: {asm.score}
                </div>
              )}
              <div className="ml-auto flex gap-2">
                {asm.status === 'Completed' ? (
                  <button
                    onClick={() => handleStartTest(asm)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Review Questions
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartTest(asm)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start / Simulate Test</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTest && (
        <Modal
          isOpen={!!activeTest}
          onClose={() => setActiveTest(null)}
          title={`Assessment: ${activeTest.assessmentName}`}
          subtitle={`${activeTest.companyName} • Duration: ${activeTest.duration}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Proctor Status: Simulating Client Session
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTest(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {testCompleted ? 'Done' : 'Exit Test'}
                </button>
                {!testCompleted && (
                  <button
                    type="button"
                    onClick={handleFinishTest}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                  >
                    Submit Answers
                  </button>
                )}
              </div>
            </div>
          }
        >
          {testCompleted ? (
            <div className="p-6 text-center space-y-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Assessment Submitted!</h3>
              <p className="text-xs text-slate-600">
                Your performance score has been computed and recorded in localStorage:
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-white border border-emerald-300 text-lg font-bold text-emerald-700">
                {testScore}% Performance Score
              </div>
              <p className="text-[11px] text-slate-500">
                The Placement Cell and company recruiters have received your submission timestamp.
              </p>
            </div>
          ) : (
            <div className="space-y-5 text-xs">
              <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Please select the most accurate answers below. Click &quot;Submit Answers&quot; when finished.
                </span>
              </div>

              {SAMPLE_QUESTIONS.map((qObj, qIdx) => (
                <div key={qIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900 text-sm">
                    {qIdx + 1}. {qObj.q}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {qObj.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                          selectedAnswers[qIdx] === optIdx
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${qIdx}`}
                          checked={selectedAnswers[qIdx] === optIdx}
                          onChange={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                          className="w-3.5 h-3.5 text-indigo-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
