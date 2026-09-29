import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Award,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Job, EligibilityResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { Modal } from '../../components/common/Modal';
import { SearchBar } from '../../components/common/SearchBar';

interface JobsPageProps {
  onNavigateTab: (tab: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onNavigateTab }) => {
  const { currentStudent } = useAuth();
  const [jobs] = useState<Job[]>(() => StorageService.getJobs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [appliedSuccessMsg, setAppliedSuccessMsg] = useState<string | null>(null);

  const applications = useMemo(() => {
    return currentStudent ? StorageService.getApplicationsByStudent(currentStudent.id) : [];
  }, [currentStudent, appliedSuccessMsg]);

  const companiesList = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.companyName)));
    return ['All', ...list];
  }, [jobs]);

  const allSkillsList = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.requiredSkills.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const search = searchQuery.toLowerCase().trim();
      if (
        search &&
        !job.companyName.toLowerCase().includes(search) &&
        !job.role.toLowerCase().includes(search) &&
        !job.location.toLowerCase().includes(search) &&
        !job.requiredSkills.some((s) => s.toLowerCase().includes(search))
      ) {
        return false;
      }

      if (selectedCompany !== 'All' && job.companyName !== selectedCompany) {
        return false;
      }

      if (minCgpaFilter > 0 && job.minCgpa > minCgpaFilter) {
        return false;
      }

      if (
        selectedSkill !== 'All' &&
        !job.requiredSkills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())
      ) {
        return false;
      }

      if (eligibleOnly && currentStudent) {
        const elig = StorageService.checkEligibility(currentStudent, job);
        if (!elig.isEligible) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedCompany, minCgpaFilter, selectedSkill, eligibleOnly, currentStudent]);

  const hasApplied = (jobId: string) => {
    if (!currentStudent) return false;
    return applications.some((a) => a.jobId === jobId);
  };

  const getEligibility = (job: Job): EligibilityResult => {
    if (!currentStudent) {
      return {
        isEligible: false,
        reasons: ['No active student session'],
        missingSkills: [],
        cgpaPassed: false,
        deptPassed: false,
        gradYearPassed: false,
      };
    }
    return StorageService.checkEligibility(currentStudent, job);
  };

  const handleApply = (job: Job) => {
    if (!currentStudent) return;
    if (hasApplied(job.id)) return;

    StorageService.createApplication({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      studentEmail: currentStudent.email,
      studentDepartment: currentStudent.department,
      studentCgpa: currentStudent.cgpa,
      jobId: job.id,
      companyName: job.companyName,
      role: job.role,
    });

    setShowApplyConfirm(false);
    setAppliedSuccessMsg(`Successfully applied to ${job.companyName} for ${job.role}!`);
    setTimeout(() => setAppliedSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Placement Drives & Opportunities
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Sample College Dataset
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explore verified corporate campus recruitments and check your smart eligibility in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Data Notice:</strong> Company openings (Amazon, Google, TCS, etc.) are realistic simulated records for college evaluation.
          </span>
        </div>
      </div>

      {appliedSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-semibold text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{appliedSuccessMsg}</span>
          </div>
          <button
            onClick={() => onNavigateTab('applications')}
            className="text-xs underline hover:text-emerald-950 font-bold"
          >
            Track in My Applications →
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by company, job role, skill, or location..."
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-600"
            >
              {companiesList.map((comp) => (
                <option key={comp} value={comp}>
                  Company: {comp}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-600"
            >
              <option value="All">All Required Skills</option>
              {allSkillsList.filter((s) => s !== 'All').map((skill) => (
                <option key={skill} value={skill}>
                  Skill: {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Show Eligible Drives Only
              </span>
            </label>

            <div className="flex items-center gap-2 text-slate-600">
              <span>Max Min-CGPA Cutoff:</span>
              <select
                value={minCgpaFilter}
                onChange={(e) => setMinCgpaFilter(parseFloat(e.target.value))}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md"
              >
                <option value={0}>Any CGPA</option>
                <option value={7.0}>Up to 7.0</option>
                <option value={7.5}>Up to 7.5</option>
                <option value={8.0}>Up to 8.0</option>
                <option value={8.5}>Up to 8.5</option>
              </select>
            </div>
          </div>

          <div className="text-slate-500">
            Showing <strong className="text-slate-800">{filteredJobs.length}</strong> of{' '}
            {jobs.length} drives
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching job drives found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, removing filters, or toggling off &quot;Show Eligible Drives Only&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCompany('All');
              setSelectedSkill('All');
              setMinCgpaFilter(0);
              setEligibleOnly(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const eligibility = getEligibility(job);
            const applied = hasApplied(job.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
                        {job.companyName}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                        {job.role}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveJob(job)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
                        eligibility.isEligible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                      title="Click to view detailed criteria comparison"
                    >
                      {eligibility.isEligible ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Eligible</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Not Eligible</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs mb-3 text-slate-600">
                    <div className="flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{job.package}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Deadline: {job.deadline}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Minimum CGPA:</span>
                      <span className="font-semibold text-slate-800">
                        {job.minCgpa.toFixed(2)} (Yours: {currentStudent?.cgpa.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Graduation Batch:</span>
                      <span className="font-semibold text-slate-800">
                        {job.graduationYear.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Required Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.map((sk) => {
                          const hasSkill = currentStudent?.skills.some(
                            (s) => s.toLowerCase() === sk.toLowerCase()
                          );
                          return (
                            <span
                              key={sk}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                hasSkill
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-white text-slate-600 border-slate-200'
                              }`}
                            >
                              {sk} {hasSkill && '✓'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveJob(job)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                  >
                    <span>Check Eligibility Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {applied ? (
                    <span className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 cursor-not-allowed inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveJob(job);
                        setShowApplyConfirm(true);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        eligibility.isEligible
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                          : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                      }`}
                    >
                      {eligibility.isEligible ? 'Apply Now' : 'Apply (Ineligible)'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeJob && (
        <Modal
          isOpen={!!activeJob}
          onClose={() => {
            setActiveJob(null);
            setShowApplyConfirm(false);
          }}
          title={`${activeJob.companyName} • ${activeJob.role}`}
          subtitle={`Package: ${activeJob.package} • Location: ${activeJob.location}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Deadline: {activeJob.deadline}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveJob(null);
                    setShowApplyConfirm(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>

                {!hasApplied(activeJob.id) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (showApplyConfirm) {
                        handleApply(activeJob);
                      } else {
                        setShowApplyConfirm(true);
                      }
                    }}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                  >
                    {showApplyConfirm ? 'Confirm & Submit Application' : 'Proceed to Apply'}
                  </button>
                )}
              </div>
            </div>
          }
        >
          {showApplyConfirm ? (
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-indigo-600" />
                <span>Confirm Placement Application</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                You are about to submit your application for <strong>{activeJob.role}</strong> at{' '}
                <strong>{activeJob.companyName}</strong>. Your registered resume, CGPA (
                {currentStudent?.cgpa}), and department will be shared with the recruiting committee.
              </p>
              <div className="p-3 bg-white rounded-lg border border-indigo-200 text-xs text-slate-600 space-y-1">
                <p>• Duplicate applications will be prevented.</p>
                <p>• Status will immediately be set to &quot;Applied&quot;.</p>
                <p>• You can track subsequent interview and assessment rounds anytime.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-xs">
              {(() => {
                const elig = getEligibility(activeJob);
                return (
                  <div
                    className={`p-4 rounded-xl border ${
                      elig.isEligible
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                      {elig.isEligible ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>You are ELIGIBLE for this opportunity!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600" />
                          <span>Not Eligible based on company criteria</span>
                        </>
                      )}
                    </div>

                    {!elig.isEligible && (
                      <div className="mt-2 space-y-1 bg-white p-3 rounded-lg border border-rose-200">
                        <p className="font-semibold text-rose-800">Reason(s):</p>
                        {elig.reasons.map((r, i) => (
                          <p key={i} className="text-rose-700 flex items-start gap-1.5">
                            • {r}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Smart Criteria Comparison Matrix
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-bold text-indigo-700">Company Criteria</p>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                      <p>
                        Min CGPA: <strong>{activeJob.minCgpa.toFixed(2)}</strong>
                      </p>
                      <p>
                        Batches: <strong>{activeJob.graduationYear.join(', ')}</strong>
                      </p>
                      <p>
                        Eligible Branches:{' '}
                        <strong>{activeJob.eligibleDepartments.join(', ') || 'All Branches'}</strong>
                      </p>
                      <p>
                        Required Skills:{' '}
                        <strong>{activeJob.requiredSkills.join(', ')}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-indigo-700">Your Profile</p>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                      <p>
                        Your CGPA: <strong>{currentStudent?.cgpa.toFixed(2)}</strong>{' '}
                        {currentStudent && currentStudent.cgpa >= activeJob.minCgpa ? '✓' : '✗'}
                      </p>
                      <p>
                        Graduation: <strong>{currentStudent?.graduationYear}</strong>{' '}
                        {currentStudent &&
                        activeJob.graduationYear.includes(currentStudent.graduationYear)
                          ? '✓'
                          : '✗'}
                      </p>
                      <p>
                        Your Branch: <strong>{currentStudent?.department}</strong>
                      </p>
                      <p>
                        Your Skills:{' '}
                        <strong>{currentStudent?.skills.join(', ')}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Job Role Overview</h4>
                <p className="text-slate-600 leading-relaxed">{activeJob.description}</p>
              </div>

              {activeJob.selectionRounds && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Selection Rounds</h4>
                  <div className="space-y-1">
                    {activeJob.selectionRounds.map((rnd, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-slate-700"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{rnd}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
