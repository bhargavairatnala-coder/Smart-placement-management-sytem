import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';

interface ProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectGuideModal: React.FC<ProjectGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'architecture' | 'database' | 'backend' | 'viva' | 'deploy'
  >('overview');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Architecture, Interview & Viva Guide"
      subtitle="Complete documentation for technical review, viva defense, and future production connection"
      maxWidth="3xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-slate-500">
            Smart Placement Portal • Academic Portfolio Edition
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
          >
            Close Guide
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs font-sans text-slate-700">
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'overview', label: '1. Overview & Testing' },
            { id: 'architecture', label: '2. Folder Structure' },
            { id: 'database', label: '3. Data Schema & Relationships' },
            { id: 'backend', label: '4. Backend & DB Migration' },
            { id: 'viva', label: '5. Viva Q&A' },
            { id: 'deploy', label: '6. Vercel & Deploy Guide' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-200">
              <h4 className="font-bold text-sm mb-1">Project High-Level Summary</h4>
              <p className="leading-relaxed">
                The <strong>Smart Placement Management System</strong> solves the chaos of college
                recruitment. It features real-time eligibility evaluation (CGPA, department, graduation
                batch, skill matching), progress-tracked preparation checklists, application tracking
                with notification dispatch, and a placement officer suite for driving corporate drives.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Student Role Demo:</span>
                <p>Email: <code>student@example.com</code></p>
                <p>Password: <code>student123</code></p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Features: Smart eligibility check, apply to Google/Amazon/TCS, track applications,
                  take practice tests, toggle DSA/SQL topics.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Admin / Officer Role Demo:</span>
                <p>Email: <code>admin@example.com</code></p>
                <p>Password: <code>admin123</code></p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Features: Post drives, change application stages (Applied → Shortlisted → Selected),
                  schedule interviews, and view placement percentages.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">Project Directory Layout (Standard Vite + React + TS)</h4>
            <pre className="p-3 bg-slate-900 text-indigo-200 rounded-xl font-mono text-[11px] overflow-x-auto">
{`src/
├── types/
│   └── index.ts                 # Clean TypeScript models (Student, Company, Job, App...)
├── data/
│   └── initialData.ts           # Realistic datasets for 5 students, 5 companies, 8 jobs
├── services/
│   └── storage.ts               # LocalStorage abstraction with Reactive event dispatch
├── context/
│   └── AuthContext.tsx          # Multi-role authentication & session state
├── components/common/
│   ├── Navbar.tsx               # Header with role pill, quick demos, notification bell
│   ├── Sidebar.tsx              # Adaptive student & admin sidebar
│   ├── DashboardCard.tsx        # KPI metrics card
│   ├── StatusBadge.tsx          # Dynamic high-contrast pipeline status tags
│   ├── ProgressBar.tsx          # Responsive gradient progress indicators
│   ├── SearchBar.tsx            # Debounced filter search input
│   └── Modal.tsx                # Accessible overlay dialog
├── pages/
│   ├── landing/LandingPage.tsx  # Hero, pure CSS mockup illustration, features, CTA
│   ├── auth/LoginPage.tsx       # Student & Admin multi-role login with 1-click demos
│   ├── auth/RegisterPage.tsx    # Full student registration with CGPA & skill pickers
│   ├── student/                 # Dashboard, Profile, Jobs, Applications, Prep, etc.
│   ├── admin/                   # Dashboard, Students, Companies, Jobs, Pipeline, Reports
│   └── guide/                   # In-app architecture & viva defense guide
├── App.tsx                      # Master layout router and view controller
└── main.tsx                     # Vite React root mount point`}
            </pre>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">Relational Entity-Relationship (ER) Design</h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px]">
              <p><strong>Students</strong> (1) ───<span className="text-indigo-600">&lt;applied&gt;</span>─── (N) <strong>Applications</strong> (N) ───<span className="text-indigo-600">&lt;for&gt;</span>─── (1) <strong>Jobs</strong></p>
              <p><strong>Companies</strong> (1) ───<span className="text-indigo-600">&lt;posts&gt;</span>─── (N) <strong>Jobs</strong></p>
              <p><strong>Applications</strong> (1) ───<span className="text-indigo-600">&lt;schedules&gt;</span>─── (N) <strong>Interviews</strong></p>
              <p><strong>Jobs</strong> (1) ───<span className="text-indigo-600">&lt;links&gt;</span>─── (N) <strong>Assessments</strong></p>
            </div>
            <p className="text-slate-600">
              In localStorage, each entity has primary keys (<code>id</code>), foreign keys (
              <code>studentId</code>, <code>jobId</code>, <code>companyId</code>), and timestamps,
              guaranteeing a frictionless 1:1 mapping when migrating to PostgreSQL or MongoDB.
            </p>
          </div>
        )}

        {activeTab === 'backend' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">How to Connect a Real Backend (Node.js/Express or FastAPI)</h4>
            <p>
              Replace the methods in <code>src/services/storage.ts</code> with <code>fetch()</code> or
              Axios calls to an API gateway:
            </p>
            <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
{`// Example API Service replacement for StorageService:
const API_URL = import.meta.env.VITE_API_URL || 'https://api.placement-portal.edu';

export const ApiService = {
  async getJobs() {
    const res = await fetch(\`\${API_URL}/api/jobs\`, {
      headers: { Authorization: \`Bearer \${token}\` }
    });
    return res.json();
  },
  async applyJob(jobId, studentId) {
    const res = await fetch(\`\${API_URL}/api/applications\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, studentId })
    });
    return res.json();
  }
};`}
            </pre>
            <h4 className="font-bold text-slate-900 mt-3">Connecting PostgreSQL with Prisma ORM:</h4>
            <p className="text-slate-600">
              Run <code>npx prisma init</code>, define <code>model Student</code>, <code>model Job</code>,
              and <code>model Application</code> matching our TypeScript interfaces in <code>src/types/index.ts</code>.
            </p>
          </div>
        )}

        {activeTab === 'viva' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">Top 5 Viva Questions & Suggested Answers:</h4>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-indigo-800">
                  Q1: How does your Smart Eligibility algorithm work?
                </p>
                <p className="text-slate-600 mt-1">
                  <strong>Ans:</strong> The <code>checkEligibility()</code> function evaluates 4 criteria:
                  (1) Student CGPA ≥ Job Min CGPA, (2) Student department matches Job eligible branches,
                  (3) Graduation batch matches, and (4) Skill intersection analysis. It returns exact
                  rejection reasons if any condition fails.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-indigo-800">
                  Q2: Why use localStorage first, and how is it reactive?
                </p>
                <p className="text-slate-600 mt-1">
                  <strong>Ans:</strong> LocalStorage provides 100% offline, serverless evaluation for
                  demonstrations without server setup hurdles. We dispatch custom browser events (
                  <code>spms_storage_updated</code>) so that admin status edits immediately reflect in student
                  views without page reloads.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-indigo-800">
                  Q3: How do you prevent duplicate job applications?
                </p>
                <p className="text-slate-600 mt-1">
                  <strong>Ans:</strong> The application table is checked with <code>hasStudentApplied(studentId, jobId)</code>.
                  If true, the UI changes the &quot;Apply&quot; button to a disabled &quot;Applied&quot; badge, and the service
                  rejects duplicate entries.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">Why Vercel Throws 404 & How It Is Solved:</h4>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
              <p><strong>1. Build Failure Cause:</strong> If <code>src/App.tsx</code> was missing or Vite failed to build, Vercel had no <code>dist</code> folder to serve and rendered a 404.</p>
              <p><strong>2. SPA Routing Cause:</strong> In Single Page Applications (SPAs), any direct link or page refresh triggers a request to Vercel's edge server for an HTML file at that route path. Without rewrites, Vercel returns <code>404 NOT_FOUND</code>.</p>
              <p><strong>The Fix:</strong> We added an explicit <code>vercel.json</code> in the root configured with <code>"framework": "vite"</code>, <code>"outputDirectory": "dist"</code>, and rewrite rules directing all paths to <code>/index.html</code>.</p>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
{`// vercel.json (configured in root):
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`}
            </pre>
            <h4 className="font-bold text-slate-900 mt-2">Vercel Deployment Settings:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Framework Preset: <strong>Vite</strong></li>
              <li>Root Directory: <code>./</code> (leave default root)</li>
              <li>Build Command: <code>npm run build</code></li>
              <li>Output Directory: <code>dist</code></li>
              <li>Node Version: <strong>18.x or 20.x</strong> (default)</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};
