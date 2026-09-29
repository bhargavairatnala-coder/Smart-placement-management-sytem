import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  AlertCircle,
  X,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Award,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onNavigateHome: () => void;
}

const DEFAULT_POPULAR_SKILLS = [
  'Java',
  'Python',
  'SQL',
  'HTML',
  'CSS',
  'JavaScript',
  'Data Structures',
  'Cyber Security',
  'C++',
  'React',
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

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateLogin,
  onNavigateHome,
}) => {
  const { registerStudent } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    collegeName: 'National Institute of Engineering',
    degree: 'B.Tech',
    department: 'Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.0,
    location: 'Bengaluru, India',
  });

  const [skills, setSkills] = useState<string[]>(['Java', 'Python', 'SQL', 'Data Structures']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills([...skills, trimmed]);
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError('Please provide your Full Name.');
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      setError('CGPA must be between 0.0 and 10.0');
      return;
    }
    if (skills.length === 0) {
      setError('Please select or add at least one technical skill.');
      return;
    }

    const res = registerStudent({
      ...formData,
      skills,
    });

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 inline-flex items-center gap-1 transition-colors"
        >
          ← Back to Homepage
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Registration
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Create your placement profile to unlock eligible campus drives and assessments
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
                1. Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="rahul.cse@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
                2. Academic Credentials
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / University Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Branch *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
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
                    Graduation Year Batch *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      required
                      min={2024}
                      max={2030}
                      value={formData.graduationYear}
                      onChange={(e) =>
                        setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })
                      }
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Aggregate CGPA (out of 10) *
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Important: CGPA is used by the Smart Eligibility engine to filter drives.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current City / Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  3. Technical Skills & Competencies *
                </h3>
                <span className="text-[11px] text-slate-400">{skills.length} selected</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3 min-h-[36px] p-2 bg-slate-50 border border-slate-200 rounded-lg">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No skills selected yet</span>
                ) : (
                  skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-md border border-indigo-200"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <p className="text-xs font-medium text-slate-500 mb-1.5">Click to add common skills:</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {DEFAULT_POPULAR_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-md transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or type a custom skill (e.g. Flutter, Spring Boot)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(customSkillInput);
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(customSkillInput)}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md shadow-indigo-600/20 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                <span>Create Student Account & Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="font-bold text-indigo-600 hover:text-indigo-800 underline"
                >
                  Sign In here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
