import React from 'react';
import {
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  BarChart2,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  onSelectLogin: (role: 'student' | 'admin' | 'register') => void;
  onOpenGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectLogin, onOpenGuide }) => {
  const { quickDemoLogin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Banner Navigation */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  Smart Placement
                </span>
                <span className="ml-1.5 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/60 uppercase">
                  Portal
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#home" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Home
              </a>
              <a href="#features" className="hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                How It Works
              </a>
              <a href="#about" className="hover:text-slate-900 transition-colors">
                About
              </a>
              <button
                onClick={onOpenGuide}
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                Interview / Viva Guide
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onSelectLogin('student')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Student Login
              </button>
              <button
                onClick={() => onSelectLogin('admin')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen College Placement Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Placement <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500">
                  Management System
                </span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-indigo-900/80">
                &ldquo;Prepare Smart. Apply Smart. Get Placed.&rdquo;
              </p>

              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                One platform to manage placement preparation, applications, assessments, interviews,
                and placement progress. Designed for forward-thinking engineering and management colleges.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onSelectLogin('student')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all text-sm group"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectLogin('admin')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-all text-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Admin Login</span>
                </button>

                <button
                  onClick={() => onSelectLogin('register')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition-all text-sm"
                >
                  Create Account
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">⚡ Instant 1-Click Demo:</span>
                <button
                  onClick={() => quickDemoLogin('student')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors"
                >
                  Demo Student (Rahul - CSE)
                </button>
                <button
                  onClick={() => quickDemoLogin('admin')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors"
                >
                  Demo Admin (Placement Cell)
                </button>
              </div>
            </div>

            {/* Right Dashboard Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur-xl opacity-20 transform -rotate-1" />

                <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      spms.college.edu/portal
                    </span>
                    <span className="w-3" />
                  </div>

                  <div className="p-5 space-y-4 bg-slate-50/50">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-4 text-white shadow-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-indigo-100">Welcome Back,</p>
                          <h4 className="text-base font-bold">Rahul Sharma (CSE, 8.45 CGPA)</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold">
                          Active Batch 2026
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-indigo-100">
                        <span>Profile Completion</span>
                        <span className="font-bold text-white">90%</span>
                      </div>
                      <div className="w-full bg-white/20 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[90%]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Eligible</p>
                        <p className="text-lg font-bold text-indigo-600">7 Jobs</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Applied</p>
                        <p className="text-lg font-bold text-slate-800">4</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Interviews</p>
                        <p className="text-lg font-bold text-purple-600">1</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Amazon SDE-1 Drive
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Eligible
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Min CGPA: 7.5 (Yours: 8.45)</span>
                        <span className="font-semibold text-indigo-600">₹22 LPA</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">DSA & Algorithms Prep</span>
                        <span className="font-bold text-slate-800">75%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full w-3/4 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2 sm:text-4xl tracking-tight">
              Everything Needed for a Flawless Placement Season
            </h3>
            <p className="text-slate-600 mt-3 text-base sm:text-lg">
              Eliminating manual spreadsheets, missed deadlines, and eligibility confusions with an
              automated, transparent student & officer workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Smart Eligibility Engine</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instantly matches student CGPA, department, graduation year, and technical skills with
                company requirements and highlights exact reasons if not eligible.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Job Drive Management</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Explore verified opportunities from companies like Google, Microsoft, Amazon, and TCS
                with packages, deadlines, and multi-filter criteria.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Placement Preparation Tracker</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Curated checklists across DSA, SQL, Aptitude, Java, Python, and Communication with
                interactive progress percentages and practice sheets.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Interview & Assessment Hub</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track interview rounds (Technical, Managerial, HR), platform links, durations, and
                schedules with instant notifications.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Placement Cell Admin Suite</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Full-featured administrative portal to manage student records, post corporate drives,
                progress applications through rounds, and publish notifications.
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Placement Analytics & Reports</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Comprehensive statistics on placed percentages, department distributions, and company
                offer volumes for academic governance and accreditation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Simple 4-Step Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2 sm:text-4xl tracking-tight">
              From Registration to Offer Letter
            </h3>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 text-center relative shadow-xs">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Build Profile</h4>
              <p className="text-xs text-slate-600">
                Register with CGPA, department, graduation year, technical skills, and upload resume.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 text-center relative shadow-xs">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Check Eligibility</h4>
              <p className="text-xs text-slate-600">
                System automatically verifies requirements before letting you apply to avoid wasted attempts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 text-center relative shadow-xs">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Prepare & Test</h4>
              <p className="text-xs text-slate-600">
                Track topic checklists for DSA and Aptitude while attending scheduled company assessments.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 text-center relative shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Track & Get Placed</h4>
              <p className="text-xs text-slate-600">
                Monitor Technical and HR interview rounds with real-time status updates from placement officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                About the Platform
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Designed for Colleges, Built for Students
              </h3>
              <p className="text-slate-600 mt-4 leading-relaxed text-sm sm:text-base">
                The Smart Placement Management System is built specifically for academic institutions
                to replace fragmented WhatsApp notices, manual Google Forms, and unverified resumes.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Centralized corporate relationship tracking and drives</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Accurate student academic record & CGPA threshold validation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Role-based access with student and placement officer views</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-xl">
              <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                Technical Interview Highlight
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                This project features complete entity relational modeling, client persistence via
                reactive localStorage patterns, dynamic criteria evaluation, and modular React
                components ready for immediate backend API connection.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ready for viva & review</span>
                <button
                  onClick={onOpenGuide}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Open Full Architecture Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Smart Placement Portal</span>
          </div>
          <p className="text-center sm:text-right">
            Designed for College Placements • Client-side Demonstration with LocalStorage Persistence
          </p>
        </div>
      </footer>
    </div>
  );
};
