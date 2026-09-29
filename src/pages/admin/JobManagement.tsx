import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Job, Company } from '../../types';
import { StorageService } from '../../services/storage';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication',
  'AI & Data Science',
  'Electrical Engineering',
  'Mechanical Engineering',
];

export const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(() => StorageService.getJobs());
  const [companies] = useState<Company[]>(() => StorageService.getCompanies());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formData, setFormData] = useState({
    companyName: companies[0]?.name || 'Google',
    role: '',
    package: '₹14 LPA',
    location: 'Bengaluru / Hyderabad',
    jobType: 'Full Time' as Job['jobType'],
    minCgpa: 7.5,
    eligibleDepartments: ['Computer Science and Engineering', 'Information Technology'],
    graduationYear: 2026,
    requiredSkillsStr: 'Java, SQL, Data Structures',
    deadline: '2026-11-20',
    description: '',
    openings: 10,
  });

  const filteredJobs = jobs.filter(
    (j) =>
      j.companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingJob(null);
    setFormData({
      companyName: companies[0]?.name || 'Google',
      role: 'Associate Software Engineer',
      package: '₹12 - ₹15 LPA',
      location: 'Bengaluru, India',
      jobType: 'Full Time',
      minCgpa: 7.5,
      eligibleDepartments: ['Computer Science and Engineering', 'Information Technology'],
      graduationYear: 2026,
      requiredSkillsStr: 'Java, Python, SQL, Data Structures',
      deadline: '2026-11-30',
      description: 'Design and deploy scalable application services for campus recruitment batch.',
      openings: 15,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      companyName: job.companyName,
      role: job.role,
      package: job.package,
      location: job.location,
      jobType: job.jobType,
      minCgpa: job.minCgpa,
      eligibleDepartments: job.eligibleDepartments,
      graduationYear: job.graduationYear[0] || 2026,
      requiredSkillsStr: job.requiredSkills.join(', '),
      deadline: job.deadline,
      description: job.description,
      openings: job.openings,
    });
    setModalOpen(true);
  };

  const handleDelete = (job: Job) => {
    if (window.confirm(`Are you sure you want to remove ${job.role} at ${job.companyName}?`)) {
      StorageService.deleteJob(job.id);
      setJobs(StorageService.getJobs());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const jobData: Job = {
      id: editingJob ? editingJob.id : `job-${Date.now()}`,
      companyId: `comp-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}`,
      companyName: formData.companyName,
      role: formData.role,
      package: formData.package,
      location: formData.location,
      jobType: formData.jobType,
      minCgpa: formData.minCgpa,
      eligibleDepartments: formData.eligibleDepartments,
      graduationYear: [formData.graduationYear],
      requiredSkills: skillsArray,
      deadline: formData.deadline,
      description: formData.description,
      openings: formData.openings,
      selectionRounds: editingJob?.selectionRounds || [
        'Online Assessment',
        'Technical Round 1',
        'HR Round',
      ],
      postedDate: editingJob?.postedDate || new Date().toISOString().split('T')[0],
    };

    StorageService.saveJob(jobData);
    setJobs(StorageService.getJobs());

    StorageService.createNotification({
      targetUser: 'all',
      title: `New Placement Drive: ${jobData.companyName}`,
      message: `${jobData.companyName} is hiring for ${jobData.role} (${jobData.package}). Apply before ${jobData.deadline}.`,
      type: 'job',
      linkTab: 'jobs',
    });

    setModalOpen(false);
  };

  const toggleDept = (dept: string) => {
    if (formData.eligibleDepartments.includes(dept)) {
      setFormData({
        ...formData,
        eligibleDepartments: formData.eligibleDepartments.filter((d) => d !== dept),
      });
    } else {
      setFormData({
        ...formData,
        eligibleDepartments: [...formData.eligibleDepartments, dept],
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Job Drive Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure campus placement drives, CGPA eligibility cutoffs, and department restrictions
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campus Drive</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search job drives by company, role, or location..."
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-5">Company & Role</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Min CGPA</th>
                <th className="py-3 px-4">Eligible Departments</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-indigo-700 uppercase text-[10px] block">
                      {job.companyName}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{job.role}</span>
                    <span className="text-[11px] text-slate-400 block">{job.location}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{job.package}</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700">
                    {job.minCgpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {job.eligibleDepartments.map((d) => (
                        <span
                          key={d}
                          className="px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-700 truncate max-w-[120px]"
                        >
                          {d.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {job.deadline}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Drive"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(job)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingJob ? `Edit Job Drive: ${editingJob.role}` : 'Create Campus Placement Drive'}
          subtitle="Configure CGPA cutoff, eligible academic branches, and deadline"
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company *</label>
                <select
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Role Title *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Offered CTC / Package *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹14 LPA"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum CGPA Cutoff *</label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  required
                  value={formData.minCgpa}
                  onChange={(e) =>
                    setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Deadline *</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Technical Skills (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.requiredSkillsStr}
                  onChange={(e) => setFormData({ ...formData, requiredSkillsStr: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Eligible Academic Branches *
                </label>
                <div className="grid sm:grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {DEPARTMENTS.map((dept) => (
                    <label key={dept} className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.eligibleDepartments.includes(dept)}
                        onChange={() => toggleDept(dept)}
                        className="rounded-sm text-indigo-600"
                      />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
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
                {editingJob ? 'Save Changes' : 'Publish Drive'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
