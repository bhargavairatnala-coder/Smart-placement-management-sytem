import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Award,
  FileText,
  Upload,
  Eye,
  Download,
  X,
  CheckCircle2,
  Sparkles,
  CloudOff,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';

const POPULAR_SKILLS = [
  'Java',
  'Python',
  'SQL',
  'HTML',
  'CSS',
  'JavaScript',
  'Data Structures',
  'Cyber Security',
  'React',
  'Node.js',
  'C++',
  'Git',
  'AWS',
];

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication',
  'AI & Data Science',
  'Electrical Engineering',
  'Mechanical Engineering',
];

export const MyProfile: React.FC = () => {
  const { currentStudent, updateCurrentStudent } = useAuth();

  if (!currentStudent) return null;

  const [formData, setFormData] = useState({
    fullName: currentStudent.fullName || '',
    email: currentStudent.email || '',
    phone: currentStudent.phone || '',
    location: currentStudent.location || '',
    collegeName: currentStudent.collegeName || '',
    degree: currentStudent.degree || '',
    department: currentStudent.department || '',
    graduationYear: currentStudent.graduationYear || 2026,
    cgpa: currentStudent.cgpa || 8.0,
    resumeName: currentStudent.resumeName || 'Rahul_Sharma_Resume_2026.pdf',
    resumeUpdatedDate: currentStudent.resumeUpdatedDate || '2026-08-15',
  });

  const [skills, setSkills] = useState<string[]>(currentStudent.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const tempStudent = { ...currentStudent, ...formData, skills };
  const completionPercentage = StorageService.calculateProfileCompletion(tempStudent);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills([...skills, trimmed]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentStudent({
      ...formData,
      skills,
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        resumeName: fileName,
        resumeUpdatedDate: today,
      }));
      updateCurrentStudent({
        resumeName: fileName,
        resumeUpdatedDate: today,
      });
      setUploadNotice(`Resume "${fileName}" uploaded successfully & saved locally!`);
      setTimeout(() => setUploadNotice(null), 3500);
    }
  };

  const handleDownloadResume = () => {
    const resumeContent = `================================================
CANDIDATE PLACEMENT PROFILE
================================================
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}

ACADEMIC INFORMATION
College: ${formData.collegeName}
Degree: ${formData.degree}
Department: ${formData.department}
Graduation Batch: ${formData.graduationYear}
Aggregate CGPA: ${formData.cgpa} / 10.0

CORE TECHNICAL SKILLS
${skills.join(', ')}

PLACEMENT STATUS: ${currentStudent.placementStatus}
Generated from Smart Placement Portal
================================================`;

    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = formData.resumeName.replace('.pdf', '') + '_Verified.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Keep your academic scores and technical skills updated for smart eligibility matching
          </p>
        </div>

        <div className="w-full md:w-80 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <ProgressBar
            percentage={completionPercentage}
            label="Profile Completion"
            color={completionPercentage >= 80 ? 'emerald' : completionPercentage >= 50 ? 'indigo' : 'amber'}
          />
          <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Weighted by Personal Info, Academics, 3+ Skills, & Resume
          </p>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully in localStorage!</span>
        </div>
      )}

      {uploadNotice && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-blue-800">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Personal Information
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location / City
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Academic Information
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University
              </label>
              <input
                type="text"
                required
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department / Branch
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Graduation Year
              </label>
              <input
                type="number"
                required
                min={2023}
                max={2030}
                value={formData.graduationYear}
                onChange={(e) =>
                  setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aggregate CGPA (out of 10)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={10}
                required
                value={formData.cgpa}
                onChange={(e) =>
                  setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Directly impacts company shortlisting eligibility.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Technical Skills
              </h3>
            </div>
            <span className="text-xs font-semibold text-indigo-600">{skills.length} skills listed</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px] items-center">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-indigo-200 text-indigo-800 rounded-lg shadow-2xs group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded-sm transition-colors"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Popular In-Demand Skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add another skill (e.g. Flutter, Kotlin, Docker)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkillInput);
                }
              }}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-600"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkillInput)}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Add Skill
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Resume Section
            </h3>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                PDF
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{formData.resumeName}</p>
                <p className="text-[11px] text-slate-500">
                  Last updated: {formData.resumeUpdatedDate} • Verified for campus drives
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload New</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleSimulatedUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowResumeModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Resume</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadResume}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-500">
            <CloudOff className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Storage Note:</strong> In this client-side demo, resume metadata is safely stored
              in localStorage. When connecting a backend later, this will integrate with Amazon S3 or
              Firebase Cloud Storage bucket.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>

      <Modal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        title="Student Verified Resume Preview"
        subtitle={formData.resumeName}
        maxWidth="2xl"
        footer={
          <div className="flex justify-between w-full">
            <span className="text-xs text-slate-500 self-center">
              Verified by Department Placement Cell
            </span>
            <button
              onClick={handleDownloadResume}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              Download Profile Card
            </button>
          </div>
        }
      >
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 font-sans space-y-5 text-slate-800">
          <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{formData.fullName}</h2>
              <p className="text-xs text-slate-600">{formData.degree} • {formData.department}</p>
              <p className="text-xs text-slate-500">{formData.collegeName} • Batch of {formData.graduationYear}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>{formData.email}</p>
              <p>{formData.phone}</p>
              <p>{formData.location}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1.5">
              Academic Performance
            </h4>
            <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Aggregate CGPA</span>
                <p className="text-sm font-bold text-slate-900">{formData.cgpa} / 10.0</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Graduation</span>
                <p className="text-sm font-bold text-slate-900">{formData.graduationYear}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Status</span>
                <p className="text-sm font-bold text-emerald-600">{currentStudent.placementStatus}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1.5">
              Key Technical Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
